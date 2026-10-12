'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { getAdminProfile } from '@/lib/auth';
import type { AdminUser } from '@/lib/types';

export default function SecureLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  useEffect(() => { getAdminProfile().then(setUser).catch(() => router.replace('/login')); }, [router]);
  if (!user) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="skeleton h-10 w-10 rounded-full" /></div>;
  return <AdminShell user={user}>{children}</AdminShell>;
}
