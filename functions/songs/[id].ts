// /songs/<id>: a server-rendered page per song (name, about, lyrics, details,
// related songs) so search engines can index it without running the app.
import {
  PagesContext,
  findSong,
  getSite,
  htmlResponse,
  loadSongs,
  notFoundPage,
  paramValue,
  renderSongPage,
  unavailablePage,
} from '../../edge/songs';

export const onRequestGet = async ({ request, env, params }: PagesContext) => {
  const site = getSite(request);
  let songs;
  try {
    songs = await loadSongs(env, request);
  } catch (error) {
    console.error(error);
    return unavailablePage(site);
  }
  const song = findSong(songs, paramValue(params.id));
  if (!song) return notFoundPage(site);
  return htmlResponse(renderSongPage(song, songs, site), site);
};
