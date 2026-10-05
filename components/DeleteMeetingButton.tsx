'use client';

import { useState, useTransition } from 'react';
import { deleteMeeting } from '@/lib/meeting-db';

export default function DeleteMeetingButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm('Delete this meeting?')) return;

    setError(null);
    startTransition(async () => {
      try {
        const result = await deleteMeeting(id);
        // deleteMeeting returns State — surface server-side errors to the user
        if (result?.message) {
          setError(result.message);
        }
        // On success, deleteMeeting calls revalidatePath + returns
        // { message: null, errors: {} } — the list refreshes automatically
      } catch (err) {
        console.error('Delete failed:', err);
        setError(
          err instanceof Error && err.message === 'Not authenticated'
            ? 'You must be signed in to delete meetings.'
            : 'Could not delete the meeting. Please try again.',
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full hover:bg-red-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Deleting…' : 'Delete'}
      </button>

      {error && (
        <span className="text-xs text-red-700 max-w-[200px] text-right">
          {error}
        </span>
      )}
    </div>
  );
}