import { BagpipeTypes } from "../../interfaces";

export enum SongTypes {
  Belarusian = "belarusian",
  Medieval = "medieval",
  Irish = "irish",
  Schotland = "schotland",
}

export type TimeSignatures = "4/4" | "3/4" | "6/8" | "8/8" | "6/4";

export interface Song {
  name: string;
  type: SongTypes;
  bagpipesToPlay: BagpipeTypes[];
  timeSignature: TimeSignatures;
  pathName: string;
}

export type SongListByBagpipe = { [key: string]: Song[] };

export type SongList = Song[];

export type SongListBySongType = { [key: string]: Song[] };
