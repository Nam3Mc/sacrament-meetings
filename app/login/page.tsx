import type { Metadata } from 'next';
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
        <LoginForm />
      </div>
    </div>
  );
}