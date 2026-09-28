import { getCurrentMeeting } from '@/lib/meeting-db';
import { redirect } from 'next/navigation';

export default async function CurrentMeetingPage() {
  const meeting = await getCurrentMeeting();
  if (!meeting) redirect('/meetings');
  redirect(`/meetings/${meeting.id}`);
}