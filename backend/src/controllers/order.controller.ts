import { Request, Response } from 'express';
import crypto from 'crypto';
import { Order, OrderModel } from '../models/order.model.js';
import { ThemeModel } from '../models/theme.model.js';
import { SePayService } from '../services/sepay.service.js';
import { ResponseView } from '../views/response.view.js';
import { CheckoutOrderSchema } from '../validators/payment.validator.js';
import { ENV } from '../config/env.js';

function checkoutResponse(order: Order) {
  return {
    orderId: order.id,
    orderNumber: order.order_number,
    total_amount: Number(order.total_amount),
    currency: order.currency,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    order_status: order.order_status,
    vietQrUrl: order.payment_status === 'pending' && order.order_status === 'processing'
      ? SePayService.generateVietQrUrl(order.order_number, Number(order.total_amount)) : null,
  };
}

export class OrderController {
  static async checkout(req: Request, res: Response) {
    try {
      const parsed = CheckoutOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return ResponseView.error(res, parsed.error.errors.map(e => e.message).join(', '), 'VALIDATION_ERROR', 400);
      }
      const { idempotency_key, ...data } = parsed.data;
      // Normalize request identities, not server-calculated prices, for safe retries.
      data.items.sort((a, b) => a.theme_id - b.theme_id);
      const fingerprint = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

      // These integrations currently return test sessions, not real payment URLs.
      if (data.payment_method !== 'vietqr' || data.currency !== 'VND') {
        return ResponseView.error(res, 'Hiện chỉ hỗ trợ VietQR bằng VND. Stripe/PayPal chưa sẵn sàng; không tự quy đổi tiền tệ.', 'PAYMENT_UNAVAILABLE', 503);
      }
      const payment = ENV.PAYMENTS;
      if (!/^[0-9]{6}$/.test(payment.VIETQR_BANK_BIN)
        || !/^[0-9]{6,30}$/.test(payment.VIETQR_BANK_ACCOUNT)
        || payment.VIETQR_BANK_ACCOUNT === '0987654321'
        || !payment.VIETQR_ACCOUNT_NAME.trim()
        || !payment.SEPAY_API_KEY.trim()
        || payment.SEPAY_API_KEY === 'your_sepay_api_key_here') {
        return ResponseView.error(res, 'VietQR chưa được cấu hình đầy đủ. Chưa tạo đơn và chưa có thanh toán.', 'PAYMENT_NOT_CONFIGURED', 503);
      }

      const existing = await OrderModel.findByCheckoutKey(idempotency_key);
      if (existing) {
        if (existing.fingerprint !== fingerprint) {
          return ResponseView.error(res, 'Mã yêu cầu đã dùng cho nội dung khác. Vui lòng kiểm tra đơn trước khi thử lại.', 'IDEMPOTENCY_CONFLICT', 409);
        }
        return ResponseView.success(res, checkoutResponse(existing), 'Đã khôi phục đơn hàng hiện có; không tạo đơn mới.');
      }

      const pricedItems = [];
      let totalMinor = 0;
      for (const item of data.items) {
        // Strict MySQL lookup; findById's demo fallback is NOT suitable for checkout.
        // Check both ID and slug because the frontend catalog differs from DB seeds.
        const theme = await ThemeModel.findBySlug(item.theme_slug);
        if (!theme || theme.id !== item.theme_id) {
          return ResponseView.error(res, 'Sản phẩm trong giỏ chưa khớp catalog máy chủ hoặc đã ngừng bán. Vui lòng liên hệ hỗ trợ; giỏ hàng vẫn được giữ.', 'CATALOG_MISMATCH', 409);
        }
        const price = Number(theme.price_vnd);
        if (!Number.isSafeInteger(price) || price <= 0) {
          return ResponseView.error(res, 'Sản phẩm chưa có giá VND hợp lệ trên máy chủ.', 'PRICE_UNAVAILABLE', 409);
        }
        totalMinor += price * 100;
        pricedItems.push({ theme_id: theme.id, license_type: item.license_type, unit_price: price });
      }
      // orders.total_amount is DECIMAL(12, 2); never truncate an overflow.
      if (!Number.isSafeInteger(totalMinor) || totalMinor > 999999999999) {
        return ResponseView.error(res, 'Tổng đơn hàng vượt giới hạn lưu trữ hiện tại.', 'TOTAL_OUT_OF_RANGE', 400);
      }
      const total = totalMinor / 100;
      // Client total is a price-agreement check, NEVER the price source.
      if (data.total_amount !== total) {
        return ResponseView.error(res, 'Giá trong giỏ không khớp giá máy chủ. Chưa tạo đơn; vui lòng cập nhật catalog trước khi thanh toán.', 'PRICE_CHANGED', 409);
      }

      const orderNumber = 'OD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
      await OrderModel.createWithItems({
        ...data,
        order_number: orderNumber,
        total_amount: total,
        items: pricedItems,
        ip_address: req.ip || null,
        checkout: { key: idempotency_key, fingerprint },
      });
      const saved = await OrderModel.findByCheckoutKey(idempotency_key);
      if (!saved) throw new Error('ORDER_NOT_PERSISTED');
      return ResponseView.created(res, checkoutResponse(saved), 'Đơn hàng đã được lưu, chưa xác nhận thanh toán.');
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'IDEMPOTENCY_CONFLICT') {
        return ResponseView.error(res, 'Mã yêu cầu đã dùng cho nội dung khác.', 'IDEMPOTENCY_CONFLICT', 409);
      }
      // Do not expose SQL/credentials. Retrying the same key is safe.
      return ResponseView.error(res, 'Chưa xác nhận được việc lưu đơn. Vui lòng thử lại với cùng thông tin; giỏ hàng vẫn được giữ.', 'ORDER_STORAGE_UNAVAILABLE', 503);
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const order = await OrderModel.findByOrderNumber(req.params.orderNumber as string, true);
      if (!order) return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      let licenses: any[] = [];
      if (order.payment_status === 'paid') {
        const { LicenseModel } = await import('../models/license.model.js');
        licenses = await LicenseModel.findByOrderId(order.id);
      }
      return ResponseView.success(res, {
        orderNumber: order.order_number,
        payment_status: order.payment_status,
        order_status: order.order_status,
        currency: order.currency,
        total_amount: Number(order.total_amount),
        licenses: licenses.map(l => ({
          license_key: l.license_key,
          license_type: l.license_type,
          max_domains: l.max_domains,
          theme_name: l.theme_name,
        })),
      });
    } catch {
      return ResponseView.error(res, 'Chưa kiểm tra được trạng thái đơn hàng. Vui lòng thử lại.', 'ORDER_STATUS_UNAVAILABLE', 503);
    }
  }
}
