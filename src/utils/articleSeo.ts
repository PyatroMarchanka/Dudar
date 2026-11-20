// Pure helpers for article SEO, shared by the React article page and the edge
// Functions (edge/articles.ts). Keep this file free of browser and app imports.

// Absolute URL for share images and JSON-LD; data: URLs and the like can't be shared
export const absoluteUrl = (siteUrl: string, src?: string) => {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) return `${siteUrl}${src}`;
  return undefined;
};

const decodeEntities = (text: string) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Plain text of the article HTML, for descriptions and word counts
export const htmlToText = (html = '') =>
  decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<\/(p|div|h[1-6]|li|blockquote)>|<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim();

// First shareable image in the article, used when there is no featured image
export const firstImage = (siteUrl: string, html = '') => {
  const re = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(html))) {
    const url = absoluteUrl(siteUrl, match[1]);
    if (url) return url;
  }
  return undefined;
};

const attr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// The article editor (Quill) inserts images without alt text: fall back to the article title
export const addMissingAlt = (html: string, alt: string) =>
  html.replace(/<img\b(?![^>]*\balt\s*=)/gi, `<img alt="${attr(alt)}"`);
