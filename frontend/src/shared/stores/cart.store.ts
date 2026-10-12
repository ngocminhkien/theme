import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES_DATA } from '../data/themes-data';
import type { CartItem, Currency, ThemeItem } from '../types';
import { cartStorage, type SavedCart } from './cart-storage';

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

function regularItem(theme: ThemeItem, currency: Currency): CartItem {
  return {
    theme,
    license_type: 'regular',
    currency,
    price: currency === 'VND' ? theme.price_vnd : theme.price_usd,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function restoreCart(value: unknown): Pick<CartState, 'items' | 'currency'> {
  const saved = isRecord(value) ? value : {};
  const currency = saved.currency === 'USD' ? 'USD' : 'VND';
  const items = new Map<number, CartItem>();

  if (Array.isArray(saved.items)) {
    for (const entry of saved.items) {
      if (!isRecord(entry) || entry.license_type !== 'regular') continue;
      // Accept old full items, but never trust stored prices or product fields.
      const themeId = entry.theme_id ?? (isRecord(entry.theme) ? entry.theme.id : undefined);
      const theme = THEMES_DATA.find((candidate) => candidate.id === themeId);
      if (!theme) continue;
      const item = regularItem(theme, currency);
      if (Number.isFinite(item.price) && item.price > 0) items.set(theme.id, item);
    }
  }

  return { currency, items: [...items.values()] };
}

function saveCart(state: Pick<CartState, 'items' | 'currency'>): SavedCart {
  return {
    currency: state.currency,
    items: state.items.map((item) => ({ theme_id: item.theme.id, license_type: item.license_type })),
  };
}

export const useCartStore = create<CartState>()(
  persist<CartState, [], [], SavedCart>(
    (set, get) => ({
      items: [],
      currency: 'VND',
      isCartOpen: false,

      setCurrency: (currency) => {
        hydrateCart();
        if (currency !== 'VND' && currency !== 'USD') return;
        set({ currency, items: get().items.map((item) => regularItem(item.theme, currency)) });
      },

      addItem: (theme, license_type = 'regular') => {
        hydrateCart();
        // Agency/Lifetime await agreed product prices; do not guess a multiplier.
        if (license_type !== 'regular') return;
        const product = THEMES_DATA.find((candidate) => candidate.id === theme.id);
        if (!product) return;
        const { items, currency } = get();
        const item = regularItem(product, currency);
        if (!Number.isFinite(item.price) || item.price <= 0) return;
        const exists = items.some((entry) => entry.theme.id === product.id);
        set({
          items: exists
            ? items.map((entry) => entry.theme.id === product.id ? item : entry)
            : [...items, item],
          isCartOpen: true,
        });
      },

      removeItem: (themeId) => {
        hydrateCart();
        set({ items: get().items.filter((item) => item.theme.id !== themeId) });
      },
      clearCart: () => {
        hydrateCart();
        set({ items: [] });
      },
      getTotal: () => get().items.reduce((sum, item) => sum + item.price, 0),
      openCart: () => {
        hydrateCart();
        set({ isCartOpen: true });
      },
      closeCart: () => {
        hydrateCart();
        set({ isCartOpen: false });
      },
      toggleCart: () => {
        hydrateCart();
        set({ isCartOpen: !get().isCartOpen });
      },
    }),
    {
      name: 'themestore-cart',
      version: 1,
      storage: cartStorage,
      partialize: saveCart,
      skipHydration: true,
      migrate: (saved) => saveCart(restoreCart(saved)),
      merge: (saved, current) => ({ ...current, ...restoreCart(saved), isCartOpen: false }),
    },
  ),
);

export function hydrateCart() {
  // Also handle interaction before CartRoot's effect: never overwrite a saved cart
  // with initial empty state. The configured localStorage adapter is synchronous.
  if (!useCartStore.persist.hasHydrated()) void useCartStore.persist.rehydrate();
}
