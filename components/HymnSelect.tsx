import { Hymn } from "@/lib/types";

interface Props {
  id: string;
  name: string;
  label: string;
  hymns: Hymn[];
  defaultValue?: number | null;
}

export default function HymnSelect({ id, name, label, hymns, defaultValue = null }: Props) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ''}
        className="border p-2 w-full"
      >
        <option value="">—</option>
        {hymns.map((h) => (
          <option key={h.number} value={h.number}>
            {h.number}. {h.title}
          </option>
        ))}
      </select>
    </div>
  );
}