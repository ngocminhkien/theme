import { createCheckoutOrder, type CheckoutOrder } from './api-client';
import type { CheckoutPayload } from './checkout-schema';

// One promise per mounted checkout, including the async hashing step.
export class CheckoutRequest {
  private pending: Promise<CheckoutOrder> | null = null;

  submit(payload: CheckoutPayload): Promise<CheckoutOrder> {
    if (this.pending) return this.pending;
    this.pending = this.send(payload).finally(() => { this.pending = null; });
    return this.pending;
  }

  private async send(payload: CheckoutPayload): Promise<CheckoutOrder> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
    const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    let key: string;
    try {
      const storageKey = 'themestore-checkout:' + fingerprint;
      const saved = sessionStorage.getItem(storageKey);
      if (saved && !/^[a-f0-9-]{36}$/i.test(saved)) throw new Error('Invalid stored attempt');
      key = saved || crypto.randomUUID();
      // Keep only a random request ID keyed by a digest, never customer/payment data.
      // Fail closed when storage is blocked: reload must not silently create a new order.
      sessionStorage.setItem(storageKey, key);
    } catch {
      throw new Error('Không thể lưu mã chống đặt hàng trùng. Vui lòng cho phép sessionStorage rồi thử lại.');
    }
    return createCheckoutOrder(payload, key);
  }
}
