import { getMeetingById } from '@/lib/meeting-db';
import { NextRequest } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return Response.json({ error: 'Invalid meeting ID' }, { status: 400 });
  }

  const meeting = getMeetingById(Number(id));

  if (!meeting) {
    return Response.json({ error: 'Meeting not found' }, { status: 404 });
  }

  return Response.json(meeting);
}