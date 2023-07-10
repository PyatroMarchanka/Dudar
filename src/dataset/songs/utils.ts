import { BagpipeTypes } from "../../interfaces";
import { Song, SongListByBagpipe } from "./interfaces";

export const getFirstSongFromList = (lists: SongListByBagpipe, bagpipeType: BagpipeTypes): Song => {
  return lists[bagpipeType][0];
};
