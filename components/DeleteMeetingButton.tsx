'use client';

import { deleteMeeting } from "@/lib/meeting-db";

export default function DeleteMeetingButton({ id }: { id: number }) {
  const handleDelete = async (_formData: FormData) => {
    await deleteMeeting(id);
  };

  return (
    <form
      action={handleDelete}
      onSubmit={(e) => {
        if (!confirm('Delete this meeting?')) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full hover:bg-red-200 transition-colors cursor-pointer"
      >
        Delete
      </button>
    </form>
  );
}