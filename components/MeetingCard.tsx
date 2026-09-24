import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';

interface Props {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: Props) {
  const dateObj =
    meeting.date instanceof Date
      ? meeting.date
      : new Date(`${meeting.date}T00:00:00`);

  const formattedDate = isNaN(dateObj.getTime())
    ? 'Date TBD'
    : dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const speakerCount = meeting.speakers?.length ?? 0;

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formattedDate}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {meeting.meetingType} meeting
          </p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {speakerCount} speaker{speakerCount !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Presiding: {meeting.presiding}
      </p>
    </Link>
  );
}