'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: '/' })}
      className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
    >
      Sign Out
    </button>
  );
}