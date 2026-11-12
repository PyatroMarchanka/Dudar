import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
  SongTags,
  TimeSignatures,
} from "./interfaces";
import { currentBrand, isFluteBrand } from "../../brand";

export const getFirstSongFromList = (lists: SongListByBagpipe): Song => {
  // On the flute site the first list is usually a bagpipe one, which may not fit the whistle
  const brandSong = isFluteBrand ? lists[currentBrand.defaultInstrument]?.[0] : undefined;
  return brandSong || Object.values(lists)?.[0]?.[0];
};

// An id from the URL can still be percent-encoded: history only runs decodeURI on
// the path, so links that encode "," (like old song pages) arrive as %2C.
export const decodeSongId = (id: string) => {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
};

export const findSongInListById = (
  id: string,
  lists: SongListByBagpipe
): Song | undefined => {
  const allSongs = Object.values(lists).flat();
  const decodedId = decodeSongId(id);

  return allSongs.find((song) => song.id === id || song.id === decodedId);
};

const baseSongId = (id: string) => id.split("-bd").join("");

// A song can exist in several variants (e.g. "<id>" and "<id>-bd" for different
// bagpipes) with the same name, and each bagpipe's list keeps only one of them.
// Finds the variant of `song` that the current lists hold.
export const findSongVariantInList = (
  song: Song,
  lists: SongListByBagpipe
): Song | undefined => {
  const allSongs = Object.values(lists).flat();

  return (
    allSongs.find((other) => baseSongId(other.id) === baseSongId(song.id)) ||
    allSongs.find((other) => other.type === song.type && other.name === song.name)
  );
};

const fourToFourTicks = 480 * 4;

const timeSignaturesToTicks = {
  "3/4": (fourToFourTicks * 3) / 4,
  "4/4": (fourToFourTicks * 4) / 4,
  "5/4": (fourToFourTicks * 5) / 4,
  "6/4": (fourToFourTicks * 6) / 4,
  "6/8": (fourToFourTicks * 6) / 4,
  "7/8": (fourToFourTicks * 7) / 8,
  "5/8": (fourToFourTicks * 5) / 8,
  "8/8": (fourToFourTicks * 8) / 8,
  "9/8": (fourToFourTicks * 9) / 8,
  "10/8": (fourToFourTicks * 10) / 8,
  "11/8": (fourToFourTicks * 11) / 8,
};
export const getTicksPerBeatByTimeSignature = (
  timeSignature: TimeSignatures
): number => {
  return timeSignaturesToTicks[timeSignature];
};

export const isSongInLists = (lists: SongListByBagpipe | null, song: Song) => {
  if (!lists) return false;

  return Object.values(lists).some((songList) =>
    songList.some((songFromList) => songFromList.pathName === song.pathName)
  );
};

export const getAvailableTagsFromLists = (lists: SongListBySongType | null) => {
  if (!lists) return [];

  const map: any = {};

  Object.values(lists).forEach((list) => {
    list.forEach((song) => {
      song.labels.forEach((tag) => {
        if (!(tag in map)) {
          map[tag] = tag;
        }
      });
    });
  });

  return Object.keys(map) as SongTags[];
};
