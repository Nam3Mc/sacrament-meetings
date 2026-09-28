import MeetingForm from "@/components/MeetingForm";
import { getHymns } from "@/lib/hyms-db";
import { getMeetingById, updateMeeting } from "@/lib/meeting-db";
import { notFound } from "next/navigation";

export default async function EditMeetingPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const meetingId = Number(id);
  if (!Number.isFinite(meetingId)) notFound();

  const [meeting, hymns] = await Promise.all([
    getMeetingById(meetingId),
    getHymns(),
  ]);
  if (!meeting) notFound();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit meeting</h1>
      <MeetingForm
        action={updateMeeting.bind(null, meetingId)}
        hymns={hymns}
        defaultValues={meeting}
      />
    </main>
  );
}