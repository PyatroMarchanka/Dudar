// Shared code for the article (blog / Learning Book) Pages Functions. The articles
// are React pages, so the Functions keep serving the app but fill in the head
// (title, description, canonical, hreflang, link previews, JSON-LD) and put the
// article text into #root, so crawlers that don't run JavaScript see the article.
// ReactDOM.render replaces #root's content when the app starts.
import { Env, Site, esc, ldJson, truncate } from './songs';
import {
  absoluteUrl as absoluteUrlFor,
  addMissingAlt,
  firstImage as firstImageFor,
  htmlToText,
} from '../src/utils/articleSeo';

declare const HTMLRewriter: any;

export const ARTICLE_LANGUAGES = ['en', 'be', 'pl'] as const;
export type ArticleLang = (typeof ARTICLE_LANGUAGES)[number];

export interface ArticleAuthor {
  _id?: string;
  name?: string;
  picture?: string;
}

interface ArticleTranslation {
  title?: string;
  content?: string;
  excerpt?: string;
  metaDescription?: string;
  tags?: string[];
}

export interface FullArticle {
  _id: string;
  slug: string;
  author?: ArticleAuthor | string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  featuredImage?: string;
  translations?: Record<string, ArticleTranslation | undefined>;
  defaultLanguage?: string;
  category?: string;
}

interface Preview {
  slug?: string;
  title?: string;
  excerpt?: string;
  author?: ArticleAuthor;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  featuredImage?: string;
  category?: string;
}

// One entry per article, with the title of each language it is written in
export interface ArticleIndexEntry {
  slug: string;
  titles: Partial<Record<ArticleLang, string>>;
  excerpts: Partial<Record<ArticleLang, string>>;
  author?: ArticleAuthor;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  featuredImage?: string;
  category?: string;
}

const backendUrl = (env: Env) => (env.REACT_APP_BACKEND_URL || env.BACKEND_URL || '').replace(/\/$/, '');

const cached = { cf: { cacheTtl: 3600, cacheEverything: true } } as RequestInit;

export const articlePath = (lang: string, slug: string) => `/article/${lang}/${encodeURIComponent(slug)}`;

// The previews endpoint answers per language and leaves the title empty when the
// article has no translation in it, so a non-empty title means "written in it".
export const loadArticleIndex = async (env: Env): Promise<ArticleIndexEntry[]> => {
  const backend = backendUrl(env);
  if (!backend) throw new Error('REACT_APP_BACKEND_URL is not set');
  const lists = await Promise.all(
    ARTICLE_LANGUAGES.map(async (lang) => {
      const res = await fetch(`${backend}/v1/articles?language=${lang}`, cached);
      if (!res.ok) throw new Error(`Articles (${lang}) failed: ${res.status}`);
      return { lang, posts: (await res.json()) as Preview[] };
    })
  );
  const bySlug = new Map<string, ArticleIndexEntry>();
  lists.forEach(({ lang, posts }) =>
    (Array.isArray(posts) ? posts : []).forEach((post) => {
      if (!post?.slug) return;
      const entry = bySlug.get(post.slug) || {
        slug: post.slug,
        titles: {},
        excerpts: {},
        author: post.author && typeof post.author === 'object' ? post.author : undefined,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        featuredImage: post.featuredImage,
        category: post.category,
      };
      if (post.title?.trim()) entry.titles[lang] = post.title.trim();
      if (post.excerpt?.trim()) entry.excerpts[lang] = post.excerpt.trim();
      bySlug.set(post.slug, entry);
    })
  );
  return Array.from(bySlug.values()).filter((entry) => Object.keys(entry.titles).length > 0);
};

export const loadArticle = async (env: Env, slug: string): Promise<FullArticle | null> => {
  const backend = backendUrl(env);
  if (!backend) throw new Error('REACT_APP_BACKEND_URL is not set');
  const res = await fetch(`${backend}/v1/articles/${encodeURIComponent(slug)}`, cached);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Article ${slug} failed: ${res.status}`);
  const article = (await res.json()) as FullArticle;
  return article && article.slug ? article : null;
};

export const writtenLanguages = (article: FullArticle): ArticleLang[] =>
  ARTICLE_LANGUAGES.filter((lang) => Boolean(article.translations?.[lang]?.title?.trim()));

// Same rule as ArticlePage: the URL's language if the article is written in it,
// otherwise its default language, otherwise the first one it has.
export const shownLanguage = (article: FullArticle, lang: string): ArticleLang | undefined => {
  const languages = writtenLanguages(article);
  if ((languages as string[]).includes(lang)) return lang as ArticleLang;
  if (article.defaultLanguage && (languages as string[]).includes(article.defaultLanguage))
    return article.defaultLanguage as ArticleLang;
  return languages[0];
};

export const absoluteUrl = (site: Site, src?: string) => absoluteUrlFor(site.url, src);
export const firstImage = (site: Site, html = '') => firstImageFor(site.url, html);
export { addMissingAlt, htmlToText };

// Article content is written by admins in the editor; drop anything executable
// before putting it into the page served to everyone.
const sanitize = (html: string) =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed)\b[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');

const ogLocale: Record<string, string> = { en: 'en_US', be: 'be_BY', pl: 'pl_PL' };

const learningBookLabel: Record<ArticleLang, string> = {
  en: 'Learning Book',
  be: 'Кніга навучання',
  pl: 'Książka do nauki',
};
const moreArticlesLabel: Record<ArticleLang, string> = {
  en: 'More articles',
  be: 'Іншыя артыкулы',
  pl: 'Więcej artykułów',
};
const homeLabel: Record<ArticleLang, string> = { en: 'Home', be: 'Галоўная', pl: 'Strona główna' };

const dateOnly = (date?: string) => {
  const parsed = date ? new Date(date) : null;
  return parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : undefined;
};

export interface HeadData {
  lang: string;
  title: string;
  description: string;
  canonical: string;
  image: string;
  ogType: string;
  alternates?: Array<{ lang: string; href: string }>;
  extraMeta?: Array<[string, string]>;
  jsonLd: unknown[];
}

// Tags carry data-rh so react-helmet replaces them when the app starts
export const headHtml = (site: Site, head: HeadData) => {
  const meta = (attr: string, key: string, value: string) =>
    `<meta data-rh="true" ${attr}="${esc(key)}" content="${esc(value)}">`;
  const tags = [
    meta('name', 'description', head.description),
    `<link data-rh="true" rel="canonical" href="${esc(head.canonical)}">`,
    ...(head.alternates || []).map(
      (alt) => `<link data-rh="true" rel="alternate" hreflang="${esc(alt.lang)}" href="${esc(alt.href)}">`
    ),
    meta('property', 'og:type', head.ogType),
    meta('property', 'og:site_name', site.name),
    meta('property', 'og:url', head.canonical),
    meta('property', 'og:title', head.title),
    meta('property', 'og:description', head.description),
    meta('property', 'og:image', head.image),
    meta('property', 'og:locale', ogLocale[head.lang] || 'en_US'),
    ...(head.extraMeta || []).map(([key, value]) => meta('property', key, value)),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:url', head.canonical),
    meta('name', 'twitter:title', head.title),
    meta('name', 'twitter:description', head.description),
    meta('name', 'twitter:image', head.image),
    ...head.jsonLd.map((data) => `<script data-rh="true" type="application/ld+json">${ldJson(data)}</script>`),
  ];
  return tags.join('\n');
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

const bodyStyle =
  'max-width:900px;margin:0 auto;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;line-height:1.7';

export const renderArticle = (
  site: Site,
  article: FullArticle,
  lang: ArticleLang,
  index: ArticleIndexEntry[]
): RenderedPage => {
  const translation = article.translations?.[lang] || {};
  const title = (translation.title || '').trim();
  const path = articlePath(lang, article.slug);
  const canonical = `${site.url}${path}`;
  const content = translation.content || '';
  const text = htmlToText(content);
  const description = truncate(
    (translation.metaDescription || '').trim() || (translation.excerpt || '').trim() || text || title,
    158
  );
  const fromIndex = index.find((entry) => entry.slug === article.slug);
  const author =
    article.author && typeof article.author === 'object' && article.author.name ? article.author : fromIndex?.author;
  const image =
    absoluteUrl(site, article.featuredImage) || firstImage(site, content) || `${site.url}/android-chrome-512x512.png`;
  const published = dateOnly(
    article.publishedAt || article.createdAt || fromIndex?.publishedAt || fromIndex?.createdAt
  );
  const modified = dateOnly(article.updatedAt) || published;
  const languages = writtenLanguages(article);
  const alternates =
    languages.length > 1
      ? [
          ...languages.map((code) => ({ lang: code, href: `${site.url}${articlePath(code, article.slug)}` })),
          {
            lang: 'x-default',
            href: `${site.url}${articlePath(languages.includes('en') ? 'en' : languages[0], article.slug)}`,
          },
        ]
      : undefined;

  const crumbs = [
    { name: homeLabel[lang], path: '/' },
    { name: learningBookLabel[lang], path: '/learning-book' },
    { name: title, path },
  ];
  const publisher = {
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: { '@type': 'ImageObject', url: `${site.url}/android-chrome-512x512.png` },
  };
  const posting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: truncate(title, 110),
    description,
    image: [image],
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    inLanguage: lang,
    author: author?.name
      ? {
          '@type': 'Person',
          name: author.name,
          ...(absoluteUrl(site, author.picture) ? { image: absoluteUrl(site, author.picture) } : {}),
        }
      : { '@type': 'Organization', name: site.name, url: site.url },
    publisher,
    isAccessibleForFree: true,
  };
  if (published) posting.datePublished = published;
  if (modified) posting.dateModified = modified;
  if (translation.tags?.length) posting.keywords = translation.tags.join(', ');
  if (text) posting.wordCount = text.split(/\s+/).length;

  const extraMeta: Array<[string, string]> = [];
  if (published) extraMeta.push(['article:published_time', published]);
  if (modified) extraMeta.push(['article:modified_time', modified]);
  if (author?.name) extraMeta.push(['article:author', author.name]);

  const pageTitle = `${title} | ${site.name}`;
  const head = headHtml(site, {
    lang,
    title: pageTitle,
    description,
    canonical,
    image,
    ogType: 'article',
    alternates,
    extraMeta,
    jsonLd: [posting, breadcrumbLd(site, crumbs)],
  });

  const others = index
    .filter((entry) => entry.slug !== article.slug && entry.titles[lang])
    .slice(0, 12)
    .map((entry) => `<li><a href="${esc(articlePath(lang, entry.slug))}">${esc(entry.titles[lang])}</a></li>`)
    .join('');
  const otherLanguages = languages
    .filter((code) => code !== lang)
    .map((code) => `<a href="${esc(articlePath(code, article.slug))}" hreflang="${code}">${code.toUpperCase()}</a>`)
    .join(' · ');
  const body = `<article style="${bodyStyle}">
<nav aria-label="Breadcrumb"><a href="/">${esc(homeLabel[lang])}</a> › <a href="/learning-book">${esc(
    learningBookLabel[lang]
  )}</a></nav>
<h1>${esc(title)}</h1>
<p>${author?.name ? `${esc(author.name)} · ` : ''}${
    published ? `<time datetime="${published}">${published.slice(0, 10)}</time>` : ''
  }${otherLanguages ? ` · ${otherLanguages}` : ''}</p>
${article.featuredImage && absoluteUrl(site, article.featuredImage) ? `<img src="${esc(absoluteUrl(site, article.featuredImage))}" alt="${esc(title)}" style="max-width:100%">` : ''}
<div>${addMissingAlt(sanitize(content), title)}</div>
${others ? `<h2>${esc(moreArticlesLabel[lang])}</h2><ul>${others}</ul>` : ''}
</article>`;

  return { lang, title: pageTitle, head, body };
};

export const renderLearningBook = (site: Site, index: ArticleIndexEntry[]): RenderedPage => {
  const canonical = `${site.url}/learning-book`;
  const title = `Bagpipe Learning Guide - Articles on the Duda and Bagpipes | ${site.name}`;
  const description =
    'Articles for bagpipe players: how to start on the Belarusian duda, bagpipe history, music theory, repertoire and caring for the instrument.';
  const sorted = [...index].sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime()
  );
  const items = sorted.map((entry) => {
    const lang = (entry.titles.en ? 'en' : entry.titles.be ? 'be' : 'pl') as ArticleLang;
    return { entry, lang, title: entry.titles[lang] as string };
  });
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Learning Book',
    itemListElement: items.map(({ entry, lang, title: name }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      url: `${site.url}${articlePath(lang, entry.slug)}`,
    })),
  };
  const head = headHtml(site, {
    lang: 'en',
    title,
    description,
    canonical,
    image: `${site.url}/android-chrome-512x512.png`,
    ogType: 'website',
    jsonLd: [
      itemList,
      breadcrumbLd(site, [
        { name: 'Home', path: '/' },
        { name: 'Learning Book', path: '/learning-book' },
      ]),
    ],
  });
  const list = items
    .map(({ entry }) => {
      const links = ARTICLE_LANGUAGES.filter((code) => entry.titles[code])
        .map(
          (code) =>
            `<a href="${esc(articlePath(code, entry.slug))}" hreflang="${code}" lang="${code}">${esc(entry.titles[code])}</a>`
        )
        .join(' · ');
      const excerpt = entry.excerpts.en || entry.excerpts.be || entry.excerpts.pl;
      return `<li>${links}${excerpt ? `<br><span>${esc(truncate(excerpt, 200))}</span>` : ''}</li>`;
    })
    .join('');
  const body = `<main style="${bodyStyle}">
<nav aria-label="Breadcrumb"><a href="/">Home</a></nav>
<h1>Learning Book</h1>
<p>${esc(description)}</p>
<ul>${list}</ul>
</main>`;
  return { lang: 'en', title, head, body };
};

// Swap the app shell's generic head tags for the page's own and fill #root
export interface RenderedPage {
  lang: string;
  title: string;
  head: string;
  body: string;
}

export const rewriteAppShell = (page: Response, { lang, title, head, body }: RenderedPage) => {
  const managed = new Set([
    'description',
    'language',
    'og:type',
    'og:url',
    'og:title',
    'og:description',
    'og:image',
    'og:locale',
    'twitter:card',
    'twitter:url',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ]);
  return new HTMLRewriter()
    .on('html', { element: (el: any) => el.setAttribute('lang', lang) })
    .on('title', { element: (el: any) => el.remove() })
    .on('meta', {
      element: (el: any) => {
        const key = el.getAttribute('name') || el.getAttribute('property');
        if (key && managed.has(key)) el.remove();
      },
    })
    .on('link[rel="canonical"], link[rel="alternate"][hreflang]', { element: (el: any) => el.remove() })
    .on('script[type="application/ld+json"]', { element: (el: any) => el.remove() })
    .on('head', {
      element: (el: any) => el.append(`<title>${esc(title)}</title>\n${head}`, { html: true }),
    })
    .on('div#root', { element: (el: any) => el.setInnerContent(body, { html: true }) })
    .transform(page);
};

export const withRobots = (res: Response, site: Site, status = res.status, noindex = false) => {
  const headers = new Headers(res.headers);
  if (noindex || !site.isProduction) headers.set('X-Robots-Tag', 'noindex');
  headers.set('Cache-Control', status === 200 ? 'public, max-age=600' : 'no-store');
  return new Response(res.body, { status, headers });
};
