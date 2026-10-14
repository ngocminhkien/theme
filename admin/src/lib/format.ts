export const money = (value: number, currency: 'VND' | 'USD') => new Intl.NumberFormat(
  currency === 'VND' ? 'vi-VN' : 'en-US',
  { style: 'currency', currency, maximumFractionDigits: currency === 'VND' ? 0 : 2 },
).format(Number(value || 0));

export const revenue = (value: { vnd: number; usd: number }) => `${money(value.vnd, 'VND')} · ${money(value.usd, 'USD')}`;

export const dateTime = (value?: string | number | Date | null) => {
  if (!value) return '—';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return '—';
  }
};

export const shortDate = (value?: string | number | Date | null) => {
  if (!value) return '—';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  } catch {
    return '—';
  }
};
