'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SignOutButton } from '@/components/sign-out-button';

export function AuthNav() {
  const { status } = useSession();
  const isAuthed = status === 'authenticated';

  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link href="/" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors">Home</Link>
      <Link href="/meetings" className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors">Meetings</Link>

      {isAuthed && (
        <Link href="/meetings/new"
          className="text-sm bg-white text-blue-900 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors">
          + New Meeting
        </Link>
      )}

      {isAuthed ? (
        <SignOutButton />
      ) : (
        <Link href="/login"
          className="text-sm bg-white text-blue-900 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors">
          Sign In
        </Link>
      )}
    </nav>
  );
}