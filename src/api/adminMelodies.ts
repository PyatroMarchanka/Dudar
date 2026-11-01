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
    const res = await userClient.post<{ melody: AdminMelody; song: Song }>(url(id, '/approve'), fields, withAuth());
    return res.data;
  },

  reject: async (id: string, body: { comment?: string; removeFromCatalog?: boolean }) => {
    const res = await userClient.post<{ melody: AdminMelody }>(url(id, '/reject'), body, withAuth());
    return res.data;
  },
};
