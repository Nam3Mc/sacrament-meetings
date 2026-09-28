import { sql } from './db-connection';
import type { Hymn } from './types';

export interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

export const initialState: State = { message: null, errors: {} };

export async function getHymns(): Promise<Hymn[] | null> {
  try {
    const rows = await sql`
      SELECT hymn_number AS number, title
      FROM hymns
      ORDER BY hymn_number
    `;
    return rows as Hymn[];
  } catch (error) {
    console.error('Failed to fetch hymns:', error);
    return null;
  }
}

export async function getHymnById(number: number): Promise<Hymn | null> {
  try {
    const rows = await sql`
      SELECT hymn_number AS number, title
      FROM hymns
      WHERE hymn_number = ${number}
    `;
    return (rows[0] as Hymn) ?? null;
  } catch (error) {
    console.error(`Failed to fetch hymn ${number}:`, error);
    return null;
  }
}