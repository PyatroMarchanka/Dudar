// /article/<lang>/<slug>: still the React article page, but the head (title,
// description, canonical, hreflang, link previews, BlogPosting JSON-LD) and the
// article text are filled in at the edge, so search engines and messengers that
// don't run JavaScript see the article.
import {
  loadArticle,
  loadArticleIndex,
  renderArticle,
  rewriteAppShell,
  shownLanguage,
  withRobots,
} from '../../../edge/articles';
import { PagesContext, getSite, paramValue } from '../../../edge/songs';

export const onRequestGet = async ({ request, env, params, next }: PagesContext) => {
  const page = await next();
  if (!(page.headers.get('Content-Type') || '').includes('text/html')) return page;

  const site = getSite(request);
  // Flute Hero has no articles; leave its app shell alone
  if (site.noun === 'flute') return page;

  let article;
  try {
    article = await loadArticle(env, paramValue(params.slug));
  } catch (error) {
    console.error(error);
    return page;
  }
  // Unknown or deleted article: the app shows "not found", so answer 404, not a soft 404
  if (!article) return withRobots(page, site, 404, true);

  const lang = shownLanguage(article, paramValue(params.lang));
  if (!lang) return withRobots(page, site, 404, true);

  let index: Awaited<ReturnType<typeof loadArticleIndex>> = [];
  try {
    index = await loadArticleIndex(env);
  } catch (error) {
    // Only the author name and the "more articles" links come from the index
    console.error(error);
  }
  return withRobots(rewriteAppShell(page, renderArticle(site, article, lang, index)), site);
};
