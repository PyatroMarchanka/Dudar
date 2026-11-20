// /learning-book: the React article list, with the list of articles (links in
// every language they are written in) put into the page at the edge so crawlers
// can find every article without running JavaScript.
import { loadArticleIndex, renderLearningBook, rewriteAppShell, withRobots } from '../edge/articles';
import { PagesContext, getSite } from '../edge/songs';

export const onRequestGet = async ({ request, env, next }: PagesContext) => {
  const page = await next();
  if (!(page.headers.get('Content-Type') || '').includes('text/html')) return page;
  const site = getSite(request);
  if (site.noun === 'flute') return page;
  try {
    const index = await loadArticleIndex(env);
    return withRobots(rewriteAppShell(page, renderLearningBook(site, index)), site);
  } catch (error) {
    console.error(error);
    return page;
  }
};
