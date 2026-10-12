import type { CheckoutPayload } from './checkout-schema';

export interface OrderStatus {
  orderNumber: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  currency: 'VND' | 'USD';
}
export interface CheckoutOrder extends OrderStatus {
  orderId: number;
  payment_method: 'vietqr';
  vietQrUrl: string | null;
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/v1/orders/' + path, { ...init, signal: controller.signal, cache: 'no-store' });
    const json = await response.json().catch(() => null);
    if (!response.ok || json?.success !== true) {
      throw new Error(typeof json?.message === 'string' ? json.message : 'Máy chủ chưa xử lý được yêu cầu. Vui lòng thử lại.');
    }
    return json.data;
  } catch (error) {
    if (controller.signal.aborted || error instanceof TypeError) {
      throw new Error('Mất kết nối hoặc hết thời gian chờ. Thử lại với cùng thông tin để khôi phục đơn, không đặt hoặc chuyển tiền lần nữa.');
    }
    throw error;
  } finally { clearTimeout(timeout); }
}

function isStatus(value: unknown): value is OrderStatus {
  if (!value || typeof value !== 'object') return false;
  const status = value as OrderStatus;
  return typeof status.orderNumber === 'string' && /^OD-\d{8}-[A-F0-9]{6}$/.test(status.orderNumber)
    && ['pending', 'paid', 'failed', 'refunded'].includes(status.payment_status)
    && ['processing', 'completed', 'cancelled'].includes(status.order_status)
    && ['VND', 'USD'].includes(status.currency) && Number.isFinite(status.total_amount) && status.total_amount > 0;
}

export function isConfirmedPaid(status: OrderStatus, order: OrderStatus): boolean {
  return status.orderNumber === order.orderNumber && status.currency === order.currency
    && status.total_amount === order.total_amount && status.payment_status === 'paid' && status.order_status === 'completed';
}

export async function createCheckoutOrder(payload: CheckoutPayload, key: string): Promise<CheckoutOrder> {
  const data = await request('checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, idempotency_key: key }) });
  if (!isStatus(data)) throw new Error('Phản hồi đơn hàng không hợp lệ. Vui lòng thử lại cùng thông tin.');
  const order = data as CheckoutOrder;
  if (!Number.isSafeInteger(order.orderId) || order.orderId <= 0 || order.currency !== payload.currency
    || order.total_amount !== payload.total_amount || order.payment_method !== payload.payment_method) {
    throw new Error('Thông tin đơn hàng không khớp yêu cầu. Chưa mở thanh toán; vui lòng liên hệ hỗ trợ.');
  }
  if (order.payment_status === 'pending' && order.order_status === 'processing') {
    let qr: URL;
    try { qr = new URL(order.vietQrUrl || ''); } catch { throw new Error('Máy chủ chưa cung cấp mã VietQR hợp lệ. Không có thanh toán demo.'); }
    if (qr.origin !== 'https://img.vietqr.io' || !qr.pathname.startsWith('/image/')
      || qr.searchParams.get('addInfo') !== order.orderNumber || Number(qr.searchParams.get('amount')) !== order.total_amount) {
      throw new Error('Mã VietQR không khớp đơn hàng. Vui lòng liên hệ hỗ trợ.');
    }
  }
  return order;
}

export async function getOrderStatus(order: OrderStatus): Promise<OrderStatus> {
  const data = await request(encodeURIComponent(order.orderNumber) + '/status');
  if (!isStatus(data) || data.orderNumber !== order.orderNumber || data.currency !== order.currency
    || data.total_amount !== order.total_amount) throw new Error('Chưa xác minh được trạng thái đúng đơn hàng. Vui lòng thử lại.');
  return data;
}
