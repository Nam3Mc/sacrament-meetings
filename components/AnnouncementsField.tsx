'use client';

import { useState } from 'react';

interface Props {
  defaultValue?: string[];
}

export default function AnnouncementsField({ defaultValue = [] }: Props) {
  const [rows, setRows] = useState(defaultValue.map((body) => ({ body })));

  const update = (i: number, body: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { body } : r)));

  const serialized = rows.filter((r) => r.body.trim() !== '');

  return (
    <fieldset className="border p-3 rounded space-y-2">
      <legend className="px-1 font-medium">Announcements</legend>

      <input type="hidden" name="announcements" value={JSON.stringify(serialized)} />

      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            aria-label={`Announcement ${i + 1}`}
            value={row.body}
            onChange={(e) => update(i, e.target.value)}
            className="border p-2 flex-1"
          />
          <button
            type="button"
            onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
            className="text-red-600 px-2"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, { body: '' }])}
        className="text-blue-600 text-sm"
      >
        + Add announcement
      </button>
    </fieldset>
  );
}