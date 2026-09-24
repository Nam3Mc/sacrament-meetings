import { NextRequest } from 'next/server';
import { getMeetingById } from '@/lib/meeting-db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Next 15: params is a Promise. On Next 14, use `params` directly (no await).
  const { id } = await params;

  // Reject anything that isn't a plain integer before touching the DB.
  if (!/^\d+$/.test(id)) {
    return Response.json(
      { error: 'Invalid meeting id. Expected an integer.' },
      { status: 400 }
    );
  }

  const numericId = Number(id);

  try {
    const meeting = await getMeetingById(numericId);
    if (!meeting) {
      return Response.json({ error: 'Meeting not found' }, { status: 404 });
    }
    return Response.json(meeting);
  } catch (err) {
    console.error(`GET /api/meetings/${id} failed:`, err);
    return Response.json({ error: 'Failed to load meeting' }, { status: 500 });
  }
}