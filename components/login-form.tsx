'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // handle navigation ourselves
    });

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    // Success — refresh server components so the new session is picked up
    startTransition(() => {
      router.replace(params.get('from') ?? '/meetings');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded border p-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 block w-full rounded border p-2"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}