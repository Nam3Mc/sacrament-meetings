import { getMeetings } from '@/lib/meeting-db';
import { redirect } from 'next/navigation';

function getMostRecentSunday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  const yyyy = sunday.getFullYear();
  const mm = String(sunday.getMonth() + 1).padStart(2, '0');
  const dd = String(sunday.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function CurrentMeetingPage() {
  const sundayDate = getMostRecentSunday();
  const meetings = getMeetings(sundayDate);

  if (meetings.length === 0) redirect('/meetings');

  redirect(`/meetings/${meetings[0].id}`);
}