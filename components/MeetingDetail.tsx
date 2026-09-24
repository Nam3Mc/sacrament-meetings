'use client';

import type { Hymn, SacramentMeeting } from '@/lib/types';

interface Props {
  meeting: SacramentMeeting;
}

const MEETING_TYPE_LABELS: Record<string, string> = {
  regular: 'Regular',
  stake_conference: 'Stake Conference',
  fast_and_testimony: 'Fast & Testimony',
  general_conference: 'General Conference',
};

function HymnLine({ label, hymn }: { label: string; hymn: Hymn | null }) {
  if (!hymn) {
    return (
      <p>
        <span className="font-semibold">{label}:</span> <span className="text-gray-400">TBD</span>
      </p>
    );
  }
  return (
    <p>
      <span className="font-semibold">{label}:</span> #{hymn.number} – {hymn.title}
    </p>
  );
}

export default function MeetingDetail({ meeting }: Props) {
  
  const dateObj = new Date(`${meeting.date}T00:00:00`);
  const formattedDate = isNaN(dateObj.getTime())
    ? 'Date TBD'
    : dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const meetingTypeLabel =
    MEETING_TYPE_LABELS[meeting.meetingType] ?? meeting.meetingType;

  const announcements = meeting.announcements ?? [];
  const wardBusiness = meeting.wardBusiness ?? [];
  const speakers = meeting.speakers ?? [];

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 print:border-0 print:p-0">
      <div className="print:hidden mb-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Print Program
        </button>
      </div>

      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Sacrament Meeting Program
        </h2>
        <p className="text-gray-600">{formattedDate}</p>
        <p className="text-sm text-gray-500">{meetingTypeLabel} meeting</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="font-semibold">Presiding:</p>
          <p>{meeting.presiding}</p>
        </div>
        <div>
          <p className="font-semibold">Conducting:</p>
          <p>{meeting.conducting}</p>
        </div>
      </div>

      {announcements.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Announcements
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {announcements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6">
        <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          Opening
        </h3>
        <div className="text-sm space-y-1">
          <HymnLine label="Opening Hymn" hymn={meeting.openingHymn} />
          <p>
            <span className="font-semibold">Opening Prayer:</span>{' '}
            {meeting.openingPrayer}
          </p>
        </div>
      </section>

      {(wardBusiness.length > 0 || meeting.stakeBusiness) && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Ward &amp; Stake Business
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {wardBusiness.map((item, i) => (
              <li key={i}>{item.description}</li>
            ))}
            {meeting.stakeBusiness && <li>Stake Business</li>}
          </ul>
        </section>
      )}

      <section className="mb-6">
        <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          Sacrament
        </h3>
        <div className="text-sm space-y-1">
          <HymnLine label="Sacrament Hymn" hymn={meeting.sacramentHymn} />
        </div>
      </section>

      {speakers.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Speakers &amp; Musical Numbers
          </h3>
          <ul className="text-sm space-y-2">
            {speakers.map((s, i) => (
              <li key={i}>
                {s.type === 'musical-number' ? (
                  <span className="italic">{s.name} (Musical Number)</span>
                ) : (
                  <>
                    <span className="font-semibold">{s.name}</span>
                    {s.topic && <> – {s.topic}</>}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          Closing
        </h3>
        <div className="text-sm space-y-1">
          <HymnLine label="Closing Hymn" hymn={meeting.closingHymn ?? null} />
          <p>
            <span className="font-semibold">Closing Prayer:</span>{' '}
            {meeting.closingPrayer}
          </p>
        </div>
      </section>
    </article>
  );
}