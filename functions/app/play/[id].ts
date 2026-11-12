declare const HTMLRewriter: any;
// /app/play/<id>: still the React player, but the title, description, canonical
// and link-preview tags are filled in at the edge, so crawlers and messengers
// that don't run JavaScript (Telegram, Facebook, WhatsApp) see the song.
import { PagesContext, canonicalSongId, esc, findSong, getSite, loadSongs, paramValue, songDescription, songPath, songTitle } from '../../../edge/songs';

export const onRequestGet = async ({ request, env, params, next }: PagesContext) => {
  const page = await next();
  if (!(page.headers.get('Content-Type') || '').includes('text/html')) return page;

  const site = getSite(request);
  let songs;
  try {
    songs = await loadSongs(env, request);
  } catch (error) {
    console.error(error);
    return page;
  }
  const song = findSong(songs, paramValue(params.id));
  if (!song) {
    // Unknown or removed song: the app shows "song not found", so answer 404
    // instead of 200 (a soft 404 for Google). The app itself still loads.
    const headers = new Headers(page.headers);
    headers.set('X-Robots-Tag', 'noindex');
    headers.set('Cache-Control', 'no-store');
    return new Response(page.body, { status: 404, headers });
  }

  const title = songTitle(song, site);
  const description = songDescription(song, site);
  const canonical = `${site.url}${songPath(canonicalSongId(songs, song.id))}`;
  const content: Record<string, string> = {
    description,
    'og:title': title,
    'og:description': description,
    'og:url': canonical,
    'og:type': 'music.song',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:url': canonical,
  };

  const rewriter = new HTMLRewriter()
    .on('title', { element: (el: any) => el.setInnerContent(title) })
    .on('meta', {
      element: (el: any) => {
        const key = el.getAttribute('name') || el.getAttribute('property');
        if (key && key in content) el.setAttribute('content', content[key]);
      },
    })
    .on('head', {
      element: (el: any) => el.append(`<link data-rh="true" rel="canonical" href="${esc(canonical)}">`, { html: true }),
    });

  const res = rewriter.transform(page);
  const headers = new Headers(res.headers);
  if (!site.isProduction) headers.set('X-Robots-Tag', 'noindex');
  return new Response(res.body, { status: res.status, headers });
};
