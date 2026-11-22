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

export type VersionLevel = 'basic' | 'intermediate' | 'advanced';
export const versionLevels: VersionLevel[] = ['basic', 'intermediate', 'advanced'];

// Another version of a song (by another bagpiper, or another level), with its
// own notes. The song's name, about, lyrics and type are shared.
export interface SongVersion {
  _id: string;
  // e.g. "With ornaments"
  label: string;
  // The bagpiper or arranger
  author?: string;
  level?: VersionLevel;
  pathName: string;
  source?: 'file' | 'melody';
  sourceMelodyId?: string;
  // Left out of the song list; loaded with the song's notes when played
  melody?: SongMelody;
  timeSignature: TimeSignatures;
  originalTempo: number;
  transcribedBy?: string;
  links?: SongLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

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
  // The song's own notes are its default version (shown first, normally the basic one).
  // These describe it; no label means "Basic".
  versionLabel?: string;
  versionAuthor?: string;
  versionLevel?: VersionLevel;
  // The other versions. Absent: the song has only its default version.
  versions?: SongVersion[];
  // Set in the browser only: the version of `versions` whose notes this song object
  // carries (see songWithVersion). Absent: the default version.
  activeVersionId?: string;
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
  Easter = "easter",
  Spring = "spring",
  Wedding = "wedding",
  Kupalle = "kupalle",
  Harvest = "harvest",
  Soldier = "soldier",
  Autumn = "autumn",
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
