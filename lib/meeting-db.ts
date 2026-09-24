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

export interface GetMeetingsOptions {
  /** Exact meeting date, YYYY-MM-DD. */
  date?: string | null;
  /** Free-text search across presiding, conducting, speaker names, and meeting type. */
  query?: string | null;
  /** 1-based page number. */
  page?: number;
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
 * Get a page of meetings.
 *
 * Filters (all optional, all combinable):
 *   - date:  exact meeting_date match (YYYY-MM-DD)
 *   - query: free text against presiding, conducting, speaker name, meeting type
 *   - page:  1-based page number (default 1)
 *
 * Page size is capped at PAGE_SIZE (10).
 */
export async function getMeetings(
  options: GetMeetingsOptions = {}
): Promise<PaginatedMeetings> {
  const { date = null, query = null, page = 1 } = options;
  const safePage = Math.max(1, Math.floor(page));
  const offset = (safePage - 1) * PAGE_SIZE;

  const trimmed = query?.trim() ?? '';
  const like = trimmed ? `%${trimmed}%` : null;

  // Note: the LEFT JOIN + DISTINCT combination is required because a meeting
  // with multiple speakers would otherwise produce duplicate rows when a
  // speaker name matches the query. COUNT(DISTINCT m.id) is the same story.
  const rows = await sql`
    SELECT DISTINCT m.*
    FROM meetings m
    LEFT JOIN speakers s ON s.meeting_id = m.id
    WHERE (${date}::text IS NULL OR m.meeting_date = ${date}::date)
      AND (
        ${like}::text IS NULL
        OR m.presiding    ILIKE ${like}
        OR m.conducting   ILIKE ${like}
        OR s.name         ILIKE ${like}
        OR m.meeting_type ILIKE ${like}
        OR REPLACE(m.meeting_type, '_', ' ') ILIKE ${like}
      )
    ORDER BY m.meeting_date DESC
    LIMIT ${PAGE_SIZE} OFFSET ${offset}
  `;

  const countRows = await sql`
    SELECT COUNT(DISTINCT m.id)::int AS count
    FROM meetings m
    LEFT JOIN speakers s ON s.meeting_id = m.id
    WHERE (${date}::text IS NULL OR m.meeting_date = ${date}::date)
      AND (
        ${like}::text IS NULL
        OR m.presiding    ILIKE ${like}
        OR m.conducting   ILIKE ${like}
        OR s.name         ILIKE ${like}
        OR m.meeting_type ILIKE ${like}
        OR REPLACE(m.meeting_type, '_', ' ') ILIKE ${like}
      )
  `;

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

/**
 * Return the "current" meeting: the nearest upcoming meeting (today included),
 * or — if no meetings are upcoming — the most recent past meeting.
 * Returns null only when the meetings table is empty.
 */
export async function getCurrentMeeting(): Promise<SacramentMeeting | null> {
  // One query, one row. Future meetings win; ties broken by earliest date.
  // If no future meetings exist, falls back to the most recent past meeting.
  const rows = await sql`
    SELECT *
    FROM meetings
    ORDER BY
      CASE WHEN meeting_date >= CURRENT_DATE THEN 0 ELSE 1 END,
      CASE WHEN meeting_date >= CURRENT_DATE
           THEN meeting_date
           ELSE NULL
      END ASC,
      meeting_date DESC
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return hydrateMeeting(rows[0]);
}