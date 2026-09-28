export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general';

  export interface GetMeetingsOptions {
  date?: string | null;
  query?: string | null;
  page?: number;
}

export interface Hymn {
  number: number;
  title: string;
}

export interface AnnouncementItem {
  id: number;
  meetingId: number;
  sortOrder: number;
  body: string;
}

export interface SpeakerItem {
  id: number;
  meetingId: number;
  sortOrder: number;
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  id: number;
  meetingId: number;
  sortOrder: number;
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;              // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn | null;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn | null;
  speakers: SpeakerItem[];
  closingHymn?: Hymn | null;
  closingPrayer: string;
}

export interface State {
  message: string | null;
  errors: Record<string, string[]>;
}

export const initialState: State = { message: null, errors: {} };

export const PAGE_SIZE = 10;

export interface PaginatedMeetings {
  meetings: SacramentMeeting[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetMeetingsOptions {
  date?: string | null;
  query?: string | null;
  page?: number;
}