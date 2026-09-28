'use client';

import { useActionState } from 'react';
import SpeakersField from './SpeakersField';
import AnnouncementsField from './AnnouncementsField';
import WardBusinessField from './WardBusinessField';
import HymnSelect from './HymnSelect';
import { Hymn, SacramentMeeting } from '@/lib/types';
import { MEETING_TYPES } from '@/lib/schemas';
import type { State } from '@/lib/meeting-db';

interface Props {
  action: (prevState: State, formData: FormData) => Promise<State>;
  hymns: Hymn[];
  defaultValues?: SacramentMeeting;
}

const initialState: State = { message: null, errors: {} };

export default function MeetingForm({ action, hymns, defaultValues }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const dv = defaultValues;
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-4 max-w-3xl">
      <div>
        <label htmlFor="meeting_date">Date</label>
        <input
          id="meeting_date"
          name="meeting_date"
          type="date"
          required
          defaultValue={dv?.date ?? ''}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="meeting_type">Meeting type</label>
        <select
          id="meeting_type"
          name="meeting_type"
          required
          defaultValue={dv?.meetingType ?? 'regular'}
          className="border p-2 w-full"
        >
          {MEETING_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="presiding">Presiding</label>
          <input
            id="presiding"
            name="presiding"
            required
            defaultValue={dv?.presiding ?? ''}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="conducting">Conducting</label>
          <input
            id="conducting"
            name="conducting"
            required
            defaultValue={dv?.conducting ?? ''}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <HymnSelect
          id="opening_hymn"
          name="opening_hymn"
          label="Opening hymn"
          hymns={hymns}
          defaultValue={dv?.openingHymn?.number ?? null}
        />
        <HymnSelect
          id="sacrament_hymn"
          name="sacrament_hymn"
          label="Sacrament hymn"
          hymns={hymns}
          defaultValue={dv?.sacramentHymn?.number ?? null}
        />
        <HymnSelect
          id="closing_hymn"
          name="closing_hymn"
          label="Closing hymn"
          hymns={hymns}
          defaultValue={dv?.closingHymn?.number ?? null}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="opening_prayer">Opening prayer</label>
          <input
            id="opening_prayer"
            name="opening_prayer"
            required
            defaultValue={dv?.openingPrayer ?? ''}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="closing_prayer">Closing prayer</label>
          <input
            id="closing_prayer"
            name="closing_prayer"
            required
            defaultValue={dv?.closingPrayer ?? ''}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="stake_business"
          name="stake_business"
          type="checkbox"
          defaultChecked={dv?.stakeBusiness ?? false}
        />
        <label htmlFor="stake_business">Stake business</label>
      </div>

      <SpeakersField defaultValue={dv?.speakers} />
      <AnnouncementsField defaultValue={dv?.announcements} />
      <WardBusinessField defaultValue={dv?.wardBusiness} />

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}