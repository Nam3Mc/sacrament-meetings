import { sql } from "./db-connection";
import { SpeakerItem } from "./types";

export async function getSpeakers(): Promise<SpeakerItem[]> {
    const hymsRows = await sql` SELECT * FROM speakers`
    return hymsRows as SpeakerItem[]
}

export async function getSpeakerById(id: number): Promise<SpeakerItem> {
    const hymn = await sql`SELECT * FROM speakers WHERE id = ${id}`
    return hymn[0] as SpeakerItem
}

export async function getSpeakersByMeetingId(meetingId: number): Promise<SpeakerItem[]> {
    const hymsRows = await sql`SELECT * FROM speakers WHERE meeting_id = ${meetingId}`
    return hymsRows as SpeakerItem[]
}