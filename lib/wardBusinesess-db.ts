import { sql } from "./db-connection";
import { WardBusinessItem } from "./types";

export async function getWardBusiness(): Promise<WardBusinessItem[]> {
    const wardBusinessRows = await sql` SELECT * FROM ward_business`
    return wardBusinessRows as WardBusinessItem[]
}

export async function getWardBusinessById(id: number): Promise<WardBusinessItem> {
    const wardBusinessRows = await sql`SELECT * FROM ward_business WHERE id = ${id}`
    return wardBusinessRows[0] as WardBusinessItem
}

export async function getWardBusinessByMeetingId(meetingId: number): Promise<WardBusinessItem[]> {
    const wardBusinessRows = await sql`SELECT * FROM ward_business WHERE meeting_id = ${meetingId}`
    return wardBusinessRows as WardBusinessItem[]
}