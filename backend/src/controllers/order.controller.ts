import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { ThemeModel } from '../models/theme.model.js';
import { SePayService } from '../services/sepay.service.js';
import { ResponseView } from '../views/response.view.js';
import { CheckoutOrderSchema } from '../validators/payment.validator.js';
import { SecurityLogger } from '../middlewares/security.middleware.js';
import crypto from 'crypto';

export class OrderController {
  static async checkout(req: Request, res: Response) {
    try {
      // 1. Kiểm thực Schema đầu vào bằng Zod (Ngăn chặn dữ liệu rác, injection)
      const parseResult = CheckoutOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        const errorMsg = parseResult.error.errors.map((e) => e.message).join(', ');
        return ResponseView.error(res, errorMsg, 'VALIDATION_ERROR', 400);
      }

      const {
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        currency,
        payment_method,
        theme_id,
        license_type,
        items,
      } = parseResult.data;

      // 2. Bảo vệ toàn vẹn giá tiền phía Server (Server-Side Price Integrity)
      // Chống hành vi hacker dùng F12/Postman sửa giá theme từ 890.000đ xuống 1.000đ
      let validatedTotal = total_amount;
      const targetThemeId = theme_id || (items && items[0]?.theme_id);

      if (targetThemeId) {
        const theme = await ThemeModel.findById(targetThemeId);
        if (theme) {
          const basePrice = currency === 'USD' ? theme.price_usd : theme.price_vnd;
          const targetLicenseType = license_type || (items && items[0]?.license_type) || 'regular';
          const multiplier = targetLicenseType === 'lifetime' ? 3 : targetLicenseType === 'agency' ? 2 : 1;
          const expectedPrice = Math.round(basePrice * multiplier);

          // Nếu client gửi số tiền nhỏ hơn giá niêm yết -> Cảnh báo can thiệp giá!
          if (total_amount < expectedPrice * 0.9) { // cho phép sai số tối đa 10% voucher hợp lệ
            SecurityLogger.alert('PRICE_TAMPERING_ATTEMPT', {
              ip: req.ip || req.headers['x-forwarded-for'],
              email: customer_email,
              clientPrice: total_amount,
              expectedPrice,
              themeId: targetThemeId,
            });
            return ResponseView.error(
              res,
              `Phát hiện sai lệch giá tiền! Số tiền thanh toán (${total_amount}) không khớp với giá niêm yết của theme (${expectedPrice} ${currency}).`,
              'PRICE_TAMPERING_DETECTED',
              400
            );
          }
          validatedTotal = expectedPrice;
        }
      }

      // 3. Tạo mã đơn hàng độc nhất Cryptographically: OD-YYYYMMDD-XXXXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderNumber = `OD-${dateStr}-${randomSuffix}`;

      const clientIp = (req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1').split(',')[0].trim();

      const orderId = await OrderModel.create({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        total_amount: validatedTotal,
        currency,
        payment_method,
        ip_address: clientIp,
      });

      // 4. Nếu chọn thanh toán VietQR: sinh link ảnh QR code chuẩn
      let qrUrl = null;
      if (payment_method === 'vietqr' && currency === 'VND') {
        qrUrl = SePayService.generateVietQrUrl(orderNumber, validatedTotal);
      }

      SecurityLogger.info('ORDER_CREATED', { orderNumber, customer_email, total: validatedTotal, currency, ip: clientIp });

      return ResponseView.created(
        res,
        {
          orderId,
          orderNumber,
          total_amount: validatedTotal,
          currency,
          payment_method,
          vietQrUrl: qrUrl,
        },
        'Khởi tạo đơn hàng thành công.'
      );
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const { orderNumber } = req.params;
      const order = await OrderModel.findByOrderNumber(orderNumber as string);
      if (!order) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng.');
      }

      let licenses: any[] = [];
      if (order.payment_status === 'paid') {
        const { LicenseModel } = await import('../models/license.model.js');
        licenses = await LicenseModel.findByOrderId(order.id);
      }

      return ResponseView.success(res, {
        orderNumber: order.order_number,
        payment_status: order.payment_status,
        order_status: order.order_status,
        licenses: licenses.map(l => ({
          license_key: l.license_key,
          license_type: l.license_type,
          max_domains: l.max_domains,
          theme_name: l.theme_name || 'Woodmart Theme',
        })),
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
