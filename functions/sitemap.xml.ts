// /sitemap.xml built on request from the live catalog, so newly approved songs
// are listed without a deploy. Replaces the old committed public/sitemap.xml.
import { ARTICLE_LANGUAGES as LANGUAGES, ArticleLang, articlePath, loadArticleIndex } from '../edge/articles';
import { PagesContext, canonicalSongId, esc, getSite, loadSongs, songPath } from '../edge/songs';

// Only pages with their own content. /app (no song chosen) and /about (no such
// route) rendered empty pages that Google reported as soft 404s.
const STATIC_PATHS = ['/', '/songs', '/playlists', '/eduda', '/learning-book', '/contacts'];

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

  // Articles: one URL per language the article is written in (a missing
  // translation shows another language's text, which Google flags as a duplicate)
  if (site.noun !== 'flute') {
    try {
      const articles = await loadArticleIndex(env);
      articles.forEach((article) => {
        const languages = LANGUAGES.filter((lang) => article.titles[lang]);
        const href = (lang: ArticleLang) => `${site.url}${articlePath(lang, article.slug)}`;
        const alternates =
          languages.length > 1
            ? [...languages, 'x-default' as const]
                .map((lang) => {
                  const target = lang === 'x-default' ? (languages.includes('en') ? 'en' : languages[0]) : lang;
                  return `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href(target))}"/>`;
                })
                .join('')
            : '';
        const lastmod = day(article.updatedAt || article.publishedAt || article.createdAt);
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
