import { Request, Response } from 'express';
import { OrderModel } from '../models/order.model.js';
import { SePayService } from '../services/sepay.service.js';
import { LicenseModel } from '../models/license.model.js';
import { ResponseView } from '../views/response.view.js';
import crypto from 'crypto';

export class OrderController {
  /**
   * Tạo đơn hàng mới (One-Page Checkout / Guest Checkout)
   */
  static async checkout(req: Request, res: Response) {
    try {
      const {
        customer_name,
        customer_email,
        customer_phone,
        total_amount,
        currency = 'VND',
        payment_method = 'vietqr',
        items = [],
      } = req.body;

      if (!customer_name || !customer_email || !total_amount) {
        return ResponseView.error(
          res,
          'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Tổng số tiền thanh toán.'
        );
      }

      // Tạo mã đơn hàng duy nhất: OD-YYYYMMDD-XXXXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      const orderNumber = `OD-${dateStr}-${randomSuffix}`;

      // Chuẩn bị items mặc định nếu client chưa truyền
      const formattedItems =
        items.length > 0
          ? items
          : [
              {
                theme_id: 1,
                license_type: 'regular' as const,
                unit_price: Number(total_amount),
              },
            ];

      // Ghi nhận đơn hàng với Database Transaction (ACID)
      const { orderId } = await OrderModel.createWithItems({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        total_amount: Number(total_amount),
        currency: currency.toUpperCase() === 'USD' ? 'USD' : 'VND',
        payment_method,
        ip_address: req.ip || (req.headers['x-forwarded-for'] as string) || null,
        items: formattedItems,
      });

      // 1. Nếu chọn thanh toán VietQR (Việt Nam)
      let qrUrl = null;
      if (payment_method === 'vietqr') {
        qrUrl = SePayService.generateVietQrUrl(orderNumber, Number(total_amount));
      }

      // 2. Nếu chọn thanh toán Stripe (Quốc tế)
      let stripeClientSecret = null;
      if (payment_method === 'stripe') {
        stripeClientSecret = `pi_test_${crypto.randomBytes(12).toString('hex')}_secret`;
      }

      return ResponseView.created(
        res,
        {
          orderId,
          orderNumber,
          customer_name,
          customer_email,
          total_amount: Number(total_amount),
          currency,
          payment_method,
          vietQrUrl: qrUrl,
          stripeClientSecret,
          items: formattedItems,
        },
        'Khởi tạo đơn hàng thành công.'
      );
    } catch (error: any) {
      console.error('[OrderController.checkout] Error:', error);
      return ResponseView.error(res, error.message);
    }
  }

  /**
   * Kiểm tra trạng thái đơn hàng (Polling 3s từ Frontend)
   */
  static async getOrderStatus(req: Request, res: Response) {
    try {
      const orderNumber = req.params.orderNumber as string;
      const order = await OrderModel.findByOrderNumber(orderNumber);

      if (!order) {
        return ResponseView.notFound(res, 'Không tìm thấy đơn hàng trên hệ thống.');
      }

      // Lấy danh sách License Key nếu đơn hàng đã được thanh toán
      let licenses: any[] = [];
      if (order.payment_status === 'paid') {
        // Tìm license theo order
        try {
          const license = await LicenseModel.findByKey(`WD-${orderNumber}`);
          if (license) licenses.push(license);
        } catch (_) {}
      }

      return ResponseView.success(res, {
        orderNumber: order.order_number,
        payment_status: order.payment_status,
        order_status: order.order_status,
        total_amount: order.total_amount,
        currency: order.currency,
        customer_email: order.customer_email,
        licenses,
      });
    } catch (error: any) {
      return ResponseView.error(res, error.message);
    }
  }
}
