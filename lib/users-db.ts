'use server'

import { signIn } from '@/auth';
import { sql } from './db-connection';
import { AuthError } from 'next-auth';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const rows = await sql`
      SELECT id, name, email, password_hash FROM users
      WHERE email = ${email} LIMIT 1
    `;
    if (!rows[0]) return null;
    return {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      passwordHash: rows[0].password_hash,
    };
  } catch (error) {
    console.error('getUserByEmail failed:', error);
    return null;
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') return 'Invalid email or password.';
      return 'Something went wrong.';
    }
    throw error;
  }
}