import { links } from './links';
import { userClient } from './user';
import { withAuth } from './utils';

export interface UserMelody {
  id: string;
  title: string;
  abc: string;
  createdAt: string;
  updatedAt: string;
}

export interface MelodyInput {
  title: string;
  abc: string;
}

// Melodies users wrote themselves, stored as ABC notation. They're converted
// to MIDI in the browser (abcToMidi) when played, like /app/abc.
export const melodiesApi = {
  getMyMelodies: async (): Promise<UserMelody[]> => {
    const res = await userClient.get<{ melodies: UserMelody[] }>(links.melodies, withAuth());
    return res.data.melodies;
  },

  // Open without login, so a melody link can be shared
  getMelody: async (id: string): Promise<UserMelody> => {
    const res = await userClient.get<UserMelody>(`${links.melodies}/${encodeURIComponent(id)}`);
    return res.data;
  },

  addMelody: async (melody: MelodyInput): Promise<UserMelody> => {
    const res = await userClient.post<UserMelody>(links.melodies, melody, withAuth());
    return res.data;
  },

  updateMelody: async (id: string, melody: MelodyInput): Promise<UserMelody> => {
    const res = await userClient.put<UserMelody>(`${links.melodies}/${encodeURIComponent(id)}`, melody, withAuth());
    return res.data;
  },

  removeMelody: async (id: string): Promise<void> => {
    await userClient.delete(`${links.melodies}/${encodeURIComponent(id)}`, withAuth());
  },
};

// The server answers validation failures with { error: "..." }
export const getMelodyError = (error: any): string | undefined => error?.response?.data?.error;
