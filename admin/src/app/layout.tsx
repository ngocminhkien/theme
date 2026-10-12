import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ThemeStore Admin',
  description: 'Bảng điều hành ThemeStore',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
