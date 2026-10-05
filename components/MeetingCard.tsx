// components/MeetingCard.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { SacramentMeeting } from '@/lib/types';
import DeleteMeetingButton from './DeleteMeetingButton';

interface Props {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: Props) {
  const { status } = useSession();
  const isAuthed = status === 'authenticated';

  const dateObj = new Date(`${meeting.date}T00:00:00`);
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
    <div className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Full-card click target */}
      <Link
        href={`/meetings/${meeting.id}`}
        className="absolute inset-0 rounded-lg"
        aria-label={`View meeting on ${formattedDate}`}
      />

      <div className="relative flex justify-between items-start pointer-events-none">
        {/* Left: title + meta */}
        <div className="pointer-events-auto">
          <h3 className="text-lg font-semibold text-gray-800">
            {formattedDate}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {meeting.meetingType} meeting
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Presiding: {meeting.presiding}
          </p>
        </div>

        {/* Right column: speaker badge, then delete button below it */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {speakerCount} speaker{speakerCount !== 1 ? 's' : ''}
          </span>

          {isAuthed && (
            <DeleteMeetingButton id={meeting.id} />
          )}
        </div>
      </div>
    </div>
  );
}