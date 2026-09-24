import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meeting-db';

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  const meeting = await getMeetingById(Number(id));   // ✅ await
  if (!meeting) notFound();

  return <MeetingDetail meeting={meeting} />;
}