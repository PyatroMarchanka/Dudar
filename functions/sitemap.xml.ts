// /sitemap.xml built on request from the live catalog, so newly approved songs
// are listed without a deploy. Replaces the old committed public/sitemap.xml.
import { PagesContext, canonicalSongId, esc, getSite, loadSongs, songPath } from '../edge/songs';

// Only pages with their own content. /app (no song chosen) and /about (no such
// route) rendered empty pages that Google reported as soft 404s.
const STATIC_PATHS = ['/', '/songs', '/playlists', '/eduda', '/learning-book', '/contacts'];
const LANGUAGES = ['en', 'be', 'pl'];

const day = (date?: string) => {
  const parsed = date ? new Date(date) : null;
  return parsed && !isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : undefined;
};

const urlEntry = (loc: string, lastmod?: string, alternates = '') =>
  `<url><loc>${esc(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates}</url>`;

export const onRequestGet = async ({ request, env }: PagesContext) => {
  const site = getSite(request);
  let songs;
  try {
    songs = await loadSongs(env, request);
  } catch (error) {
    console.error(error);
    return new Response('Sitemap temporarily unavailable', { status: 503, headers: { 'Retry-After': '300' } });
  }

  const entries = STATIC_PATHS.map((path) => urlEntry(`${site.url}${path}`));
  // Bagpipe variants of one song (`-bd` ids) share a canonical page: list it once
  songs
    .filter((song) => canonicalSongId(songs!, song.id) === song.id)
    .forEach((song) => entries.push(urlEntry(`${site.url}${songPath(song.id)}`, day(song.updatedAt || song.createdAt))));

  // Articles exist in every language at /article/<lang>/<slug>
  const backend = (env.REACT_APP_BACKEND_URL || env.BACKEND_URL || '').replace(/\/$/, '');
  if (site.noun !== 'flute' && backend) {
    try {
      const res = await fetch(`${backend}/v1/articles`, { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit);
      const posts = res.ok
        ? ((await res.json()) as Array<{
            slug?: string;
            updatedAt?: string;
            publishedAt?: string;
            createdAt?: string;
            availableLanguages?: string[];
          }>)
        : [];
      posts
        .filter((post) => post?.slug)
        .forEach((post) => {
          // Only the languages the article is written in. A missing translation
          // shows another language's text, which Google flags as a duplicate.
          const languages = post.availableLanguages
            ? LANGUAGES.filter((lang) => post.availableLanguages!.includes(lang))
            : LANGUAGES;
          const href = (lang: string) => `${site.url}/article/${lang}/${encodeURIComponent(post.slug!)}`;
          const alternates =
            languages.length > 1
              ? languages.map((lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href(lang))}"/>`).join('')
              : '';
          const lastmod = day(post.updatedAt || post.publishedAt || post.createdAt);
          languages.forEach((lang) => entries.push(urlEntry(href(lang), lastmod, alternates)));
        });
    } catch (error) {
      console.error('Articles for sitemap failed', error);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  };
  if (!site.isProduction) headers['X-Robots-Tag'] = 'noindex';
  return new Response(xml, { headers });
};
