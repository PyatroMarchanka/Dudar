import { BagpipeTypes } from "../../interfaces";
import { MelodyRoll } from "../../utils/midiUtils/melodyRoll";

// The notes of a catalog song made from a user's melody, copied when an admin approved it
export interface SongMelody {
  format: "abc" | "roll";
  abc?: string;
  roll?: MelodyRoll;
}

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
  // "melody": approved from a user's melody and played from `melody`, with no .mid file
  // (its pathName is only a unique placeholder). Absent: a file in public/midi.
  source?: "file" | "melody";
  sourceMelodyId?: string;
  melody?: SongMelody;
  stats: IStats,
  createdAt?: Date,
  updatedAt?: Date,
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
  songsIds: string[];
  userId?: string;
  _id?: string;
}

export interface PlaylistSong {
  _id?: string;
  name: string;
  tags: string[];
}

export interface PlaylistTags {
  userId: string;
  tags: string[];
}
