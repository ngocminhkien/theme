import { authenticatedApi } from '@/features/auth/auth-client';

export interface PortalOrderItem {
  theme_id: number;
  theme_name: string;
  license_type: 'regular' | 'agency' | 'lifetime';
  unit_price: number;
}

export interface PortalLicense {
  license_key: string;
  license_type: 'regular' | 'agency' | 'lifetime';
  status: 'active' | 'expired' | 'revoked';
  max_domains: number;
  active_domains_count?: number;
  theme_name?: string;
  theme_slug?: string;
  thumbnail_url?: string;
}

export interface PortalOrder {
  orderNumber: string;
  total_amount: number;
  currency: 'VND' | 'USD';
  payment_method: 'vietqr' | 'momo' | 'zalopay' | 'stripe' | 'paypal';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'completed' | 'cancelled';
  created_at: string;
  items: PortalOrderItem[];
}

export interface OrderReceipt extends PortalOrder {
  licenses: Pick<PortalLicense, 'license_key' | 'license_type' | 'max_domains' | 'theme_name'>[];
}

export function getMyOrders() {
  return authenticatedApi<PortalOrder[]>('/orders/my-orders');
}

export function getMyLicenses() {
  return authenticatedApi<PortalLicense[]>('/licenses/my-licenses');
}

export function getOrderReceipt(orderNumber: string) {
  return authenticatedApi<OrderReceipt>('/orders/' + encodeURIComponent(orderNumber) + '/receipt');
}

export async function requestThemeDownload(licenseKey: string): Promise<void> {
  await authenticatedApi<never>('/licenses/' + encodeURIComponent(licenseKey) + '/download');
}
