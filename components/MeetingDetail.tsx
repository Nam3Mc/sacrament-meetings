'use client';

import type { SacramentMeeting } from '@/lib/types';

interface Props {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: Props) {
  const dateObj = new Date(meeting.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
        <p className="text-sm text-gray-500 capitalize">
          {meeting.meetingType} meeting
        </p>
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

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Announcements
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {meeting.announcements.map((a, i) => (
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
          <p>
            <span className="font-semibold">Opening Hymn:</span>{' '}
            #{meeting.openingHymn.number} – {meeting.openingHymn.title}
          </p>
          <p>
            <span className="font-semibold">Opening Prayer:</span>{' '}
            {meeting.openingPrayer}
          </p>
        </div>
      </section>

      {(meeting.wardBusiness.length > 0 || meeting.stakeBusiness) && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Ward &amp; Stake Business
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {meeting.wardBusiness.map((item, i) => (
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
        <p className="text-sm">
          <span className="font-semibold">Sacrament Hymn:</span> #
          {meeting.sacramentHymn.number} – {meeting.sacramentHymn.title}
        </p>
      </section>

      {meeting.speakers.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            Speakers &amp; Musical Numbers
          </h3>
          <ul className="text-sm space-y-2">
            {meeting.speakers.map((s, i) => (
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
          <p>
            <span className="font-semibold">Closing Hymn:</span> #
            {meeting.closingHymn.number} – {meeting.closingHymn.title}
          </p>
          <p>
            <span className="font-semibold">Closing Prayer:</span>{' '}
            {meeting.closingPrayer}
          </p>
        </div>
      </section>
    </article>
  );
}