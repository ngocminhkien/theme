import { createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { CartItem, Currency } from '../types';

export interface SavedCart {
  currency: Currency;
  items: { theme_id: number; license_type: CartItem['license_type'] }[];
}

// Storage may be unavailable (privacy settings or quota). The cart still works in memory.
const safeLocalStorage: StateStorage = {
  getItem(name) {
    try {
      const value = localStorage.getItem(name);
      if (value !== null) JSON.parse(value);
      return value;
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Persistence is optional; never interrupt adding/removing a theme.
    }
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch {
      // Storage can also be blocked when clearing it.
    }
  },
};

export const cartStorage = createJSONStorage<SavedCart>(() => safeLocalStorage);
