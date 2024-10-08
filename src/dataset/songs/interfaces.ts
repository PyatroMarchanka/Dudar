import { BagpipeTypes } from "../../interfaces";

export enum SongTypes {
  Belarusian = "belarusian",
  Medieval = "medieval",
  Irish = "irish",
  Schotland = "schotland",
  Scandinavian = "scandinavian",
  Balkan = "balkan",
  Polish = "polish",
  Other = "other",
}

export type TimeSignatures =
  | "3/4"
  | "4/4"
  | "5/4"
  | "6/4"
  | "6/8"
  | "7/8"
  | "8/8"
  | "9/8"
  | "10/8"
  | "11/8";

export interface Song {
  name: string;
  type: string;
  bagpipesToPlay: BagpipeTypes[];
  timeSignature: TimeSignatures;
  pathName: string;
  labels: string[]
  id: string;
  midiBy?: string;
  lyric?: string;
  about?: string;
  originalTempo?: number;
}

export type SongListByBagpipe = { [key: string]: Song[] };

export type SongList = Song[];

export type SongListBySongType = { [key: string]: Song[] };

export enum SongTags {
  Song = "song",
  Dance = "dance",
  Kaliady = "kaliady",
}
