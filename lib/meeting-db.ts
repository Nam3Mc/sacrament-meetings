import type { SacramentMeeting } from './types';
import { sql } from './db-connection';
import { getHymnById } from './hyms-db';
import { getSpeakersByMeetingId } from './speakers-db';
import { getAnnouncementByMeetingId } from './announcements-db';
import { getWardBusinessByMeetingId } from './wardBusinesess-db';

export const PAGE_SIZE = 10;

export interface PaginatedMeetings {
  meetings: SacramentMeeting[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Normalize a raw `meetings` row (snake_case, possibly Date for meeting_date)
 * plus its related records into a SacramentMeeting.
 */
async function hydrateMeeting(row: any): Promise<SacramentMeeting> {
  const meetingId = row.id;

  const [
    speakers,
    announcementItems,
    wardBusiness,
    openingHymn,
    sacramentHymn,
    closingHymn,
  ] = await Promise.all([
    getSpeakersByMeetingId(meetingId),
    getAnnouncementByMeetingId(meetingId),
    getWardBusinessByMeetingId(meetingId),
    row.opening_hymn ? getHymnById(row.opening_hymn) : null,
    row.sacrament_hymn ? getHymnById(row.sacrament_hymn) : null,
    row.closing_hymn ? getHymnById(row.closing_hymn) : null,
  ]);

  // meeting_date may come back as Date or string depending on the driver.
  const date =
    row.meeting_date instanceof Date
      ? row.meeting_date.toISOString().slice(0, 10)
      : String(row.meeting_date);

  return {
    id: row.id,
    date,
    meetingType: row.meeting_type as SacramentMeeting['meetingType'],
    presiding: row.presiding,
    conducting: row.conducting,
    openingHymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: wardBusiness ?? [],
    stakeBusiness: row.stake_business ?? false,
    sacramentHymn,
    speakers: speakers ?? [],
    closingHymn,
    closingPrayer: row.closing_prayer,
    // SacramentMeeting.announcements is string[], so map row.body
    announcements: (announcementItems ?? []).map((a) => a.body),
  };
}

/**
 * Get a page of meetings, optionally filtered by exact date (YYYY-MM-DD).
 * Page is 1-based. Page size is capped at PAGE_SIZE (10).
 */
export async function getMeetings(
  date?: string | null,
  page: number = 1
): Promise<PaginatedMeetings> {
  const safePage = Math.max(1, Math.floor(page));
  const offset = (safePage - 1) * PAGE_SIZE;

  const rows = date
    ? await sql`
        SELECT * FROM meetings
        WHERE meeting_date = ${date}
        ORDER BY meeting_date DESC
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `
    : await sql`
        SELECT * FROM meetings
        ORDER BY meeting_date DESC
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `;

  const countRows = date
    ? await sql`SELECT COUNT(*)::int AS count FROM meetings WHERE meeting_date = ${date}`
    : await sql`SELECT COUNT(*)::int AS count FROM meetings`;

  const total = countRows[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const meetings = await Promise.all(rows.map(hydrateMeeting));

  return {
    meetings,
    page: safePage,
    pageSize: PAGE_SIZE,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

/**
 * Get a single meeting by id, or null if not found.
 */
export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  const rows = await sql`SELECT * FROM meetings WHERE id = ${id}`;
  if (rows.length === 0) return null;
  return hydrateMeeting(rows[0]);
}