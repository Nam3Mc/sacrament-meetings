import MeetingForm from '@/components/MeetingForm';
import { getHymns } from '@/lib/hyms-db';
import { createMeeting } from '@/lib/meeting-db';

export default async function CreateMeetingPage() {
  const hymns = (await getHymns()) ?? [];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create meeting</h1>
      <MeetingForm action={createMeeting} hymns={hymns} />
    </main>
  );
}