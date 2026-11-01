import { Song } from '../dataset/songs/interfaces';
import { getSongNotesUrl, songApi } from '../api/songClient';
import { isMelodySong } from './midiUtils/catalogMelody';

const MAX_PER_RUN = 60;
const PARALLEL = 2;

const isSlowConnection = () => {
  const connection = (navigator as any).connection;
  return Boolean(connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType ?? '')));
};

const whenIdle = (task: () => void) =>
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (window as any).requestIdleCallback(task, { timeout: 5000 })
    : setTimeout(task, 1500);

// Songs stored as notes need a request that .mid files don't. Fetch their notes
// in idle time after the list loads, so opening one is instant. The service
// worker keeps each version forever, so a song already saved is skipped here
// and each device downloads every version once.
export const prefetchSongNotes = (songs: Song[]) => {
  if (typeof window === 'undefined' || !navigator.onLine || isSlowConnection()) return;
  const queue = songs.filter((song) => isMelodySong(song) && song._id);

  whenIdle(async () => {
    const pending: Song[] = [];
    for (const song of queue) {
      if (pending.length >= MAX_PER_RUN) break;
      const saved = 'caches' in window ? await caches.match(getSongNotesUrl(song)).catch(() => undefined) : undefined;
      if (!saved) pending.push(song);
    }
    const worker = async () => {
      for (let song = pending.shift(); song; song = pending.shift()) {
        try {
          await songApi.getSongNotes(song);
        } catch (error) {
          return;
        }
      }
    };
    await Promise.all(Array.from({ length: PARALLEL }, worker));
  });
};
