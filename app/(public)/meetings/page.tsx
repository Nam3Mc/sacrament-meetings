import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import { getMeetings } from '@/lib/meeting-db';

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; date?: string; query?: string }>;
}) {
  const { page, date, query } = await searchParams;
  const currentPage = Number(page) || 1;

  const {
    meetings,
    total,
    totalPages,
    hasNext,
    hasPrev,
  } = await getMeetings({
    date: date ?? null,
    query: query ?? null,
    page: currentPage,
  });

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (query) params.set('query', query);
    params.set('page', String(p));
    return `/meetings?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <span className="text-sm text-gray-500">
          {total} {query ? 'matching' : 'total'}
        </span>
      </div>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {query ? `No meetings match “${query}”.` : 'No meetings found.'}
        </p>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Link
            href={buildHref(currentPage - 1)}
            aria-disabled={!hasPrev}
            className={`px-3 py-1 rounded border text-sm ${
              hasPrev
                ? 'border-gray-300 hover:bg-gray-50'
                : 'border-gray-200 text-gray-300 pointer-events-none'
            }`}
          >
            ← Previous
          </Link>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <Link
            href={buildHref(currentPage + 1)}
            aria-disabled={!hasNext}
            className={`px-3 py-1 rounded border text-sm ${
              hasNext
                ? 'border-gray-300 hover:bg-gray-50'
                : 'border-gray-200 text-gray-300 pointer-events-none'
            }`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  );
}