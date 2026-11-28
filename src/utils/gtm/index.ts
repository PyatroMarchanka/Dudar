// Analytics events, pushed to the Google Tag Manager dataLayer.
// GTM itself is loaded only on the production hosts (see public/index.html),
// so on release, previews and localhost these pushes go nowhere.
//
// In GTM, one GA4 Event tag with event name {{Event}} and a Custom Event
// trigger matching the names below forwards all of them to GA4.

type WindowWithDataLayer = Window & {
  dataLayer?: Record<string, unknown>[];
};

declare const window: WindowWithDataLayer;

export type AnalyticsEvent =
  | 'song_play'
  | 'favorite_add'
  | 'favorite_remove'
  | 'share'
  | 'login'
  | 'melody_save'
  | 'melody_submit'
  | 'pwa_install';

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export const track = (event: AnalyticsEvent | 'song_loaded', params: AnalyticsParams = {}) => {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    if (process.env.NODE_ENV === 'development') {
      console.debug('[analytics]', event, params);
    }
  } catch (e) {
    // Analytics must never break the app
  }
};

interface SongLike {
  id?: string;
  name?: string;
  type?: string;
  activeVersionId?: string;
}

// The parameters every song event carries, so GA4 can break plays down by
// song, genre, instrument and version
export const songParams = (song: SongLike | null | undefined, bagpipe?: string): AnalyticsParams => ({
  song_id: song?.id,
  song_name: song?.name,
  song_type: song?.type,
  song_version: song?.activeVersionId,
  bagpipe,
});
