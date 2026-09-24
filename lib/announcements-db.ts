import { sql } from './db-connection';
import type { AnnouncementItem } from './types';

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const rows = await sql`
    SELECT * FROM announcements
    ORDER BY sort_order
  `;
  return rows as AnnouncementItem[];
}

export async function getAnnouncementById(
  id: number
): Promise<AnnouncementItem | null> {
  const rows = await sql`
    SELECT * FROM announcements
    WHERE id = ${id}
  `;
  return (rows[0] as AnnouncementItem) ?? null;
}

export async function getAnnouncementByMeetingId(
  meetingId: number
): Promise<AnnouncementItem[]> {
  const rows = await sql`
    SELECT * FROM announcements
    WHERE meeting_id = ${meetingId}
    ORDER BY sort_order
  `;
  return rows as AnnouncementItem[];
}