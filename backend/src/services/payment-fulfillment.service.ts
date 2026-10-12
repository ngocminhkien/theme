import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { ENV } from '../config/env.js';
import { dbPool } from '../config/database.js';
import { LicenseService } from './license.service.js';

type FulfillmentStatus =
  | 'fulfilled'
  | 'already_processed'
  | 'rejected';

export interface VietQrFulfillmentInput {
  orderNumber: string;
  transactionId: string;
  paidAmount: number;
  transactionDate?: string;
  accountNumber?: string;
}

export interface PaymentFulfillmentResult {
  status: FulfillmentStatus;
  code:
    | 'FULFILLED'
    | 'ALREADY_PROCESSED'
    | 'DUPLICATE_TRANSACTION'
    | 'ORDER_NOT_FOUND'
    | 'ORDER_NOT_ELIGIBLE'
    | 'PAYMENT_MISMATCH'
    | 'ORDER_ITEMS_MISSING'
    | 'PAYMENT_CONFIGURATION_INVALID';
  orderNumber: string;
  licenseCount?: number;
}

interface LockedOrder extends RowDataPacket {
  id: number;
  order_number: string;
  user_id: number | null;
  total_amount: number | string;
  currency: 'VND' | 'USD';
  payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
}

interface LockedOrderItem extends RowDataPacket {
  id: number;
  theme_id: number;
  license_type: 'regular' | 'agency' | 'lifetime';
}

interface ExistingPayment extends RowDataPacket {
  id: number;
  order_id: number;
}

/**
 * Completes a SePAY/VietQR payment using one InnoDB transaction.
 *
 * Payment state, its transaction-id audit row, and all order licenses are committed
 * together. This deliberately has no in-memory fallback: a payment webhook must be
 * retried by SePAY if MySQL is unavailable rather than being "fulfilled" only in one
 * application process.
 */
export class PaymentFulfillmentService {
  static async fulfillVietQr(input: VietQrFulfillmentInput): Promise<PaymentFulfillmentResult> {
    let connection: PoolConnection | undefined;
    let transactionOpen = false;

    try {
      connection = await dbPool.getConnection();
      await connection.beginTransaction();
      transactionOpen = true;

      // The row lock serializes webhooks for this order across all Node instances.
      const [orderRows] = await connection.query<LockedOrder[]>(
        `SELECT id, order_number, user_id, total_amount, currency, payment_method, payment_status, order_status
         FROM orders
         WHERE order_number = ?
         LIMIT 1
         FOR UPDATE`,
        [input.orderNumber]
      );

      if (!orderRows.length) {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'ORDER_NOT_FOUND', orderNumber: input.orderNumber };
      }

      const order = orderRows[0];
      const expectedAccount = ENV.PAYMENTS.VIETQR_BANK_ACCOUNT.trim();
      const accountConfigured = /^[0-9]{6,30}$/.test(expectedAccount)
        && expectedAccount !== '0987654321';

      if (!accountConfigured) {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'PAYMENT_CONFIGURATION_INVALID', orderNumber: order.order_number };
      }

      // The SePAY endpoint is exclusively for the configured VND/VietQR flow.
      if (order.payment_method !== 'vietqr' || order.currency !== 'VND') {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'ORDER_NOT_ELIGIBLE', orderNumber: order.order_number };
      }

      // SePAY sends accountNumber for normal bank events. When supplied, it must be
      // the configured receiving account; older/manual test payloads may omit it.
      if (input.accountNumber && input.accountNumber !== expectedAccount) {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'PAYMENT_MISMATCH', orderNumber: order.order_number };
      }

      const expectedAmount = Number(order.total_amount);
      if (!Number.isSafeInteger(expectedAmount)
        || !Number.isSafeInteger(input.paidAmount)
        || input.paidAmount !== expectedAmount) {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'PAYMENT_MISMATCH', orderNumber: order.order_number };
      }

      // The database unique key is the global final guard against replaying an event
      // to another order. Querying under the order lock gives deterministic replay
      // behavior for the common same-order retry.
      const [paymentRows] = await connection.query<ExistingPayment[]>(
        `SELECT id, order_id
         FROM payments
         WHERE gateway = 'vietqr' AND transaction_id = ?
         LIMIT 1
         FOR UPDATE`,
        [input.transactionId]
      );
      if (paymentRows.length) {
        await connection.rollback();
        transactionOpen = false;
        return {
          status: paymentRows[0].order_id === order.id ? 'already_processed' : 'rejected',
          code: paymentRows[0].order_id === order.id ? 'ALREADY_PROCESSED' : 'DUPLICATE_TRANSACTION',
          orderNumber: order.order_number,
        };
      }

      // Never try to repair historic/partial paid orders from a new webhook. They
      // require manual reconciliation, while new fulfillment remains all-or-nothing.
      if (order.payment_status === 'paid' && order.order_status === 'completed') {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'already_processed', code: 'ALREADY_PROCESSED', orderNumber: order.order_number };
      }
      if (order.payment_status !== 'pending' || order.order_status !== 'processing') {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'ORDER_NOT_ELIGIBLE', orderNumber: order.order_number };
      }

      const [itemRows] = await connection.query<LockedOrderItem[]>(
        `SELECT id, theme_id, license_type
         FROM order_items
         WHERE order_id = ?
         ORDER BY id ASC
         FOR UPDATE`,
        [order.id]
      );
      if (!itemRows.length || itemRows.some(item => item.license_type !== 'regular')) {
        await connection.rollback();
        transactionOpen = false;
        return {
          status: 'rejected',
          code: itemRows.length ? 'ORDER_NOT_ELIGIBLE' : 'ORDER_ITEMS_MISSING',
          orderNumber: order.order_number,
        };
      }

      // A pending order with historical licenses is an inconsistent legacy state.
      // Do not guess whether it was partially fulfilled: keep it out of automatic
      // retries and require controlled reconciliation instead.
      const [licenseRows] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM licenses WHERE order_id = ? LIMIT 1 FOR UPDATE`,
        [order.id]
      );
      if (licenseRows.length) {
        await connection.rollback();
        transactionOpen = false;
        return { status: 'rejected', code: 'ORDER_NOT_ELIGIBLE', orderNumber: order.order_number };
      }

      // Do not persist incoming content/account details. payment fields already hold
      // the provider transaction, amount and internal order relationship needed for audit.
      await connection.query<ResultSetHeader>(
        `INSERT INTO payments (order_id, transaction_id, gateway, amount, currency, status, raw_payload)
         VALUES (?, ?, 'vietqr', ?, 'VND', 'completed', ?)`,
        [
          order.id,
          input.transactionId,
          input.paidAmount,
          JSON.stringify({
            provider: 'sepay',
            provider_transaction_id: input.transactionId,
            order_number: order.order_number,
            transfer_amount: input.paidAmount,
            transaction_date: input.transactionDate || null,
          }),
        ]
      );

      for (const item of itemRows) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO licenses (license_key, order_id, theme_id, user_id, license_type, max_domains)
           VALUES (?, ?, ?, ?, 'regular', 1)`,
          [LicenseService.generateKey(), order.id, item.theme_id, order.user_id]
        );
      }

      const [statusUpdate] = await connection.query<ResultSetHeader>(
        `UPDATE orders
         SET payment_status = 'paid', order_status = 'completed'
         WHERE id = ? AND payment_status = 'pending' AND order_status = 'processing'`,
        [order.id]
      );
      if (statusUpdate.affectedRows !== 1) {
        throw new Error('ORDER_STATE_CHANGED_DURING_FULFILLMENT');
      }

      await connection.commit();
      transactionOpen = false;
      return {
        status: 'fulfilled',
        code: 'FULFILLED',
        orderNumber: order.order_number,
        licenseCount: itemRows.length,
      };
    } catch (error) {
      if (transactionOpen && connection) {
        try { await connection.rollback(); } catch (_) { /* Preserve the original failure. */ }
      }
      // The existing unique payment key can win a race between different orders.
      // Do not convert that database failure into a successful in-memory fulfillment.
      throw error;
    } finally {
      connection?.release();
    }
  }
}
