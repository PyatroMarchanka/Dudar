import { BagpipeTypes } from '../interfaces';
import { links } from '../api/links';
import { resolveSongUrl } from '../api/songClient';
import { Song } from '../dataset/songs/interfaces';
import { getSampleUrls } from './midiUtils/sampler';
import { offlineCaches } from './offlineCaches';

// "Save for offline": puts the sounds of the chosen bagpipe, every song and
// the song catalog into the caches the service worker reads from, so the app
// works with a bad or no connection (lessons in a basement). It writes the
// caches directly, so it works even before the service worker controls the
// page.

const timeSignatures = ['3-4', '4-4', '5-4', '5-8', '6-4', '6-8', '7-8', '9-8', '11-8'];
const metronomeUrls = ['/midi/common/metronome.mid', ...timeSignatures.map((ts) => `/midi/common/metronome-${ts}.mid`)];
const parallelDownloads = 6;

export type OfflineProgress = { done: number; total: number };
export type OfflineResult = { saved: number; failed: number };

export const isOfflineSaveSupported = () => typeof window !== 'undefined' && 'caches' in window;

type Download = { cacheName: string; url: string; init?: RequestInit };

// Saves one URL unless it is already saved. Opaque responses (the third-party
// click sounds) can't be checked, but are what the service worker caches too.
const saveOne = async ({ cacheName, url, init }: Download): Promise<boolean> => {
  const cache = await caches.open(cacheName);
  if (await cache.match(url, { ignoreVary: true })) {
    return true;
  }
  const response = await fetch(url, init);
  if (!response.ok && response.type !== 'opaque') {
    return false;
  }
  await cache.put(url, response);
  return true;
};

const fetchSongList = async (): Promise<Song[]> => {
  const response = await fetch(links.songs);
  if (!response.ok) {
    throw new Error(`Song list request failed: ${response.status}`);
  }
  const cache = await caches.open(offlineCaches.api);
  await cache.put(links.songs, response.clone());
  return response.json();
};

export const saveForOffline = async (
  bagpipeType: BagpipeTypes,
  clickSoundUrls: string[],
  onProgress: (progress: OfflineProgress) => void
): Promise<OfflineResult> => {
  // Asks the browser not to clear these files when space runs low.
  navigator.storage?.persist?.().catch(() => {});

  const songs = await fetchSongList();
  const songUrls = Array.from(new Set(songs.filter((song) => song.pathName).map((song) => resolveSongUrl(song.pathName))));

  const downloads: Download[] = [
    ...getSampleUrls(bagpipeType).map((url) => ({ cacheName: offlineCaches.samples, url })),
    ...clickSoundUrls.map((url) => ({ cacheName: offlineCaches.clickSounds, url, init: { mode: 'no-cors' as RequestMode } })),
    ...metronomeUrls.map((url) => ({ cacheName: offlineCaches.midi, url })),
    ...songUrls.map((url) => ({ cacheName: offlineCaches.midi, url })),
  ];

  let done = 0;
  let failed = 0;
  let next = 0;
  onProgress({ done, total: downloads.length });

  const worker = async () => {
    while (next < downloads.length) {
      const download = downloads[next++];
      const ok = await saveOne(download).catch(() => false);
      if (!ok) {
        failed++;
      }
      done++;
      onProgress({ done, total: downloads.length });
    }
  };
  await Promise.all(Array.from({ length: parallelDownloads }, worker));

  return { saved: done - failed, failed };
};

// True when the chosen bagpipe's sounds and the song catalog are saved.
export const isSavedForOffline = async (bagpipeType: BagpipeTypes): Promise<boolean> => {
  if (!isOfflineSaveSupported()) {
    return false;
  }
  try {
    const [samples, api] = await Promise.all([caches.open(offlineCaches.samples), caches.open(offlineCaches.api)]);
    const matches = await Promise.all([
      api.match(links.songs, { ignoreVary: true }),
      ...getSampleUrls(bagpipeType).map((url) => samples.match(url)),
    ]);
    return matches.every(Boolean);
  } catch {
    return false;
  }
};
