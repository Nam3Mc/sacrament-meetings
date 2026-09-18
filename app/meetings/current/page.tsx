// import { getMeetings } from '@/lib/meeting-db';
// import { redirect } from 'next/navigation';

// function getMostRecentSunday(): string {
//   const today = new Date();
//   const dayOfWeek = today.getDay();
//   const sunday = new Date(today);
//   sunday.setDate(today.getDate() - dayOfWeek);
//   const yyyy = sunday.getFullYear();
//   const mm = String(sunday.getMonth() + 1).padStart(2, '0');
//   const dd = String(sunday.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// export default function CurrentMeetingPage() {
//   const sundayDate = getMostRecentSunday();
//   const meetings = getMeetings(sundayDate);

//   if (meetings.length === 0) redirect('/meetings');

//   redirect(`/meetings/${meetings[0].id}`);
// }

import { getMeetings } from '@/lib/meeting-db';
import { redirect } from 'next/navigation';

function pickCurrentMeetingId(): number | null {
  const meetings = getMeetings();
  if (meetings.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1) Primera reunión cuya fecha sea hoy o en el futuro
  const upcoming = meetings
    .map((m) => ({ ...m, dateObj: new Date(m.date + 'T00:00:00') }))
    .filter((m) => m.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length > 0) return upcoming[0].id;

  // 2) Si todas están en el pasado, devolver la más reciente
  const past = meetings
    .map((m) => ({ ...m, dateObj: new Date(m.date + 'T00:00:00') }))
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

  return past[0].id;
}

export default function CurrentMeetingPage() {
  const id = pickCurrentMeetingId();
  if (id === null) redirect('/meetings');
  redirect(`/meetings/${id}`);
}