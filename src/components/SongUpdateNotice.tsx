import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Snackbar } from '@material-ui/core';
import { loadSongList } from '../api/appData';
import { songApi } from '../api/songClient';
import { Song } from '../dataset/songs/interfaces';
import { routes } from '../router/routes';

// How soon after one check another may start: a refresh of the song list is
// announced more than once when play counts change between two of them
const MIN_CHECK_GAP_MS = 20_000;

const bySongKey = (songs: Song[]) => new Map(songs.map((song) => [song._id ?? song.id, song]));

const isSongListUpdate = (data: any) => {
  if (data?.type !== 'CACHE_UPDATED' || data?.meta !== 'workbox-broadcast-update') return false;
  try {
    return new URL(data.payload?.updatedURL).pathname === '/v1/songs';
  } catch {
    return false;
  }
};

// Tells the user when the song list was refreshed with new, changed or
// removed songs, so a song edited by an admin doesn't stay old on a phone that
// kept the app open (or opened it offline-first). The service worker answers
// the list from its saved copy at once and refreshes it in the background;
// when that brings a different list it says so, and the page compares it with
// the one it started with. Play counts change the list all the time, so only
// songs whose `updatedAt` moved (or that appeared or went) count.
export const SongUpdateNotice = () => {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const [notice, setNotice] = useState<'songs' | 'thisSong' | null>(null);
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;

  useEffect(() => {
    // The embedded ABC player has no catalog to update
    if (window.location.pathname.startsWith(`${routes.app}/${routes.abc}`)) return;

    let baseline = loadSongList().then(bySongKey);
    baseline.catch(() => {});
    let lastCheck = 0;

    const check = async () => {
      if (Date.now() - lastCheck < MIN_CHECK_GAP_MS) return;
      lastCheck = Date.now();
      try {
        const before = await baseline;
        const after = bySongKey(await songApi.getSongList());
        const changed: Song[] = [];
        after.forEach((song, key) => {
          const old = before.get(key);
          if (!old || String(old.updatedAt) !== String(song.updatedAt)) changed.push(song);
        });
        before.forEach((song, key) => {
          if (!after.has(key)) changed.push(song);
        });
        baseline = Promise.resolve(after);
        if (!changed.length) return;

        const playing = pathRef.current.match(new RegExp(`^${routes.app}/${routes.play}/([^/]+)`))?.[1];
        const playingId = playing && decodeURIComponent(playing);
        setNotice(playingId && changed.some((song) => song.id === playingId) ? 'thisSong' : 'songs');
      } catch (error) {
        console.log(error);
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (isSongListUpdate(event.data)) check();
    };
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('workbox') : undefined;
    channel?.addEventListener('message', onMessage);
    navigator.serviceWorker?.addEventListener('message', onMessage);

    return () => {
      channel?.removeEventListener('message', onMessage);
      channel?.close();
      navigator.serviceWorker?.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <Snackbar
      open={!!notice}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      message={notice === 'thisSong' ? t('songUpdates.thisSong') : t('songUpdates.updated')}
      action={
        <>
          <Button color="secondary" size="small" onClick={() => window.location.reload()}>
            {t('songUpdates.refresh')}
          </Button>
          <Button color="inherit" size="small" onClick={() => setNotice(null)}>
            ✕
          </Button>
        </>
      }
    />
  );
};
