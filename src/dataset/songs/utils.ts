import { BagpipeTypes } from "../../interfaces";
import { Song, SongListByBagpipe, TimeSignatures } from "./interfaces";

export const getFirstSongFromList = (lists: SongListByBagpipe, bagpipeType: BagpipeTypes): Song => {
  return lists[bagpipeType][0];
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
