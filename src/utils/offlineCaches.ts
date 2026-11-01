// Cache Storage names shared by the service worker and the "Save for
// offline" button, which fills the same caches directly.
export const offlineCaches = {
  samples: 'samples-v1',
  midi: 'midi-v1',
  clickSounds: 'click-sounds-v1',
  api: 'api-v1',
  // The notes of songs stored in the database, one entry per version of a song
  songNotes: 'song-notes-v1',
  styles: 'styles-v1',
  fonts: 'fonts-v1',
};
