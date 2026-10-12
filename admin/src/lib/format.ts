export const money = (value: number, currency: 'VND' | 'USD') => new Intl.NumberFormat(
  currency === 'VND' ? 'vi-VN' : 'en-US',
  { style: 'currency', currency, maximumFractionDigits: currency === 'VND' ? 0 : 2 },
).format(Number(value || 0));

export const revenue = (value: { vnd: number; usd: number }) => `${money(value.vnd, 'VND')} · ${money(value.usd, 'USD')}`;

export const dateTime = (value: string) => new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value));

export const shortDate = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(value));
