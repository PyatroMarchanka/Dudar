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
  _id?: string;
  name: string;
  type: string;
  bagpipesToPlay: BagpipeTypes[];
  timeSignature: TimeSignatures;
  pathName: string;
  labels: string[]
  id: string;
  about?: string;
  originalTempo?: number;
  links: SongLink[];
  transcribedBy?: string;
  lyrycs?: string;
  stats: IStats
}


export interface IStats {
  views: number;
  likes: number;
  lastViewed: Date;
}


export interface SongLink {
  type: LinkTypes;
  name: string;
  url: string;
}

export enum LinkTypes {
  Audio = "Audio",
  Video = "Video",
  Other = "Other",
}

export type SongListByBagpipe = { [key: string]: Song[] };

export type SongList = Song[];

export type SongListBySongType = { [key: string]: Song[] };

export enum SongTags {
  Song = "song",
  Dance = "dance",
  Kaliady = "kaliady",
}

export interface IPlaylist {
  name: string;
  songs: PlaylistSong[];
  userId: string;
}

export interface PlaylistSong {
  name: string;
  tags: string[];
}

export interface PlaylistTags {
  userId: string;
  tags: string[];
}
