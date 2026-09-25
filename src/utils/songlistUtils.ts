import { songApi } from "../api/songClient";
import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
  SongTags,
} from "../dataset/songs/interfaces";
import { BagpipeTypes } from "../interfaces";
import { transliterateSongList } from "../locales";

export const sortListsAlphabetically = (lists: SongListBySongType) => {
  return Object.entries(lists).reduce((acc, cur) => {
    const [key, value] = cur;
    acc[key] = value.sort((a, b) => {
      const fixedName = (name: string) => name.replace(/(І)/, "И");
      return fixedName(a.name) > fixedName(b.name) ? 1 : -1;
    });
    return acc;
  }, {} as SongListBySongType);
};

// Until the backend has songs tagged for an instrument, it borrows the list of a
// bagpipe with a matching scale. Highlander tunes are in A, like the whistle's default fingering.
const songListFallbacks: { [key in BagpipeTypes]?: BagpipeTypes } = {
  [BagpipeTypes.TinWhistle]: BagpipeTypes.Highlander,
};

export const sortSongsByBagpipe = (songs: Song[]): SongListByBagpipe => {
  const list: SongListByBagpipe = {};
  songs?.forEach((song) => {
    song.bagpipesToPlay.forEach((bagpipeType) => {
      if (list[bagpipeType]) {
        const isAlreadyInList = !!list[bagpipeType].find(
          (songFromList) => songFromList.name === song.name
        );
        const isSpecialForBagpipe = song.pathName.includes(`-${bagpipeType}`);

        if (!isAlreadyInList) {
          list[bagpipeType].push(song);
        } else if (isSpecialForBagpipe) {
          list[bagpipeType] = list[bagpipeType].slice(0, -1);
          list[bagpipeType].push(song);
        }
      } else {
        list[bagpipeType] = [song];
      }
    });
  });

  Object.entries(songListFallbacks).forEach(([type, fallbackType]) => {
    if (!list[type] && list[fallbackType!]) {
      list[type] = list[fallbackType!];
    }
  });

  return list;
};

export const sortSongsBySongType = (songs: Song[]): SongListBySongType => {
  const list: SongListBySongType = {};
  songs?.forEach((song) => {
    if (song.type in list) {
      list[song.type].push(song);
    } else {
      list[song.type] = [song];
    }
  });

  return list;
};

export const filterSongsByTags = (
  lists: SongListBySongType,
  songTags: SongTags[]
): SongListBySongType => {
  if (!songTags.length) return lists;

  return Object.entries(lists).reduce((acc, cur) => {
    const [key, value] = cur;
    const filteredList = value.filter((song) =>
      songTags.every((tag) => song.labels.includes(tag))
    );
    if (filteredList.length) {
      acc[key] = filteredList;
    }
    return acc;
  }, {} as SongListBySongType);
};

export const getSonglist = (
  bagpipeType: BagpipeTypes,
  isCyrylic: boolean,
  activeSongTags: SongTags[],
  songList: Song[]
) => {
  const sortedList = sortSongsByBagpipe(songList);
  const lists = sortSongsBySongType(sortedList[bagpipeType]);
  const transliteratedLists = isCyrylic ? lists : transliterateSongList(lists);
  const sortedListsAlphabetically =
    sortListsAlphabetically(transliteratedLists);
  return {
    lists: filterSongsByTags(sortedListsAlphabetically, activeSongTags),
    transliteratedLists,
  };
};
