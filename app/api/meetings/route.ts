import { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meeting-db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get('date');
  const query = searchParams.get('query');
  const pageParam = searchParams.get('page');
  const page = pageParam ? Math.max(1, Number(pageParam) || 1) : 1;

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { error: 'Invalid date. Expected YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  try {
    const { meetings } = await getMeetings({
      date: date ?? null,
      query: query ?? null,
      page,
    });
    return Response.json(meetings);
  } catch (err) {
    console.error('GET /api/meetings failed:', err);
    return Response.json({ error: 'Failed to load meetings' }, { status: 500 });
  }
}