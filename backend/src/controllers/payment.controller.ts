import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { LicenseModel } from '../models/license.model.js';
import { LicenseService } from '../services/license.service.js';
import { SePayService } from '../services/sepay.service.js';

export class PaymentController {
  /**
   * Webhook tự động nhận thông báo từ SePAY khi khách quét QR thanh toán thành công
   */
  static async handleSepayWebhook(req: Request, res: Response) {
    try {
      const apiKey = req.headers['authorization'];
      if (!SePayService.verifyWebhook(apiKey)) {
        return res.status(401).json({ success: false, message: 'Invalid SePAY API Key' });
      }

      const { content, transferAmount } = req.body;
      console.log(`[SePAY Webhook] Nhận thông báo giao dịch: ${content}, Số tiền: ${transferAmount}`);

      // Tìm mã đơn hàng OD-YYYYMMDD-XXXX trong nội dung chuyển khoản
      const match = content ? content.match(/OD-\d{8}-[A-F0-9]{6}/i) : null;
      if (!match) {
        console.warn('[SePAY Webhook] Không tìm thấy mã đơn hàng hợp lệ trong nội dung chuyển khoản.');
        return res.status(200).json({ success: true, message: 'Không khớp mã đơn hàng, bỏ qua' });
      }

      const orderNumber = match[0].toUpperCase();
      const order = await OrderModel.findByOrderNumber(orderNumber);

      if (!order) {
        console.warn(`[SePAY Webhook] Không tìm thấy đơn hàng: ${orderNumber}`);
        return res.status(200).json({ success: true, message: 'Đơn hàng không tồn tại' });
      }

      if (order.payment_status === 'paid') {
        return res.status(200).json({ success: true, message: 'Đơn hàng đã được thanh toán trước đó' });
      }

      // Xác nhận thanh toán thành công
      await OrderModel.markAsPaid(order.id);

      // Tự động sinh License Key cho khách
      const licenseKey = LicenseService.generateKey();
      await LicenseModel.create({
        license_key: licenseKey,
        order_id: order.id,
        theme_id: 1, // Gán theme ID tương ứng
        user_id: order.user_id,
        max_domains: 1,
      });

      console.log(`[SePAY Webhook] Đơn hàng ${orderNumber} thanh toán thành công! Đã cấp License: ${licenseKey}`);
      return res.status(200).json({ success: true, message: 'Đã kích hoạt đơn hàng thành công' });
    } catch (error: any) {
      console.error('[SePAY Webhook Error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
