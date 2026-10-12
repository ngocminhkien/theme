'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hydrateCart, useCartStore } from '@/shared/stores/cart.store';
import { MiniCartSlideover } from './MiniCartSlideover';

export function CartRoot() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Server and first client render both use the empty cart. Restore after mount.
    hydrateCart();
  }, []);

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      useCartStore.getState().closeCart();
      previousPathname.current = pathname;
    }
  }, [pathname]);

  return <MiniCartSlideover />;
}
