import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbPool } from '../config/database.js';

export interface OrderItem {
  id?: number;
  order_id?: number;
  theme_id: number;
  theme_name?: string;
  license_type: 'regular' | 'agency' | 'lifetime';
  unit_price: number;
  created_at?: Date;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number | null;
  customer_email: string;
  customer_name: string;
  customer_phone?: string | null;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  ip_address?: string | null;
  items?: OrderItem[];
  created_at: Date;
  updated_at?: Date;
}

// Bộ nhớ tạm Fallback phục vụ test khi Database chưa khởi tạo
const inMemoryOrders = new Map<string, Order>();

export class OrderModel {
  /** Strict DB lookup: Checkout must never succeed using demo/in-memory orders. */
  static async findByCheckoutKey(key: string): Promise<(Order & { fingerprint: string }) | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT o.*, r.fingerprint FROM checkout_requests r
       JOIN orders o ON o.id = r.order_id WHERE r.idempotency_key = ? LIMIT 1`, [key]
    );
    return rows.length ? rows[0] as Order & { fingerprint: string } : null;
  }

  /**
   * Tạo đơn hàng đơn giản (alias tương thích với OrderController.checkout)
   */
  static async create(data: {
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    currency?: 'VND' | 'USD';
    payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
    user_id?: number | null;
    customer_phone?: string | null;
    ip_address?: string | null;
  }): Promise<number> {
    const result = await this.createWithItems({
      ...data,
      currency: data.currency || 'VND',
    });
    return result.orderId;
  }

  /**
   * Tạo đơn hàng cùng chi tiết sản phẩm sử dụng Database Transaction (ACID)
   */
  static async createWithItems(data: {
    checkout?: { key: string; fingerprint: string };
    order_number: string;
    user_id?: number | null;
    customer_email: string;
    customer_name: string;
    customer_phone?: string | null;
    total_amount: number;
    currency: 'VND' | 'USD';
    payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
    ip_address?: string | null;
    items?: Array<{
      theme_id: number;
      license_type?: 'regular' | 'agency' | 'lifetime';
      unit_price: number;
    }>;
  }): Promise<{ orderId: number; orderNumber: string }> {
    let connection;
    try {
      connection = await dbPool.getConnection();
      await connection.beginTransaction();

      if (data.checkout) {
        if (!data.items?.length) throw new Error('Checkout requires order items');
        // A unique key serializes concurrent retries across all API instances.
        await connection.query(
          'INSERT INTO checkout_requests (idempotency_key, fingerprint) VALUES (?, ?)',
          [data.checkout.key, data.checkout.fingerprint]
        );
      }

      // 1. Chèn đơn hàng vào bảng orders (9 tham số)
      const [orderResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO orders (order_number, user_id, customer_email, customer_name, customer_phone, total_amount, currency, payment_method, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.order_number,
          data.user_id || null,
          data.customer_email,
          data.customer_name,
          data.customer_phone || null,
          data.total_amount,
          data.currency,
          data.payment_method,
          data.ip_address || null,
        ]
      );

      const orderId = orderResult.insertId;

      // 2. Chèn từng sản phẩm vào bảng order_items nếu có
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await connection.query(
            `INSERT INTO order_items (order_id, theme_id, license_type, unit_price)
             VALUES (?, ?, ?, ?)`,
            [
              orderId,
              item.theme_id,
              item.license_type || 'regular',
              item.unit_price,
            ]
          );
        }
      }

      if (data.checkout) {
        await connection.query('UPDATE checkout_requests SET order_id = ? WHERE idempotency_key = ?',
          [orderId, data.checkout.key]);
      }
      await connection.commit();
      return { orderId, orderNumber: data.order_number };
    } catch (error: any) {
      if (connection) {
        try { await connection.rollback(); } catch (_) {}
      }
      if (data.checkout) {
        // Release before another pooled query (also safe with a pool of size one).
        connection?.release();
        connection = undefined;
        if (error.code === 'ER_DUP_ENTRY') {
          const existing = await this.findByCheckoutKey(data.checkout.key);
          if (existing?.fingerprint === data.checkout.fingerprint) {
            return { orderId: existing.id, orderNumber: existing.order_number };
          }
          if (existing) throw new Error('IDEMPOTENCY_CONFLICT');
        }
        throw error; // Never fall back to simulated storage for Checkout.
      }
      console.warn('[OrderModel.createWithItems] DB Error, sử dụng in-memory lưu trữ tạm:', error.message);

      // Fallback in-memory
      const fallbackId = inMemoryOrders.size + 1;
      const orderRecord: Order = {
        id: fallbackId,
        order_number: data.order_number,
        user_id: data.user_id || null,
        customer_email: data.customer_email,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone || null,
        total_amount: data.total_amount,
        currency: data.currency,
        payment_method: data.payment_method,
        payment_status: 'pending',
        order_status: 'processing',
        ip_address: data.ip_address || null,
        items: (data.items || []).map((it, idx) => ({
          id: idx + 1,
          order_id: fallbackId,
          theme_id: it.theme_id,
          license_type: it.license_type || 'regular',
          unit_price: it.unit_price,
        })),
        created_at: new Date(),
      };
      inMemoryOrders.set(data.order_number, orderRecord);
      return { orderId: fallbackId, orderNumber: data.order_number };
    } finally {
      if (connection) connection.release();
    }
  }

  /**
   * Tìm đơn hàng theo mã đơn
   */
  static async findByOrderNumber(orderNumber: string, strict = false): Promise<Order | null> {
    try {
      const [rows] = await dbPool.query<RowDataPacket[]>(
        'SELECT * FROM orders WHERE order_number = ? LIMIT 1',
        [orderNumber]
      );
      if (rows.length > 0) {
        const order = rows[0] as Order;
        // Lấy kèm items
        const [itemRows] = await dbPool.query<RowDataPacket[]>(
          `SELECT oi.*, t.name as theme_name 
           FROM order_items oi
           LEFT JOIN themes t ON oi.theme_id = t.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        order.items = itemRows as OrderItem[];
        return order;
      }
    } catch (error: any) {
      if (strict) throw error;
      console.warn('[OrderModel.findByOrderNumber] DB Error, tra cứu in-memory:', error.message);
    }
    return strict ? null : inMemoryOrders.get(orderNumber) || null;
  }

  /**
   * Cập nhật trạng thái thanh toán thành công
   */
  static async markAsPaid(orderId: number): Promise<boolean> {
    try {
      const [result] = await dbPool.query<ResultSetHeader>(
        'UPDATE orders SET payment_status = "paid", order_status = "completed" WHERE id = ?',
        [orderId]
      );
      if (result.affectedRows > 0) return true;
    } catch (error: any) {
      console.warn('[OrderModel.markAsPaid] DB Error, cập nhật in-memory:', error.message);
    }

    // Cập nhật fallback in-memory nếu có
    for (const order of inMemoryOrders.values()) {
      if (order.id === orderId) {
        order.payment_status = 'paid';
        order.order_status = 'completed';
        return true;
      }
    }
    return false;
  }
}
