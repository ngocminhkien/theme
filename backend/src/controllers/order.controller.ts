import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { SePayService } from '../services/sepay.service.js';
import { ResponseView } from '../views/response.view.js';
import crypto from 'crypto';

export class OrderController {
  static async checkout(req: Request, res: Response) {
    try {
      const { customer_name, customer_email, total_amount, currency = 'VND', payment_method = 'vietqr' } = req.body;

      if (!customer_name || !customer_email || !total_amount) {
        return ResponseView.error(res, 'Vui lòng cung cấp đầy đủ họ tên, email và số tiền.');
      }

      // Tạo mã đơn hàng độc nhất: OD-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderNumber = `OD-${dateStr}-${randomSuffix}`;

      const orderId = await OrderModel.create({
        order_number: orderNumber,
        customer_name,
        customer_email,
        total_amount,
        currency,
        payment_method,
      });

      // Nếu chọn thanh toán VietQR: sinh link ảnh QR code
      let qrUrl = null;
      if (payment_method === 'vietqr' && currency === 'VND') {
        qrUrl = SePayService.generateVietQrUrl(orderNumber, total_amount);
      }

      return ResponseView.created(res, {
        orderId,
        orderNumber,
        total_amount,
        currency,
        payment_method,
        vietQrUrl: qrUrl,
      }, 'Khởi tạo đơn hàng thành công.');
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
