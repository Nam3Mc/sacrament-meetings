import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meeting-db';

export default async function MeetingsPage() {
  const meetings = getMeetings();

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
      {meetings.length === 0 && (
        <p className="text-gray-500 text-center py-8">No meetings found.</p>
      )}
    </div>
  );
}