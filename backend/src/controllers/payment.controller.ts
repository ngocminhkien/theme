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
import { ENV } from '../config/env.js';
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

      const order = await OrderModel.findByOrderNumber(orderNumber);
      if (order) {
        if (order.payment_status === 'paid') {
          SecurityLogger.info('WEBHOOK_ALREADY_PROCESSED', { transactionId: safeTransactionId, orderNumber });
          return res.status(200).json({
            success: true,
            message: 'Đơn hàng đã được xử lý trước đó',
            data: { orderNumber },
          });
        }
        if (Number(transferAmount) < Number(order.total_amount)) {
          SecurityLogger.warn('WEBHOOK_UNDERPAID', {
            transactionId: safeTransactionId,
            orderNumber,
            transferAmount,
            expected: order.total_amount,
          });
          return res.status(400).json({
            success: false,
            message: 'Số tiền chuyển khoản chưa đủ',
          });
        }
      }

      const result = await PaymentFulfillmentService.fulfillVietQr({
        orderNumber,
        transactionId: safeTransactionId,
        paidAmount: Number(transferAmount),
        transactionDate,
        accountNumber,
      });

      if (result.status === 'already_processed') {
        return res.status(200).json({ success: true, message: 'Đơn hàng đã được xử lý trước đó' });
      }

      if (result.status === 'rejected') {
        SecurityLogger.alert('WEBHOOK_REJECTED', {
          transactionId: safeTransactionId,
          orderNumber: result.orderNumber,
          code: result.code,
        });
        return res.status(200).json({ success: true, message: 'Webhook không khớp đơn hàng; đã ghi nhận để đối soát.' });
      }

      if (result.status === 'fulfilled') {
        let licenses: any[] = [];
        if (order) {
          licenses = await LicenseModel.findByOrderId(order.id);
        }
        const formattedLicenses = licenses.map((l: any) => ({
          licenseKey: l.license_key || l.licenseKey,
          license_key: l.license_key || l.licenseKey,
          themeId: l.theme_id || l.themeId || 1,
          licenseType: l.license_type || l.licenseType || 'regular',
        }));
        return res.status(200).json({
          success: true,
          message: 'Đã xác nhận thanh toán và cấp license.',
          data: {
            orderNumber,
            licenses: formattedLicenses,
          },
        });
      }

      return res.status(200).json({ success: true, message: 'Webhook không khớp đơn hàng; đã ghi nhận để đối soát.' });
    } catch (error: any) {
      SecurityLogger.alert('SEPAY_FULFILLMENT_UNAVAILABLE', { transactionId, orderNumber });
      return res.status(503).json({ success: false, message: 'Chưa thể đối soát thanh toán. SePAY sẽ thử lại.' });
    }
  }

  /**
   * Xác thực HMAC-SHA256 signature của Stripe Webhook với timingSafeEqual
   */
  static verifyStripeSignature(payload: string, header: string, secret: string): boolean {
    try {
      if (header.includes('t=') && header.includes('v1=')) {
        const parts = header.split(',');
        let timestamp = '';
        let sig = '';
        for (const p of parts) {
          const [k, v] = p.trim().split('=');
          if (k === 't') timestamp = v;
          if (k === 'v1') sig = v;
        }
        if (!timestamp || !sig) return false;
        const signedPayload = `${timestamp}.${payload}`;
        const computed = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
        const bufA = Buffer.from(sig, 'hex');
        const bufB = Buffer.from(computed, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
      } else {
        const cleanSig = header.trim();
        const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        const bufA = Buffer.from(cleanSig, 'hex');
        const bufB = Buffer.from(computed, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
      }
    } catch {
      return false;
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
   * Webhook Stripe xử lý sự kiện thanh toán thẻ hoàn tất với chữ ký bảo mật và đối soát số tiền
   */
  static async handleStripeWebhook(req: Request, res: Response) {
    try {
      const signatureHeader = (req.headers['stripe-signature'] as string | undefined)?.trim();
      if (!signatureHeader) {
        SecurityLogger.alert('STRIPE_WEBHOOK_UNSIGNED', { ip: req.ip || req.headers['x-forwarded-for'] });
        return res.status(401).json({ error: 'Missing stripe-signature header' });
      }

      const secret = ENV.PAYMENTS.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
      if (!secret) {
        SecurityLogger.alert('STRIPE_WEBHOOK_UNCONFIGURED', 'Stripe webhook secret chưa được cấu hình');
        return res.status(503).json({ error: 'Stripe webhook secret is not configured' });
      }

      const rawPayload = typeof (req as any).rawBody === 'string'
        ? (req as any).rawBody
        : Buffer.isBuffer((req as any).rawBody)
          ? (req as any).rawBody.toString('utf8')
          : JSON.stringify(req.body);

      const isValidSignature = PaymentController.verifyStripeSignature(rawPayload, signatureHeader, secret);
      if (!isValidSignature) {
        SecurityLogger.alert('STRIPE_WEBHOOK_INVALID_SIGNATURE', { ip: req.ip || req.headers['x-forwarded-for'] });
        return res.status(401).json({ error: 'Invalid stripe-signature header' });
      }

      const event = req.body;
      if (!event || typeof event !== 'object') {
        return res.status(400).json({ error: 'Invalid webhook payload structure' });
      }

      const eventType = event.type || 'checkout.session.completed';
      const eventId = event.id || `evt_${Date.now()}`;

      if (eventType !== 'checkout.session.completed' && eventType !== 'payment_intent.succeeded') {
        return res.status(200).json({ received: true, ignored: true });
      }

      const session = event.data?.object || event;
      const orderNumber = session.metadata?.orderNumber || session.client_reference_id;

      if (!orderNumber) {
        return res.status(400).json({ error: 'Missing order reference (client_reference_id or metadata.orderNumber)' });
      }

      const order = await OrderModel.findByOrderNumber(orderNumber);
      if (!order) {
        return res.status(404).json({ error: 'Không tìm thấy đơn hàng tương ứng' });
      }

      // Kiểm tra đơn vị tiền tệ
      if (session.currency && session.currency.toUpperCase() !== order.currency.toUpperCase()) {
        SecurityLogger.alert('STRIPE_CURRENCY_MISMATCH', {
          orderNumber,
          expected: order.currency,
          received: session.currency,
        });
        return res.status(400).json({ error: 'Đơn vị tiền tệ thanh toán không khớp đơn hàng' });
      }

      // Kiểm tra số tiền chuyển khoản khớp với giá trị đơn hàng
      const paidAmount = session.amount_total !== undefined ? session.amount_total : session.amount;
      if (paidAmount !== undefined) {
        const orderAmount = Number(order.total_amount);
        const matchesStandard = paidAmount === orderAmount;
        const matchesCents = paidAmount === Math.round(orderAmount * 100);
        if (!matchesStandard && !matchesCents) {
          SecurityLogger.alert('STRIPE_AMOUNT_MISMATCH', {
            orderNumber,
            expected: orderAmount,
            received: paidAmount,
          });
          return res.status(400).json({ error: 'Số tiền thanh toán không khớp với tổng tiền đơn hàng' });
        }
      }

      if (order.payment_status === 'paid') {
        return res.status(200).json({ received: true, message: 'Đơn hàng đã được xử lý trước đó' });
      }

      await OrderModel.markAsPaid(order.id);

      await PaymentModel.create({
        order_id: order.id,
        transaction_id: eventId,
        gateway: 'stripe',
        amount: order.total_amount,
        currency: order.currency || 'USD',
        status: 'completed',
        raw_payload: event,
      });

      // Cấp license key
      const items = order.items && order.items.length > 0
        ? order.items
        : [{ theme_id: 1, license_type: 'regular' as const }];

      for (const item of items) {
        const licenseKey = LicenseService.generateKey();
        await LicenseModel.create({
          license_key: licenseKey,
          order_id: order.id,
          theme_id: item.theme_id || 1,
          user_id: order.user_id || null,
          license_type: item.license_type || 'regular',
          max_domains: 1,
        });
      }

      return res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('[Stripe Webhook Error]:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}
