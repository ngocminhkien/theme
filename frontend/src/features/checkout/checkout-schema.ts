import type { CartItem, Currency } from '../../shared/types';

export interface CustomerFields { fullName: string; email: string; phone: string }
export type CheckoutErrors = Partial<Record<keyof CustomerFields | 'cart' | 'payment', string>>;
export interface CheckoutPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  currency: Currency;
  payment_method: 'vietqr';
  total_amount: number;
  items: { theme_id: number; theme_slug: string; license_type: 'regular' }[];
}

export function validateCheckout(fields: CustomerFields, items: CartItem[], currency: Currency): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const name = fields.fullName.trim();
  const email = fields.email.trim();
  if (name.length < 2 || name.length > 100) errors.fullName = 'Vui lòng nhập họ tên từ 2 đến 100 ký tự.';
  if (email.length > 191 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Vui lòng nhập địa chỉ email hợp lệ.';
  if (fields.phone.trim() && !/^[0-9+() -]{8,20}$/.test(fields.phone.trim())) errors.phone = 'Số điện thoại cần từ 8–20 ký tự, chỉ gồm số, +, dấu ngoặc, dấu cách hoặc -.';
  if (!items.length) errors.cart = 'Giỏ hàng đang trống. Vui lòng chọn theme trước khi đặt hàng.';
  else if (new Set(items.map(item => item.theme.id)).size !== items.length
    || items.some(item => item.license_type !== 'regular' || !item.theme.slug
      || !Number.isSafeInteger(item.theme.id) || item.theme.id <= 0
      || item.currency !== currency || !Number.isFinite(item.price) || item.price <= 0 || item.installation_addon)) {
    errors.cart = 'Giỏ hàng có sản phẩm hoặc tùy chọn chưa được hỗ trợ. Hiện chỉ mở bán Regular License.';
  }
  if (currency !== 'VND') errors.payment = 'Thanh toán USD qua Stripe/PayPal chưa sẵn sàng. Giữ nguyên USD, không tự quy đổi sang VND.';
  return errors;
}

export function buildCheckoutPayload(fields: CustomerFields, items: CartItem[], currency: Currency): CheckoutPayload {
  const errors = validateCheckout(fields, items, currency);
  if (Object.keys(errors).length) throw new Error(Object.values(errors).join(' '));
  return {
    customer_name: fields.fullName.trim(), customer_email: fields.email.trim(),
    customer_phone: fields.phone.trim() || null, currency, payment_method: 'vietqr',
    // Sent only for price agreement. The backend independently prices every item.
    total_amount: items.reduce((total, item) => total + item.price, 0),
    items: items.map(item => ({ theme_id: item.theme.id, theme_slug: item.theme.slug, license_type: 'regular' as const }))
      .sort((a, b) => a.theme_id - b.theme_id),
  };
}
