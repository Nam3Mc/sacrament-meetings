'use client';

import { authenticate } from '@/lib/users-db';
import { useActionState } from 'react';

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
   authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required
          className="mt-1 block w-full rounded border p-2" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" required minLength={6}
          className="mt-1 block w-full rounded border p-2" />
      </div>
      <button type="submit" disabled={isPending}
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50">
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
}