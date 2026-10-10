import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface Order {
  id: number;
  order_number: string;
  user_id?: number;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: Date;
}

export class OrderModel {
  static async create(orderData: {
    order_number: string;
    user_id?: number;
    customer_email: string;
    customer_name: string;
    total_amount: number;
    currency: 'VND' | 'USD';
    payment_method: string;
  }): Promise<number> {
    const [result] = await dbPool.query<ResultSetHeader>(
      `INSERT INTO orders (order_number, user_id, customer_email, customer_name, total_amount, currency, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.order_number,
        orderData.user_id || null,
        orderData.customer_email,
        orderData.customer_name,
        orderData.total_amount,
        orderData.currency,
        orderData.payment_method,
      ]
    );
    return result.insertId;
  }

  static async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE order_number = ? LIMIT 1',
      [orderNumber]
    );
    if (!rows.length) return null;
    return rows[0] as Order;
  }

  static async markAsPaid(orderId: number): Promise<boolean> {
    const [result] = await dbPool.query<ResultSetHeader>(
      'UPDATE orders SET payment_status = "paid", order_status = "completed" WHERE id = ?',
      [orderId]
    );
    return result.affectedRows > 0;
  }
}
