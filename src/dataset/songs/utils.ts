import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
  SongTags,
  TimeSignatures,
} from "./interfaces";

export const getFirstSongFromList = (lists: SongListByBagpipe): Song => {
  return Object.values(lists)?.[0]?.[0];
};

const fourToFourTicks = 480;

const timeSignaturesToTicks = {
  "3/4": (fourToFourTicks * 3) / 2,
  "4/4": (fourToFourTicks * 4) / 4,
  "5/4": (fourToFourTicks * 5) / 4,
  "6/4": (fourToFourTicks * 6) / 4,
  "6/8": (fourToFourTicks * 6) / 4,
  "7/8": (fourToFourTicks * 7) / 8,
  "8/8": (fourToFourTicks * 8) / 8,
  "9/8": (fourToFourTicks * 9) / 8,
  "10/8": (fourToFourTicks * 10) / 8,
  "11/8": (fourToFourTicks * 11) / 8,
};
export const getTicksPerBeatByTimeSignature = (timeSignature: TimeSignatures): number => {
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
