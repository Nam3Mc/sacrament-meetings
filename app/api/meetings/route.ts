import { NextRequest } from 'next/server';
import { getMeetings } from '@/lib/meeting-db';

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date');
  const meetings = getMeetings(date);
  return Response.json(meetings);
}