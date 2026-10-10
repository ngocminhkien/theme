'use client';

import React from 'react';
import { HeaderTopBar } from './HeaderTopBar';
import { HeaderMain } from './HeaderMain';
import { HeaderNavbar } from './HeaderNavbar';

export function Header() {
  return (
    <header className="w-full">
      <HeaderTopBar />
      <HeaderMain />
      <HeaderNavbar />
    </header>
  );
}
