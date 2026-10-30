import { links } from './links';
import { userClient } from './user';
import { withAuth } from './utils';
import { MelodyRoll } from '../utils/midiUtils/melodyRoll';

export interface UserMelody {
  id: string;
  title: string;
  // "abc": typed as ABC notation; "roll": drawn in the piano-roll editor
  format: 'abc' | 'roll';
  abc?: string;
  roll?: MelodyRoll;
  createdAt: string;
  updatedAt: string;
}

export type MelodyInput =
  | { title: string; format?: 'abc'; abc: string }
  | { title: string; format: 'roll'; roll: MelodyRoll };

// Melodies users made themselves, either as ABC notation or drawn in the
// piano-roll editor. Both are converted to MIDI in the browser when played
// (abcToMidi / rollToMidi).
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
