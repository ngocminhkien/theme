import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { LicenseModel } from '../models/license.model.js';
import { LicenseService } from '../services/license.service.js';
import { SePayService } from '../services/sepay.service.js';
import { PaymentModel } from '../models/payment.model.js';
import { PaymentFulfillmentService } from '../services/payment-fulfillment.service.js';
import { ResponseView } from '../views/response.view.js';
import { SepayWebhookSchema } from '../validators/payment.validator.js';
import { SecurityLogger } from '../middlewares/security.middleware.js';
import crypto from 'crypto';

export class PaymentController {
  /**
   * Webhook tự động nhận thông báo từ SePAY (VietQR 3 giây)
   * Tích hợp lớp phòng thủ chống tấn công Race Condition, Replay Attack & Giả mạo chữ ký
   */
  static async handleSepayWebhook(req: Request, res: Response) {
    let transactionId: string | undefined;
    let orderNumber: string | undefined;
    try {
      // 1. Xác thực bảo mật chữ ký Webhook (Constant-time timing safe)
      const apiKey = req.headers['authorization'];
      if (!SePayService.verifyWebhook(apiKey)) {
        SecurityLogger.alert('INVALID_WEBHOOK_SIGNATURE', {
          ip: req.ip || req.headers['x-forwarded-for'],
        });
        return res.status(401).json({ success: false, message: 'Invalid SePAY Authorization Key' });
      }

      // 2. Validate payload schema bằng Zod
      const parseResult = SepayWebhookSchema.safeParse(req.body);
      if (!parseResult.success) {
        SecurityLogger.warn('MALFORMED_WEBHOOK_PAYLOAD', {
          fields: parseResult.error.errors.map(error => error.path.join('.') || 'body'),
        });
        return res.status(400).json({ success: false, message: 'Dữ liệu webhook không hợp lệ', errors: parseResult.error.errors });
      }

      const {
        id: webhookTransactionId,
        content,
        transferAmount,
        gateway,
        accountNumber,
        transactionDate,
      } = parseResult.data;
      const safeTransactionId = String(webhookTransactionId);

      // `gateway` in SePAY payloads is normally a bank name, so it cannot be
      // compared to our internal value `vietqr`. Explicit alternative gateways
      // are nevertheless invalid at the dedicated SePAY endpoint.
      if (gateway && ['stripe', 'paypal', 'momo', 'zalopay'].includes(gateway.toLowerCase())) {
        SecurityLogger.warn('WEBHOOK_GATEWAY_REJECTED', { transactionId: safeTransactionId });
        return res.status(200).json({ success: true, message: 'Bỏ qua gateway không thuộc SePAY/VietQR' });
      }

      SecurityLogger.info('WEBHOOK_RECEIVED', { transactionId: safeTransactionId, transferAmount });

      // 3. Phân tích nội dung chuyển khoản để lấy mã đơn hàng OD-YYYYMMDD-XXXX
      const match = content ? content.match(/OD-\d{8}-[A-F0-9]{6}/i) : null;
      if (!match) {
        SecurityLogger.warn('WEBHOOK_NO_ORDER_MATCH', { transactionId: safeTransactionId, contentLength: content.length });
        return res.status(200).json({ success: true, message: 'Bỏ qua vì không khớp cú pháp mã đơn' });
      }

      orderNumber = match[0].toUpperCase();
      transactionId = safeTransactionId;

      const result = await PaymentFulfillmentService.fulfillVietQr({
        orderNumber,
        transactionId: safeTransactionId,
        paidAmount: Number(transferAmount),
        transactionDate,
        accountNumber,
      });

      if (result.status === 'fulfilled') {
        SecurityLogger.info('WEBHOOK_FULFILLED', {
          transactionId: safeTransactionId,
          orderNumber: result.orderNumber,
          amount: transferAmount,
          licenseCount: result.licenseCount,
        });
        return res.status(200).json({ success: true, message: 'Đã xác nhận thanh toán và cấp license.' });
      }

      if (result.status === 'already_processed') {
        SecurityLogger.info('WEBHOOK_ALREADY_PROCESSED', { transactionId: safeTransactionId, orderNumber: result.orderNumber });
        return res.status(200).json({ success: true, message: 'Giao dịch hoặc đơn hàng đã được xử lý.' });
      }

      // A permanent mismatch must acknowledge delivery so SePAY does not retry it
      // indefinitely. It is retained as a redacted security/audit event for manual reconciliation.
      SecurityLogger.alert('WEBHOOK_REJECTED', {
        transactionId: safeTransactionId,
        orderNumber: result.orderNumber,
        code: result.code,
      });
      return res.status(200).json({ success: true, message: 'Webhook không khớp đơn hàng; đã ghi nhận để đối soát.' });
    } catch (error: any) {
      // A non-2xx response asks SePAY to retry transient database failures.
      // Never put raw webhook body, authorization, SQL messages or customer data in logs/responses.
      SecurityLogger.alert('SEPAY_FULFILLMENT_UNAVAILABLE', { transactionId, orderNumber });
      return res.status(503).json({ success: false, message: 'Chưa thể đối soát thanh toán. SePAY sẽ thử lại.' });
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
