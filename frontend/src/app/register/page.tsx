'use client';

import React, { Suspense } from 'react';
import { AuthContainer } from '@/features/auth/AuthContainer';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <AuthContainer initialMode="register" />
    </Suspense>
  );
}
