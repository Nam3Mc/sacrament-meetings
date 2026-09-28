import { z } from 'zod';

// Empty string / null / undefined → null; otherwise coerce to int.
export const nullableInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().int().nullable()
);

/* ---------- Speakers ---------- */
export const SpeakerSchema = z.object({
  name: z.string().min(1),
  topic: z.string().min(1),
  type: z.enum(['speaker', 'musical-number']),
});
export type SpeakerInput = z.infer<typeof SpeakerSchema>;

/* ---------- Announcements ---------- */
export const AnnouncementSchema = z.object({
  body: z.string().min(1),
});
export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;

/* ---------- Ward business ---------- */
export const WardBusinessSchema = z.object({
  description: z.string().min(1),
});
export type WardBusinessInput = z.infer<typeof WardBusinessSchema>;

/* ---------- Meeting (top level) ---------- */
export const MEETING_TYPES = ['testimony', 'regular', 'stake', 'general'] as const;

export const MeetingFormSchema = z.object({
  meeting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  meeting_type: z.enum(MEETING_TYPES),
  presiding: z.string().min(1),
  conducting: z.string().min(1),
  opening_hymn: nullableInt,
  opening_prayer: z.string().min(1),
  stake_business: z.coerce.boolean().default(false),
  sacrament_hymn: nullableInt,
  closing_hymn: nullableInt,
  closing_prayer: z.string().min(1),
  speakers: z.array(SpeakerSchema).default([]),
  announcements: z.array(AnnouncementSchema).default([]),
  ward_business: z.array(WardBusinessSchema).default([]),
});
export type MeetingInput = z.infer<typeof MeetingFormSchema>;

/* ---------- Helper: parse a JSON FormData entry into a typed array ---------- */
export function parseJsonArray<T>(raw: FormDataEntryValue | null, schema: z.ZodType<T>): T[] {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON in one of the list fields.');
  }
  return z.array(schema).parse(parsed);
}