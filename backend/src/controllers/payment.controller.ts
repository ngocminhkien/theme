import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { LicenseModel } from '../models/license.model.js';
import { LicenseService } from '../services/license.service.js';
import { SePayService } from '../services/sepay.service.js';
import { PaymentModel } from '../models/payment.model.js';
import { ResponseView } from '../views/response.view.js';
import { SepayWebhookSchema } from '../validators/payment.validator.js';
import { SecurityLogger } from '../middlewares/security.middleware.js';
import crypto from 'crypto';

// Mutex Lock chống Race Condition / Double Spending
const webhookProcessingLocks = new Set<string>();

export class PaymentController {
  /**
   * Webhook tự động nhận thông báo từ SePAY (VietQR 3 giây)
   * Tích hợp lớp phòng thủ chống tấn công Race Condition, Replay Attack & Giả mạo chữ ký
   */
  static async handleSepayWebhook(req: Request, res: Response) {
    try {
      // 1. Xác thực bảo mật chữ ký Webhook (Constant-time timing safe)
      const apiKey = req.headers['authorization'];
      if (!SePayService.verifyWebhook(apiKey)) {
        SecurityLogger.alert('INVALID_WEBHOOK_SIGNATURE', {
          ip: req.ip || req.headers['x-forwarded-for'],
          headers: req.headers,
        });
        return res.status(401).json({ success: false, message: 'Invalid SePAY Authorization Key' });
      }

      // 2. Validate payload schema bằng Zod
      const parseResult = SepayWebhookSchema.safeParse(req.body);
      if (!parseResult.success) {
        SecurityLogger.warn('MALFORMED_WEBHOOK_PAYLOAD', parseResult.error.errors);
        return res.status(400).json({ success: false, message: 'Dữ liệu webhook không hợp lệ', errors: parseResult.error.errors });
      }

      const {
        id: transactionId,
        content,
        transferAmount,
        gateway = 'vietqr',
      } = parseResult.data;

      SecurityLogger.info('WEBHOOK_RECEIVED', { transactionId, content, transferAmount });

      // 3. Phân tích nội dung chuyển khoản để lấy mã đơn hàng OD-YYYYMMDD-XXXX
      const match = content ? content.match(/OD-\d{8}-[A-F0-9]{6}/i) : null;
      if (!match) {
        SecurityLogger.warn('WEBHOOK_NO_ORDER_MATCH', { content });
        return res.status(200).json({ success: true, message: 'Bỏ qua vì không khớp cú pháp mã đơn' });
      }

      const orderNumber = match[0].toUpperCase();

      // 4. Concurrency Mutex Lock: Ngăn chặn xử lý đồng thời 2 webhook cho cùng 1 đơn hàng
      if (webhookProcessingLocks.has(orderNumber)) {
        SecurityLogger.warn('CONCURRENT_WEBHOOK_LOCKED', { orderNumber });
        return res.status(200).json({ success: true, message: 'Giao dịch đang được xử lý trong tiến trình song song an toàn' });
      }
      webhookProcessingLocks.add(orderNumber);

      try {
        const order = await OrderModel.findByOrderNumber(orderNumber);

        if (!order) {
          SecurityLogger.warn('ORDER_NOT_FOUND', { orderNumber });
          return res.status(200).json({ success: true, message: 'Đơn hàng không tồn tại' });
        }

        // 5. Bảo vệ Idempotency: Kiểm tra giao dịch đã từng xử lý chưa
        const uniqueTxId = String(transactionId || `TX-${orderNumber}-${Date.now()}`);
        const existingPayment = await PaymentModel.findByTransaction('vietqr', uniqueTxId);
        if (existingPayment || order.payment_status === 'paid') {
          SecurityLogger.info('WEBHOOK_ALREADY_PROCESSED', { uniqueTxId, orderNumber });
          return res.status(200).json({ success: true, message: 'Đơn hàng đã được xử lý trước đó' });
        }

        // 6. Kiểm tra số tiền chuyển thực tế (phải >= tổng tiền đơn hàng)
        const paidAmount = Number(transferAmount);
        if (paidAmount < order.total_amount) {
          SecurityLogger.alert('INSUFFICIENT_PAYMENT_DETECTED', {
            orderNumber,
            paidAmount,
            orderTotal: order.total_amount,
          });
          return res.status(400).json({ success: false, message: 'Số tiền chuyển khoản chưa đủ' });
        }

      // 4. Cập nhật trạng thái đơn hàng sang 'paid'
      await OrderModel.markAsPaid(order.id);

      // 5. Ghi nhận giao dịch vào bảng payments
      await PaymentModel.create({
        order_id: order.id,
        transaction_id: uniqueTxId,
        gateway: 'vietqr',
        amount: paidAmount,
        currency: 'VND',
        status: 'completed',
        raw_payload: req.body,
      });

      // 6. Cấp phát License Key cho từng sản phẩm trong đơn hàng
      const itemsToLicense = order.items && order.items.length > 0
        ? order.items
        : [{ theme_id: 1, license_type: 'regular' as const, unit_price: order.total_amount }];

      const generatedLicenses = [];
      for (const item of itemsToLicense) {
        const licenseKey = LicenseService.generateKey();
        const maxDomains =
          item.license_type === 'lifetime' ? 999 : item.license_type === 'agency' ? 5 : 1;

        await LicenseModel.create({
          license_key: licenseKey,
          order_id: order.id,
          theme_id: item.theme_id,
          user_id: order.user_id,
          license_type: item.license_type,
          max_domains: maxDomains,
        });

        generatedLicenses.push({ licenseKey, themeId: item.theme_id, licenseType: item.license_type });
      }

      console.log(`⚡ [SePAY Webhook] Đơn ${orderNumber} đã thanh toán thành công trong 3s! Đã cấp ${generatedLicenses.length} License Key.`);

      return res.status(200).json({
        success: true,
        message: 'Kích hoạt đơn hàng và sinh License Key thành công trong 3 giây',
        data: {
          orderNumber,
          licenses: generatedLicenses,
        },
      });
    } finally {
      webhookProcessingLocks.delete(orderNumber);
    }
    } catch (error: any) {
      console.error('[SePAY Webhook Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Tạo phiên thanh toán quốc tế bằng Stripe (USD)
   */
  static async createStripeSession(req: Request, res: Response) {
    try {
      const { orderNumber } = req.body;
      if (!orderNumber) {
        return ResponseView.error(res, 'Vui lòng cung cấp mã đơn hàng orderNumber.');
      }

      const order = await OrderModel.findByOrderNumber(orderNumber);
      if (!order) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      }

      // Giả lập/Tạo Stripe Session ID an toàn
      const sessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
      const clientSecret = `pi_${crypto.randomBytes(12).toString('hex')}_secret_${crypto.randomBytes(8).toString('hex')}`;

      return ResponseView.success(res, {
        orderNumber: order.order_number,
        sessionId,
        clientSecret,
        amount: order.total_amount,
        currency: 'USD',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sample',
      }, 'Khởi tạo phiên Stripe Checkout thành công.');
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Webhook Stripe xử lý sự kiện thanh toán thẻ hoàn tất
   */
  static async handleStripeWebhook(req: Request, res: Response) {
    try {
      const event = req.body;
      const eventType = event.type || 'checkout.session.completed';
      const eventId = event.id || `evt_${Date.now()}`;

      console.log(`[Stripe Webhook] Nhận sự kiện: ${eventType} (#${eventId})`);

      const session = event.data?.object || event;
      const orderNumber = session.metadata?.orderNumber || session.client_reference_id;

      if (orderNumber) {
        const order = await OrderModel.findByOrderNumber(orderNumber);
        if (order && order.payment_status !== 'paid') {
          await OrderModel.markAsPaid(order.id);

          await PaymentModel.create({
            order_id: order.id,
            transaction_id: eventId,
            gateway: 'stripe',
            amount: order.total_amount,
            currency: 'USD',
            status: 'completed',
            raw_payload: event,
          });

          // Cấp license key
          const licenseKey = LicenseService.generateKey();
          await LicenseModel.create({
            license_key: licenseKey,
            order_id: order.id,
            theme_id: 1,
            user_id: order.user_id,
            license_type: 'regular',
            max_domains: 1,
          });

          console.log(`[Stripe Webhook] Đơn ${orderNumber} đã thanh toán thành công và cấp key: ${licenseKey}`);
        }
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('[Stripe Webhook Error]:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
