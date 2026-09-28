import { sql } from './db-connection';
import type { WardBusinessItem } from './types';
import type { WardBusinessInput } from './schemas';

export interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

export const initialState: State = { message: null, errors: {} };

export async function getWardBusiness(): Promise<WardBusinessItem[] | null> {
  try {
    const rows = await sql`SELECT * FROM ward_business`;
    return rows as WardBusinessItem[];
  } catch (error) {
    console.error('Failed to fetch ward business:', error);
    return null;
  }
}

export async function getWardBusinessById(
  id: number
): Promise<WardBusinessItem | null> {
  try {
    const rows = await sql`SELECT * FROM ward_business WHERE id = ${id}`;
    return (rows[0] as WardBusinessItem) ?? null;
  } catch (error) {
    console.error(`Failed to fetch ward business ${id}:`, error);
    return null;
  }
}

export async function getWardBusinessByMeetingId(
  meetingId: number
): Promise<WardBusinessItem[] | null> {
  try {
    const rows = await sql`SELECT * FROM ward_business WHERE meeting_id = ${meetingId}`;
    return rows as WardBusinessItem[];
  } catch (error) {
    console.error(`Failed to fetch ward business for meeting ${meetingId}:`, error);
    return null;
  }
}

/** Replace all ward business for a meeting. Atomic: delete + reinsert in one transaction. */
export async function replaceWardBusiness(
  meetingId: number,
  items: WardBusinessInput[]
): Promise<State> {
  try {
    const statements = [
      sql`DELETE FROM ward_business WHERE meeting_id = ${meetingId}`,
      ...items.map(
        (item, i) =>
          sql`INSERT INTO ward_business (meeting_id, sort_order, description)
              VALUES (${meetingId}, ${i}, ${item.description})`
      ),
    ];
    await sql.transaction(statements);
    return { message: null, errors: {} };
  } catch (error) {
    console.error('Failed to replace ward business:', error);
    return {
      message: 'Could not save ward business. Please try again.',
      errors: {},
    };
  }
}

export async function deleteWardBusinessByMeetingId(
  meetingId: number
): Promise<State> {
  try {
    await sql`DELETE FROM ward_business WHERE meeting_id = ${meetingId}`;
    return { message: null, errors: {} };
  } catch (error) {
    console.error(`Failed to delete ward business for meeting ${meetingId}:`, error);
    return {
      message: 'Could not delete ward business. Please try again.',
      errors: {},
    };
  }
}