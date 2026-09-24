import { sql } from './db-connection';
import type { Hymn } from './types';

export async function getHymns(): Promise<Hymn[]> {
  const rows = await sql`
    SELECT hymn_number AS number, title
    FROM hymns
    ORDER BY hymn_number
  `;
  return rows as Hymn[];
}

export async function getHymnById(number: number): Promise<Hymn | null> {
  const rows = await sql`
    SELECT hymn_number AS number, title
    FROM hymns
    WHERE hymn_number = ${number}
  `;
  return (rows[0] as Hymn) ?? null;
}