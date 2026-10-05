import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith('/meetings/new') ||
        /^\/meetings\/\d+\/edit/.test(nextUrl.pathname);

      if (isProtected) return isLoggedIn;
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;