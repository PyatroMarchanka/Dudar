const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = 'https://dudahero.org';
const BLOG_API_URL = process.env.REACT_APP_BACKEND_URL + '/v1/articles';

interface BlogPost {
  slug: string;
}

const generateSitemap = async () => {
  const languages = ['en', 'be', 'pl'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Main Routes -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/app</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/login</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/playlists</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${BASE_URL}/eduda</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/learning-book</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  
  <!-- Blog Posts -->
  ${await Promise.all(languages.map(async (lang) => {
    try {
      const response = await fetch(`${BLOG_API_URL}`);
      const posts = await response.json();
      console.log(`Found ${posts} posts for language ${lang}`);
      return posts.map((post: BlogPost) => `
  <url>
    <loc>${BASE_URL}/article/${lang}/${post.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    ${languages.map(altLang => `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${BASE_URL}/article/${altLang}/${post.slug}" />`).join('')}
  </url>`).join('');
    } catch (error) {
      console.error(`Error fetching blog posts for language ${lang}:`, error);
      return '';
    }
  })).then(results => results.join(''))}
</urlset>`;

  return sitemap;
};

const updateSitemap = async () => {
  try {
    const sitemap = await generateSitemap();
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('Sitemap updated successfully');
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};

updateSitemap();

export {};