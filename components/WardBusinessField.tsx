'use client';

import { useState } from 'react';
import type { WardBusinessItem } from '@/lib/types';

interface Props {
  defaultValue?: WardBusinessItem[];
}

export default function WardBusinessField({ defaultValue = [] }: Props) {
  const [rows, setRows] = useState(
    defaultValue.map((wb) => ({ description: wb.description }))
  );

  const update = (i: number, description: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { description } : r)));

  const serialized = rows.filter((r) => r.description.trim() !== '');

  return (
    <fieldset className="border p-3 rounded space-y-2">
      <legend className="px-1 font-medium">Ward business</legend>

      <input type="hidden" name="ward_business" value={JSON.stringify(serialized)} />

      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            aria-label={`Ward business ${i + 1}`}
            value={row.description}
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
        onClick={() => setRows((prev) => [...prev, { description: '' }])}
        className="text-blue-600 text-sm"
      >
        + Add ward business
      </button>
    </fieldset>
  );
}