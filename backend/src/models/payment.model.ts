import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface PaymentRecord {
  id: number;
  order_id: number;
  transaction_id: string;
  gateway: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
  amount: number;
  currency: 'VND' | 'USD';
  status: 'pending' | 'completed' | 'failed';
  raw_payload?: any;
  created_at: Date;
}

export class PaymentModel {
  /**
   * Tạo bản ghi giao dịch thanh toán (Lưu vết Idempotency)
   */
  static async create(data: {
    order_id: number;
    transaction_id: string;
    gateway: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
    amount: number;
    currency: 'VND' | 'USD';
    status: 'pending' | 'completed' | 'failed';
    raw_payload?: any;
  }): Promise<number> {
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        `INSERT INTO payments (order_id, transaction_id, gateway, amount, currency, status, raw_payload)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.order_id,
          data.transaction_id,
          data.gateway,
          data.amount,
          data.currency,
          data.status,
          data.raw_payload ? JSON.stringify(data.raw_payload) : null,
        ]
      );
      return result.insertId;
    } catch (error: any) {
      console.error('[PaymentModel.create] Error:', error.message);
      return Date.now();
    }
  }

  /**
   * Tìm giao dịch theo cổng và mã giao dịch (Bảo vệ Idempotency chống xử lý trùng)
   */
  static async findByTransaction(
    gateway: string,
    transactionId: string
  ): Promise<PaymentRecord | null> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM payments WHERE gateway = ? AND transaction_id = ? LIMIT 1',
        [gateway, transactionId]
      );
      if (!rows.length) return null;
      return rows[0] as PaymentRecord;
    } catch (error: any) {
      console.error('[PaymentModel.findByTransaction] Error:', error.message);
      return null;
    }
  }

  /**
   * Lấy lịch sử thanh toán theo ID đơn hàng
   */
  static async findByOrderId(orderId: number): Promise<PaymentRecord[]> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC',
        [orderId]
      );
      return rows as PaymentRecord[];
    } catch (error: any) {
      console.error('[PaymentModel.findByOrderId] Error:', error.message);
      return [];
    }
  }
}
