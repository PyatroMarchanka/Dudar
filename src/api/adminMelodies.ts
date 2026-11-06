import { links } from './links';
import { userClient } from './user';
import { withAuth } from './utils';
import { MelodyInput, ReviewStatus, UserMelody } from './melodies';
import { Song } from '../dataset/songs/interfaces';

// A melody as an admin sees it: with who added, reviewed and last edited it
export interface AdminMelody extends UserMelody {
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPicture?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  lastEditedBy?: string;
  lastEditedByName?: string;
  catalogSongId?: string;
}

export interface AdminMelodyPage {
  melodies: AdminMelody[];
  total: number;
  pageSize: number;
}

export type ReviewCounts = { pending: number; approved: number; rejected: number };

// What goes into the catalog song when a melody is approved
export interface CatalogFields {
  name: string;
  type: string;
  bagpipesToPlay: string[];
  timeSignature: string;
  // Catalog convention: double the real BPM
  originalTempo: number;
  labels: string[];
  about?: string;
  transcribedBy?: string;
}

// Approving writes the catalog song and clears the song caches: give it more time than the usual 10 s
const APPROVE_TIMEOUT_MS = 30000;

// What went wrong with an admin request, in words: the server's own reason
// when it sent one, otherwise what kind of failure it was
export const describeAdminError = (error: any): string => {
  const data = error?.response?.data;
  if (typeof data?.error === 'string' && data.error) return data.error;
  const status = error?.response?.status;
  if (status === 401 || status === 403) return 'Not allowed: log in again as an admin';
  if (status === 404) return 'Not found on the server (404)';
  if (status) return `The server answered with error ${status}${error.response.statusText ? ` ${error.response.statusText}` : ''}`;
  if (error?.code === 'ECONNABORTED' || /timeout/i.test(error?.message ?? '')) {
    return 'The server took too long to answer. Reload the page to see whether it went through.';
  }
  if (error?.request) return 'No answer from the server. Check your connection and try again.';
  return error?.message || 'Something went wrong';
};

const url = (id: string, action = '') => `${links.adminMelodies}/${encodeURIComponent(id)}${action}`;

// Review of the melodies users send in. The server lets only admins in.
export const adminMelodiesApi = {
  list: async (status: ReviewStatus, page = 0): Promise<AdminMelodyPage> => {
    const res = await userClient.get<AdminMelodyPage>(links.adminMelodies, {
      ...withAuth(),
      params: { status, page },
    });
    return res.data;
  },

  counts: async (): Promise<ReviewCounts> => {
    const res = await userClient.get<ReviewCounts>(`${links.adminMelodies}/counts`, withAuth());
    return res.data;
  },

  get: async (id: string): Promise<AdminMelody> => {
    const res = await userClient.get<AdminMelody>(url(id), withAuth());
    return res.data;
  },

  update: async (id: string, melody: MelodyInput): Promise<AdminMelody> => {
    const res = await userClient.put<AdminMelody>(url(id), melody, withAuth());
    return res.data;
  },

  approve: async (id: string, fields: CatalogFields & { comment?: string }) => {
    const res = await userClient.post<{ melody: AdminMelody; song: Song }>(url(id, '/approve'), fields, {
      ...withAuth(),
      timeout: APPROVE_TIMEOUT_MS,
    });
    return res.data;
  },

  reject: async (id: string, body: { comment?: string; removeFromCatalog?: boolean }) => {
    const res = await userClient.post<{ melody: AdminMelody }>(url(id, '/reject'), body, withAuth());
    return res.data;
  },
};
