// Shared code for the Cloudflare Pages Functions in /functions: loads the song
// catalog from the backend and renders server-side song pages for search engines.
import { isCyrilicWord, transliterate } from '../src/locales/transliterate';

export interface Env {
  ASSETS: { fetch: (input: Request | string | URL) => Promise<Response> };
  REACT_APP_BACKEND_URL?: string;
  BACKEND_URL?: string;
}

export interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  next: () => Promise<Response>;
}

export interface SongLink {
  type: 'audio' | 'video' | 'other';
  name: string;
  url: string;
}

export interface Song {
  id: string;
  name: string;
  type: string;
  bagpipesToPlay: string[];
  timeSignature?: string;
  originalTempo?: number;
  labels?: string[];
  about?: string;
  lyrycs?: string;
  transcribedBy?: string;
  links?: SongLink[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Site {
  name: string;
  url: string;
  noun: string;
  isProduction: boolean;
}

const PRODUCTION_HOSTS = ['dudahero.org', 'flute.dudahero.org'];
const FLUTE_INSTRUMENT = 'tw';

export const getSite = (request: Request): Site => {
  const { host } = new URL(request.url);
  const isFlute = host.startsWith('flute.');
  return {
    name: isFlute ? 'Flute Hero' : 'Duda Hero',
    url: isFlute ? 'https://flute.dudahero.org' : 'https://dudahero.org',
    noun: isFlute ? 'flute' : 'bagpipe',
    isProduction: PRODUCTION_HOSTS.includes(host),
  };
};

export const songTypeLabels: Record<string, string> = {
  belarusian: 'Belarusian',
  schotland: 'Scottish',
  irish: 'Irish',
  polish: 'Polish',
  balkan: 'Balkan',
  serbian: 'Serbian',
  medieval: 'Medieval',
  scandinavian: 'Scandinavian',
  exercises: 'Exercises',
  composed: 'Composed',
  other: 'Other',
};

// Display order of the catalog sections
export const songTypeOrder = Object.keys(songTypeLabels);

export const instrumentLabels: Record<string, string> = {
  bd: 'Belarusian traditional duda',
  bnd: 'Belarusian non-traditional closed duda',
  bod: 'Belarusian open duda',
  ddl: 'Dudelsack',
  ghb: 'Great Highland bagpipe',
  pl: 'Greater Poland bagpipe',
  tw: 'Tin whistle',
};

export const typeLabel = (type: string) => songTypeLabels[type] || 'Traditional';

export const songPath = (id: string) => `/songs/${encodeURIComponent(id)}`;
export const playerPath = (id: string) => `/app/play/${encodeURIComponent(id)}`;

const backendUrl = (env: Env) => (env.REACT_APP_BACKEND_URL || env.BACKEND_URL || '').replace(/\/$/, '');

// The whole catalog (a few hundred songs, without notes). Cached at the edge for
// ten minutes so crawlers don't hit the backend on every page.
export const loadSongs = async (env: Env, request: Request): Promise<Song[]> => {
  const base = backendUrl(env);
  if (!base) throw new Error('REACT_APP_BACKEND_URL is not set for Pages Functions');
  const res = await fetch(`${base}/v1/songs`, {
    headers: { Accept: 'application/json' },
    cf: { cacheTtl: 600, cacheEverything: true },
  } as RequestInit);
  if (!res.ok) throw new Error(`Song list request failed: ${res.status}`);
  const songs = (await res.json()) as Song[];
  const isFlute = getSite(request).noun === 'flute';
  return songs.filter((song) => {
    if (!song?.id || !song.name) return false;
    const instruments = song.bagpipesToPlay || [];
    const fluteOnly = instruments.length > 0 && instruments.every((i) => i === FLUTE_INSTRUMENT);
    return isFlute ? instruments.includes(FLUTE_INSTRUMENT) : !fluteOnly;
  });
};

export const findSong = (songs: Song[], id: string) => songs.find((song) => song.id === id);

export const relatedSongs = (songs: Song[], song: Song, limit = 12): Song[] => {
  const labels = new Set(song.labels || []);
  const score = (other: Song) =>
    (other.type === song.type ? 10 : 0) + (other.labels || []).filter((l) => labels.has(l)).length;
  return songs
    .filter((other) => other.id !== song.id && other.type === song.type)
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name))
    .slice(0, limit);
};

export const esc = (text: unknown) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// JSON for a <script type="application/ld+json"> block (no "</script>" breakouts)
const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

const cleanText = (text: string) => text.replace(/\s+/g, ' ').trim();

export const truncate = (text: string, limit: number) => {
  const clean = cleanText(text);
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  const space = cut.lastIndexOf(' ');
  return `${space > limit / 2 ? cut.slice(0, space) : cut}…`;
};

const textLang = (text: string) => (isCyrilicWord(text) ? 'be' : 'en');

// "Верабей" -> "Верабей (Vierabiej)"; Latin names stay as they are
export const nameWithLatin = (name: string) => {
  if (!isCyrilicWord(name)) return name;
  const latin = transliterate(name);
  return latin && latin !== name ? `${name} (${latin})` : name;
};

const instrumentList = (song: Song) =>
  (song.bagpipesToPlay || []).map((code) => instrumentLabels[code]).filter(Boolean) as string[];

export const songTitle = (song: Song, site: Site) => {
  const what = song.lyrycs ? 'notes and lyrics' : 'notes and fingering';
  return `${nameWithLatin(song.name)} – ${typeLabel(song.type)} ${site.noun} tune, ${what} | ${site.name}`;
};

export const songDescription = (song: Song, site: Site) => {
  if (song.about && cleanText(song.about).length > 40) return truncate(song.about, 158);
  const instruments = instrumentList(song);
  const facts = [song.timeSignature, song.originalTempo ? `${Math.round(song.originalTempo / 2)} BPM` : '']
    .filter(Boolean)
    .join(', ');
  return truncate(
    `Learn to play ${song.name}, a ${typeLabel(song.type)} tune, on ${
      instruments.length ? instruments.join(', ') : `the ${site.noun}`
    }: fingering animation, sheet music${song.lyrycs ? ' and lyrics' : ''}.${facts ? ` ${facts}.` : ''}`,
    158
  );
};

const pageStyles = `
:root{--bg:#FCF7F2;--ink:#2b1b18;--muted:#6D5353;--accent:#A9142F;--accent-ink:#fff;--line:#DDD5CE;--card:#fff}
@media (prefers-color-scheme: dark){:root{--bg:#1d1514;--ink:#f3ebe6;--muted:#c4b3ad;--accent:#F12425;--line:#3d2f2c;--card:#271d1b}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 Raleway,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
a{color:var(--accent)}
header.top{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--line)}
header.top a{color:var(--ink);text-decoration:none;font-weight:700}
header.top img{width:32px;height:32px}
header.top nav{margin-left:auto;display:flex;gap:16px;font-size:15px}
main{max-width:760px;margin:0 auto;padding:16px 16px 48px}
.crumbs{font-size:14px;color:var(--muted);margin:8px 0 0}
.crumbs a{color:var(--muted)}
h1{font-size:30px;line-height:1.25;margin:12px 0 4px}
.subtitle{color:var(--muted);margin:0 0 20px}
.play{display:inline-block;background:var(--accent);color:var(--accent-ink);padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:700;font-size:17px}
.facts{display:grid;grid-template-columns:max-content 1fr;gap:6px 16px;margin:24px 0;padding:16px;background:var(--card);border:1px solid var(--line);border-radius:12px}
.facts dt{color:var(--muted)}
.facts dd{margin:0}
h2{font-size:21px;margin:32px 0 8px}
.lyrics{white-space:pre-line;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
ul.songs{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:4px 16px}
ul.songs li{padding:4px 0;border-bottom:1px solid var(--line)}
footer{max-width:760px;margin:0 auto;padding:24px 16px;color:var(--muted);font-size:14px}
`;

interface PageOptions {
  site: Site;
  path: string;
  title: string;
  description: string;
  ogType?: string;
  jsonLd: unknown[];
  body: string;
}

export const renderPage = ({ site, path, title, description, ogType = 'website', jsonLd, body }: PageOptions) => {
  const url = `${site.url}${path}`;
  const image = `${site.url}/android-chrome-512x512.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="${esc(ogType)}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#A9142F">
${jsonLd.map((data) => `<script type="application/ld+json">${ldJson(data)}</script>`).join('\n')}
<style>${pageStyles}</style>
</head>
<body>
<header class="top">
<a href="/"><img src="/duda.png" alt="" width="32" height="32"></a>
<a href="/">${esc(site.name)}</a>
<nav><a href="/songs">Songs</a><a href="/app">Player</a><a href="/learning-book">Learn</a></nav>
</header>
<main>
${body}
</main>
<footer>${esc(site.name)}: learn to play the ${esc(site.noun)} with fingering animation and sheet music. <a href="/about">About</a> · <a href="/contacts">Contacts</a></footer>
</body>
</html>`;
};

const breadcrumbLd = (site: Site, items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${site.url}${item.path}`,
  })),
});

const breadcrumbHtml = (items: Array<{ name: string; path?: string }>) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((item) => (item.path ? `<a href="${esc(item.path)}">${esc(item.name)}</a>` : esc(item.name)))
    .join(' › ')}</nav>`;

const songListHtml = (songs: Song[]) =>
  `<ul class="songs">${songs
    .map((song) => `<li><a href="${esc(songPath(song.id))}">${esc(song.name)}</a></li>`)
    .join('')}</ul>`;

export const renderSongPage = (song: Song, songs: Song[], site: Site) => {
  const path = songPath(song.id);
  const title = songTitle(song, site);
  const description = songDescription(song, site);
  const type = typeLabel(song.type);
  const typePath = `/songs#${encodeURIComponent(song.type)}`;
  const instruments = instrumentList(song);
  const latin = isCyrilicWord(song.name) ? transliterate(song.name) : '';
  const related = relatedSongs(songs, song);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Songs', path: '/songs' },
    { name: type, path: typePath },
    { name: song.name, path },
  ];

  const composition: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: song.name,
    ...(latin ? { alternateName: latin } : {}),
    genre: `${type} folk music`,
    url: `${site.url}${path}`,
    description,
    isAccessibleForFree: true,
    ...(song.about ? { inLanguage: textLang(song.about) } : {}),
    ...(song.lyrycs
      ? { lyrics: { '@type': 'CreativeWork', text: song.lyrycs, inLanguage: textLang(song.lyrycs) } }
      : {}),
    ...(song.labels?.length ? { keywords: song.labels.join(', ') } : {}),
    ...(song.updatedAt ? { dateModified: song.updatedAt } : {}),
  };

  const facts: Array<[string, string]> = [
    ['Type', type],
    ...(instruments.length ? [['Instruments', instruments.join(', ')] as [string, string]] : []),
    ...(song.timeSignature ? [['Time signature', song.timeSignature] as [string, string]] : []),
    ...(song.originalTempo ? [['Tempo', `${Math.round(song.originalTempo / 2)} BPM`] as [string, string]] : []),
    ...(song.transcribedBy ? [['Transcribed by', song.transcribedBy] as [string, string]] : []),
  ];

  const links = (song.links || []).filter((link) => /^https?:\/\//.test(link.url));

  const body = `
${breadcrumbHtml(crumbs.map((c, i) => (i === crumbs.length - 1 ? { name: c.name } : c)))}
<h1>${esc(song.name)}</h1>
<p class="subtitle">${latin ? `${esc(latin)} · ` : ''}${esc(type)} ${esc(site.noun)} tune</p>
<p><a class="play" href="${esc(playerPath(song.id))}">▶ Play on ${esc(site.noun)}</a></p>
<p>Open the player to hear ${esc(song.name)} and follow the fingering for every note, slow it down, loop hard bars or switch to sheet music.</p>
${song.about ? `<h2>About the song</h2>\n<p lang="${textLang(song.about)}">${esc(song.about.trim()).replace(/\n+/g, '</p><p>')}</p>` : ''}
${song.lyrycs ? `<h2>Lyrics</h2>\n<div class="lyrics" lang="${textLang(song.lyrycs)}">${esc(song.lyrycs.trim())}</div>` : ''}
<h2>Details</h2>
<dl class="facts">${facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
${
  links.length
    ? `<h2>Listen and watch</h2>\n<ul>${links
        .map((link) => `<li><a href="${esc(link.url)}" rel="noopener nofollow" target="_blank">${esc(link.name || link.url)}</a></li>`)
        .join('')}</ul>`
    : ''
}
${related.length ? `<h2>More ${esc(type)} tunes</h2>\n${songListHtml(related)}\n<p><a href="${esc(typePath)}">All ${esc(type)} tunes</a></p>` : ''}
`;

  return renderPage({
    site,
    path,
    title,
    description,
    ogType: 'music.song',
    jsonLd: [composition, breadcrumbLd(site, crumbs)],
    body,
  });
};

export const renderCatalogPage = (songs: Song[], site: Site) => {
  const byType = new Map<string, Song[]>();
  songs.forEach((song) => {
    const list = byType.get(song.type) || [];
    list.push(song);
    byType.set(song.type, list);
  });
  const types = Array.from(byType.keys()).sort(
    (a, b) => (songTypeOrder.indexOf(a) + 1 || 99) - (songTypeOrder.indexOf(b) + 1 || 99)
  );
  const title = `${site.noun === 'flute' ? 'Flute' : 'Bagpipe'} tunes: ${songs.length} folk songs with notes and lyrics | ${site.name}`;
  const description = truncate(
    `Browse ${songs.length} ${site.noun} tunes: ${types
      .slice(0, 6)
      .map((t) => typeLabel(t))
      .join(', ')} and more. Each one plays with fingering animation and sheet music, many with lyrics and history.`,
    158
  );
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Songs', path: '/songs' },
  ];
  const body = `
${breadcrumbHtml([crumbs[0], { name: 'Songs' }])}
<h1>${site.noun === 'flute' ? 'Flute' : 'Bagpipe'} tunes</h1>
<p class="subtitle">${songs.length} tunes you can play along with in ${esc(site.name)}</p>
<p>${types.map((t) => `<a href="#${esc(encodeURIComponent(t))}">${esc(typeLabel(t))}</a>`).join(' · ')}</p>
${types
  .map((t) => {
    const list = (byType.get(t) || []).slice().sort((a, b) => a.name.localeCompare(b.name));
    return `<h2 id="${esc(t)}">${esc(typeLabel(t))} (${list.length})</h2>\n${songListHtml(list)}`;
  })
  .join('\n')}
`;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} tunes`,
    numberOfItems: songs.length,
    itemListElement: songs.map((song, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${site.url}${songPath(song.id)}`,
      name: song.name,
    })),
  };
  return renderPage({
    site,
    path: '/songs',
    title,
    description,
    jsonLd: [itemList, breadcrumbLd(site, crumbs)],
    body,
  });
};

export const htmlResponse = (html: string, site: Site, status = 200) => {
  const headers: Record<string, string> = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=600',
  };
  // _headers does not apply to Functions, so mark non-production hosts here
  if (!site.isProduction) headers['X-Robots-Tag'] = 'noindex';
  return new Response(html, { status, headers });
};

export const notFoundPage = (site: Site) =>
  htmlResponse(
    renderPage({
      site,
      path: '/songs',
      title: `Song not found | ${site.name}`,
      description: 'This song is not in the catalog.',
      jsonLd: [],
      body: `<h1>Song not found</h1><p>This song is not in the catalog any more. <a href="/songs">See all songs</a>.</p>`,
    }).replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"'),
    site,
    404
  );

export const unavailablePage = (site: Site) => {
  const res = htmlResponse(
    renderPage({
      site,
      path: '/songs',
      title: `${site.name}`,
      description: 'The song catalog is temporarily unavailable.',
      jsonLd: [],
      body: `<h1>The song catalog is temporarily unavailable</h1><p>Please try again in a minute, or <a href="/app">open the player</a>.</p>`,
    }),
    site,
    503
  );
  res.headers.set('Retry-After', '120');
  res.headers.set('Cache-Control', 'no-store');
  return res;
};

export const paramValue = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value.join('/') : value || '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};
