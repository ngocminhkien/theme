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

const inMemoryPayments: PaymentRecord[] = [];

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
    const memRecord: PaymentRecord = {
      id: inMemoryPayments.length + 1,
      order_id: data.order_id,
      transaction_id: data.transaction_id,
      gateway: data.gateway,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      raw_payload: data.raw_payload,
      created_at: new Date(),
    };
    inMemoryPayments.push(memRecord);

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
      console.warn('[PaymentModel.create] DB Error, lưu in-memory:', error.message);
      return memRecord.id;
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
      if (rows.length > 0) return rows[0] as PaymentRecord;
    } catch (error: any) {
      console.warn('[PaymentModel.findByTransaction] DB Error, tra cứu in-memory:', error.message);
    }
    const mem = inMemoryPayments.find(p => p.gateway === gateway && p.transaction_id === transactionId);
    return mem || null;
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
