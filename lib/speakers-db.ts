import { sql } from './db-connection';
import type { SpeakerItem } from './types';
import type { SpeakerInput } from './schemas';

export interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

export const initialState: State = { message: null, errors: {} };

export async function getSpeakers(): Promise<SpeakerItem[] | null> {
  try {
    const rows = await sql`SELECT * FROM speakers`;
    return rows as SpeakerItem[];
  } catch (error) {
    console.error('Failed to fetch speakers:', error);
    return null;
  }
}

export async function getSpeakerById(id: number): Promise<SpeakerItem | null> {
  try {
    const rows = await sql`SELECT * FROM speakers WHERE id = ${id}`;
    return (rows[0] as SpeakerItem) ?? null;
  } catch (error) {
    console.error(`Failed to fetch speaker ${id}:`, error);
    return null;
  }
}

export async function getSpeakersByMeetingId(
  meetingId: number
): Promise<SpeakerItem[] | null> {
  try {
    const rows = await sql`SELECT * FROM speakers WHERE meeting_id = ${meetingId}`;
    return rows as SpeakerItem[];
  } catch (error) {
    console.error(`Failed to fetch speakers for meeting ${meetingId}:`, error);
    return null;
  }
}

/** Replace all speakers for a meeting. Atomic: delete + reinsert in one transaction. */
export async function replaceSpeakers(
  meetingId: number,
  speakers: SpeakerInput[]
): Promise<State> {
  try {
    const statements = [
      sql`DELETE FROM speakers WHERE meeting_id = ${meetingId}`,
      ...speakers.map(
        (s, i) =>
          sql`INSERT INTO speakers (meeting_id, sort_order, name, topic, type)
              VALUES (${meetingId}, ${i}, ${s.name}, ${s.topic}, ${s.type})`
      ),
    ];
    await sql.transaction(statements);
    return { message: null, errors: {} };
  } catch (error) {
    console.error('Failed to replace speakers:', error);
    return {
      message: 'Could not save speakers. Please try again.',
      errors: {},
    };
  }
}

export async function deleteSpeakersByMeetingId(
  meetingId: number
): Promise<State> {
  try {
    await sql`DELETE FROM speakers WHERE meeting_id = ${meetingId}`;
    return { message: null, errors: {} };
  } catch (error) {
    console.error(`Failed to delete speakers for meeting ${meetingId}:`, error);
    return {
      message: 'Could not delete speakers. Please try again.',
      errors: {},
    };
  }
}