declare const HTMLRewriter: any;
// /app/play/<id>: still the React player, but the title, description, canonical
// and link-preview tags are filled in at the edge, so crawlers and messengers
// that don't run JavaScript (Telegram, Facebook, WhatsApp) see the song.
import { PagesContext, esc, findSong, getSite, loadSongs, paramValue, songDescription, songPath, songTitle } from '../../../edge/songs';

export const onRequestGet = async ({ request, env, params, next }: PagesContext) => {
  const page = await next();
  if (!(page.headers.get('Content-Type') || '').includes('text/html')) return page;

  const site = getSite(request);
  let song;
  try {
    song = findSong(await loadSongs(env, request), paramValue(params.id));
  } catch (error) {
    console.error(error);
  }
  if (!song) return page;

  const title = songTitle(song, site);
  const description = songDescription(song, site);
  const canonical = `${site.url}${songPath(song.id)}`;
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
