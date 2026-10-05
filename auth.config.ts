import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' }, // explicit is better with Credentials
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isProtected =
        nextUrl.pathname === '/meetings/new' ||
        /^\/meetings\/\d+\/edit/.test(nextUrl.pathname);

      if (isProtected) return isLoggedIn;

      if (isLoggedIn && nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // real providers are added in auth.ts (keeps edge runtime light)
} satisfies NextAuthConfig;