import { getMeetings } from '@/lib/meeting-db';
import { redirect } from 'next/navigation';
import type { SacramentMeeting } from '@/lib/types';

async function pickCurrentMeetingId(): Promise<number | null> {
  // Pull page 1, large enough to find the next upcoming meeting.
  // If you expect >10 upcoming meetings at once, loop pages until you find one.
  const { meetings } = await getMeetings();

  if (meetings.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = meetings
    .map((m) => ({ ...m, dateObj: new Date(m.date + 'T00:00:00') }))
    .filter((m) => m.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length > 0) return upcoming[0].id;

  const past = meetings
    .map((m) => ({ ...m, dateObj: new Date(m.date + 'T00:00:00') }))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  return past[0].id;
}

export default async function CurrentMeetingPage() {
  const id = await pickCurrentMeetingId();
  if (id === null) redirect('/meetings');
  redirect(`/meetings/${id}`);
}