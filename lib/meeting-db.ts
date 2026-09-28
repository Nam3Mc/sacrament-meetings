'use server'

import { PAGE_SIZE, State, type GetMeetingsOptions, type PaginatedMeetings, type SacramentMeeting } from './types';
import { sql } from './db-connection';
import { getHymnById } from './hyms-db';
import { deleteSpeakersByMeetingId, getSpeakersByMeetingId, replaceSpeakers } from './speakers-db';
import { deleteAnnouncementsByMeetingId, getAnnouncementByMeetingId, replaceAnnouncements } from './announcements-db';
import { deleteWardBusinessByMeetingId, getWardBusinessByMeetingId, replaceWardBusiness } from './wardBusinesess-db';
import { AnnouncementSchema, MeetingFormSchema, MeetingInput, parseJsonArray, SpeakerSchema, WardBusinessSchema } from './schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// export interface State {
  // message: string | null;
  // errors: Record<string, string[]>;
// }
// 
// export const initialState: State = { message: null, errors: {} };
// 
// const PAGE_SIZE = 10;
// 
// export interface PaginatedMeetings {
  // meetings: SacramentMeeting[];
  // page: number;
  // pageSize: number;
  // total: number;
  // totalPages: number;
  // hasNext: boolean;
  // hasPrev: boolean;
// }
// 
// export interface GetMeetingsOptions {
  // date?: string | null;
  // query?: string | null;
  // page?: number;
// }

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

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
    announcements: (announcementItems ?? []).map((a) => a.body),
  };
}

export async function getMeetings(
  options: GetMeetingsOptions = {}
): Promise<PaginatedMeetings | null> {
  try {
    const { date = null, query = null, page = 1 } = options;
    const safePage = Math.max(1, Math.floor(page));
    const offset = (safePage - 1) * PAGE_SIZE;

    const trimmed = query?.trim() ?? '';
    const like = trimmed ? `%${trimmed}%` : null;

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
  } catch (error) {
    console.error('Failed to fetch meetings:', error);
    return null;
  }
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  try {
    const rows = await sql`SELECT * FROM meetings WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return hydrateMeeting(rows[0]);
  } catch (error) {
    console.error(`Failed to fetch meeting ${id}:`, error);
    return null;
  }
}

export async function getCurrentMeeting(): Promise<SacramentMeeting | null> {
  try {
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
  } catch (error) {
    console.error('Failed to fetch current meeting:', error);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* FormData → validated input                                          */
/* ------------------------------------------------------------------ */

type ParseResult =
  | { ok: true; data: MeetingInput }
  | { ok: false; state: State };

function parseMeetingForm(formData: FormData): ParseResult {
  let speakers, announcements, wardBusiness;

  try {
    speakers = parseJsonArray(formData.get('speakers'), SpeakerSchema);
    announcements = parseJsonArray(formData.get('announcements'), AnnouncementSchema);
    wardBusiness = parseJsonArray(formData.get('ward_business'), WardBusinessSchema);
  } catch (error) {
    console.error('Failed to parse list fields:', error);
    return {
      ok: false,
      state: {
        message: 'One of the list fields contains invalid data.',
        errors: {},
      },
    };
  }

  const raw = {
    meeting_date: formData.get('meeting_date'),
    meeting_type: formData.get('meeting_type'),
    presiding: formData.get('presiding'),
    conducting: formData.get('conducting'),
    opening_hymn: formData.get('opening_hymn'),
    opening_prayer: formData.get('opening_prayer'),
    stake_business: formData.get('stake_business') === 'on',
    sacrament_hymn: formData.get('sacrament_hymn'),
    closing_hymn: formData.get('closing_hymn'),
    closing_prayer: formData.get('closing_prayer'),
    speakers,
    announcements,
    ward_business: wardBusiness,
  };

  const parsed = MeetingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      state: {
        message: 'Please fix the errors below.',
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  return { ok: true, data: parsed.data };
}

/* ------------------------------------------------------------------ */
/* CREATE                                                              */
/* ------------------------------------------------------------------ */

export async function createMeeting(
  prevState: State,
  formData: FormData
): Promise<State> {
  const parsed = parseMeetingForm(formData);
  if (!parsed.ok) return parsed.state;

  const data = parsed.data;
  let meetingId: number;

  try {
    const rows = await sql`
      INSERT INTO meetings (
        meeting_date, meeting_type, presiding, conducting,
        opening_hymn, opening_prayer, stake_business,
        sacrament_hymn, closing_hymn, closing_prayer
      ) VALUES (
        ${data.meeting_date}::date, ${data.meeting_type}, ${data.presiding}, ${data.conducting},
        ${data.opening_hymn}, ${data.opening_prayer}, ${data.stake_business},
        ${data.sacrament_hymn}, ${data.closing_hymn}, ${data.closing_prayer}
      )
      RETURNING id
    `;
    meetingId = rows[0].id as number;
  } catch (error) {
    console.error('Failed to insert meeting:', error);
    return {
      message: 'Could not create the meeting. Please try again.',
      errors: {},
    };
  }

  // Child tables — each returns State.
  const speakersState = await replaceSpeakers(meetingId, data.speakers);
  if (speakersState.message) return speakersState;

  const announcementsState = await replaceAnnouncements(meetingId, data.announcements);
  if (announcementsState.message) return announcementsState;

  const wardBusinessState = await replaceWardBusiness(meetingId, data.ward_business);
  if (wardBusinessState.message) return wardBusinessState;

  revalidatePath('/meetings');
  redirect('/meetings');
}

/* ------------------------------------------------------------------ */
/* UPDATE                                                              */
/* ------------------------------------------------------------------ */

export async function updateMeeting(
  id: number,
  prevState: State,
  formData: FormData
): Promise<State> {
  const parsed = parseMeetingForm(formData);
  if (!parsed.ok) return parsed.state;

  const data = parsed.data;

  try {
    await sql`
      UPDATE meetings SET
        meeting_date   = ${data.meeting_date}::date,
        meeting_type   = ${data.meeting_type},
        presiding      = ${data.presiding},
        conducting     = ${data.conducting},
        opening_hymn   = ${data.opening_hymn},
        opening_prayer = ${data.opening_prayer},
        stake_business = ${data.stake_business},
        sacrament_hymn = ${data.sacrament_hymn},
        closing_hymn   = ${data.closing_hymn},
        closing_prayer = ${data.closing_prayer}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(`Failed to update meeting ${id}:`, error);
    return {
      message: 'Could not update the meeting. Please try again.',
      errors: {},
    };
  }

  const speakersState = await replaceSpeakers(id, data.speakers);
  if (speakersState.message) return speakersState;

  const announcementsState = await replaceAnnouncements(id, data.announcements);
  if (announcementsState.message) return announcementsState;

  const wardBusinessState = await replaceWardBusiness(id, data.ward_business);
  if (wardBusinessState.message) return wardBusinessState;

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}/edit`);
  redirect('/meetings');
}

/* ------------------------------------------------------------------ */
/* DELETE                                                              */
/* ------------------------------------------------------------------ */

export async function deleteMeeting(id: number): Promise<State> {
  try {
    const speakersState = await deleteSpeakersByMeetingId(id);
    if (speakersState.message) return speakersState;

    const announcementsState = await deleteAnnouncementsByMeetingId(id);
    if (announcementsState.message) return announcementsState;

    const wardBusinessState = await deleteWardBusinessByMeetingId(id);
    if (wardBusinessState.message) return wardBusinessState;

    await sql`DELETE FROM meetings WHERE id = ${id}`;
  } catch (error) {
    console.error(`Failed to delete meeting ${id}:`, error);
    return {
      message: 'Could not delete the meeting. Please try again.',
      errors: {},
    };
  }

  revalidatePath('/meetings');
  return { message: null, errors: {} };
}