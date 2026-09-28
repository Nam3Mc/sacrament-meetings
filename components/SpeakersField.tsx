'use client';

import { useState } from 'react';
import type { SpeakerItem } from '@/lib/types';

interface Props {
  defaultValue?: SpeakerItem[];
}

interface Row {
  name: string;
  topic: string;
  type: SpeakerItem['type'];
}

export default function SpeakersField({ defaultValue = [] }: Props) {
  const [rows, setRows] = useState<Row[]>(
    defaultValue.map((s) => ({ name: s.name, topic: s.topic, type: s.type }))
  );

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  // Only submit rows the user actually filled in.
  const serialized = rows.filter(
    (r) => r.name.trim() !== '' || r.topic.trim() !== ''
  );

  return (
    <fieldset className="border p-3 rounded space-y-2">
      <legend className="px-1 font-medium">Speakers</legend>

      <input type="hidden" name="speakers" value={JSON.stringify(serialized)} />

      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            aria-label={`Speaker ${i + 1} name`}
            placeholder="Name"
            value={row.name}
            onChange={(e) => update(i, { name: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            aria-label={`Speaker ${i + 1} topic`}
            placeholder="Topic"
            value={row.topic}
            onChange={(e) => update(i, { topic: e.target.value })}
            className="border p-2 flex-1"
          />
          <select
            aria-label={`Speaker ${i + 1} type`}
            value={row.type}
            onChange={(e) => update(i, { type: e.target.value as SpeakerItem['type'] })}
            className="border p-2"
          >
            <option value="speaker">Speaker</option>
            <option value="musical-number">Musical number</option>
          </select>
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
        onClick={() =>
          setRows((prev) => [...prev, { name: '', topic: '', type: 'speaker' }])
        }
        className="text-blue-600 text-sm"
      >
        + Add speaker
      </button>
    </fieldset>
  );
}