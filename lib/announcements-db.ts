import { sql } from './db-connection';
import type { AnnouncementItem } from './types';
import type { AnnouncementInput } from './schemas';

export interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

export const initialState: State = { message: null, errors: {} };

export async function getAnnouncements(): Promise<AnnouncementItem[] | null> {
  try {
    const rows = await sql`
      SELECT * FROM announcements
      ORDER BY sort_order
    `;
    return rows as AnnouncementItem[];
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return null;
  }
}

export async function getAnnouncementById(
  id: number
): Promise<AnnouncementItem | null> {
  try {
    const rows = await sql`
      SELECT * FROM announcements
      WHERE id = ${id}
    `;
    return (rows[0] as AnnouncementItem) ?? null;
  } catch (error) {
    console.error(`Failed to fetch announcement ${id}:`, error);
    return null;
  }
}

export async function getAnnouncementByMeetingId(
  meetingId: number
): Promise<AnnouncementItem[] | null> {
  try {
    const rows = await sql`
      SELECT * FROM announcements
      WHERE meeting_id = ${meetingId}
      ORDER BY sort_order
    `;
    return rows as AnnouncementItem[];
  } catch (error) {
    console.error(`Failed to fetch announcements for meeting ${meetingId}:`, error);
    return null;
  }
}

/** Replace all announcements for a meeting. Atomic: delete + reinsert in one transaction. */
export async function replaceAnnouncements(
  meetingId: number,
  items: AnnouncementInput[]
): Promise<State> {
  try {
    const statements = [
      sql`DELETE FROM announcements WHERE meeting_id = ${meetingId}`,
      ...items.map(
        (item, i) =>
          sql`INSERT INTO announcements (meeting_id, sort_order, body)
              VALUES (${meetingId}, ${i}, ${item.body})`
      ),
    ];
    await sql.transaction(statements);
    return { message: null, errors: {} };
  } catch (error) {
    console.error('Failed to replace announcements:', error);
    return {
      message: 'Could not save announcements. Please try again.',
      errors: {},
    };
  }
}

export async function deleteAnnouncementsByMeetingId(
  meetingId: number
): Promise<State> {
  try {
    await sql`DELETE FROM announcements WHERE meeting_id = ${meetingId}`;
    return { message: null, errors: {} };
  } catch (error) {
    console.error(`Failed to delete announcements for meeting ${meetingId}:`, error);
    return {
      message: 'Could not delete announcements. Please try again.',
      errors: {},
    };
  }
}