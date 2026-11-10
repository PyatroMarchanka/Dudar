// /songs: the whole catalog grouped by type, linking to every song page.
import { PagesContext, getSite, htmlResponse, loadSongs, renderCatalogPage, unavailablePage } from '../../edge/songs';

export const onRequestGet = async ({ request, env }: PagesContext) => {
  const site = getSite(request);
  try {
    const songs = await loadSongs(env, request);
    return htmlResponse(renderCatalogPage(songs, site), site);
  } catch (error) {
    console.error(error);
    return unavailablePage(site);
  }
};
