export interface Hole {
  note: string;
  isOpen: boolean;
}

export enum Modes {
  Mixolidian = 'mixolidian',
  Ionian = 'ionian',
  Eolian = 'eolian',
  Dorian = 'dorian',
}

export interface BagpipeType {
  mode: Modes;
  tone: Notes;
  holesCount: number;
}

export type Notes =
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B'
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab';

export type SharpNotes = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';
type SharpMap = {
  [key: string]: Notes;
};

export interface BagpipeNotes {
  main: Notes[];
  entry?: Notes;
}

export const convertToSharp = (note: Notes) => {
  const map: SharpMap = {
    Bb: 'A#',
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
  };

  return note in map ? map[note as keyof SharpMap] : note;
};
