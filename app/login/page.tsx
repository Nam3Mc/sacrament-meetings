// app/login/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In | Sacrament Meeting Planner',
  description: 'Sign in to manage sacrament meetings.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8 bg-white border border-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center text-sm text-gray-400">
              Loading…
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}