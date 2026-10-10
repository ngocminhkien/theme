import { create } from 'zustand';
import { CartItem, Currency, ThemeItem } from '../types';

interface CartState {
  items: CartItem[];
  currency: Currency;
  isCartOpen: boolean;
  setCurrency: (c: Currency) => void;
  addItem: (theme: ThemeItem, license_type?: 'regular' | 'agency' | 'lifetime') => void;
  removeItem: (themeId: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  currency: 'VND',
  isCartOpen: false,

  setCurrency: (currency) => {
    // Khi đổi tiền tệ, tính lại giá cho các items trong giỏ
    const currentItems = get().items;
    const updatedItems = currentItems.map((item) => {
      let basePrice = currency === 'VND' ? item.theme.price_vnd : item.theme.price_usd;
      if (item.license_type === 'agency') basePrice = Math.round(basePrice * 1.8);
      if (item.license_type === 'lifetime') basePrice = Math.round(basePrice * 2.5);
      return {
        ...item,
        currency,
        price: basePrice,
      };
    });
    set({ currency, items: updatedItems });
  },

  addItem: (theme, license_type = 'regular') => {
    const { items, currency } = get();
    const existingIndex = items.findIndex((i) => i.theme.id === theme.id);
    let basePrice = currency === 'VND' ? theme.price_vnd : theme.price_usd;
    if (license_type === 'agency') basePrice = Math.round(basePrice * 1.8);
    if (license_type === 'lifetime') basePrice = Math.round(basePrice * 2.5);

    if (existingIndex > -1) {
      // Nếu đã có, mở giỏ hàng để user thấy
      set({ isCartOpen: true });
      return;
    }

    set({
      items: [...items, { theme, license_type, price: basePrice, currency }],
      isCartOpen: true, // Tự động mở mini cart khi thêm sản phẩm
    });
  },

  removeItem: (themeId) => {
    set({ items: get().items.filter((i) => i.theme.id !== themeId) });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
}));
