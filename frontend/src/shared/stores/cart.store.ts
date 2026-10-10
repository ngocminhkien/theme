import { create } from 'zustand';
import { CartItem, Currency, ThemeItem } from '../types/index';

interface CartState {
  items: CartItem[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  addItem: (theme: ThemeItem, license_type?: 'regular' | 'agency' | 'lifetime') => void;
  removeItem: (themeId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  currency: 'VND',
  setCurrency: (currency) => set({ currency }),

  addItem: (theme, license_type = 'regular') => {
    const { items, currency } = get();
    const existingIndex = items.findIndex((i) => i.theme.id === theme.id);
    const price = currency === 'VND' ? theme.price_vnd : theme.price_usd;

    if (existingIndex > -1) {
      return; // Theme đã có trong giỏ
    }

    set({ items: [...items, { theme, license_type, price, currency }] });
  },

  removeItem: (themeId) => {
    set({ items: get().items.filter((i) => i.theme.id !== themeId) });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
