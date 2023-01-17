import { BagpipesNotesToHoles } from "./../dataset/bagpipesNotesToHoles";
import { BagpipeImages } from "../dataset/bagpipeImages";
import { BagpipesImagesProperties } from "../dataset/bagpipesImageProperties";

export enum Modes {
  Mixolidian = "mixolidian",
  Ionian = "ionian",
  Eolian = "eolian",
  Dorian = "dorian",
}

export type Notes =
  | "A"
  | "A#"
  | "Bb"
  | "B"
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab";

export type SharpNotes =
  | "A"
  | "A#"
  | "B"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#";

export type SharpMap = {
  [key: string]: Notes;
};

export interface BagpipeNotesSteps {
  main: number[];
  entry?: number;
}

export interface BagpipeNotes {
  main: SharpNotes[];
  entry?: SharpNotes;
}

// ============= NEW CONFIG ===================
export interface BagpipeConfig {
  type: BagpipeTypes;
  name: string;
  notesMap: BagpipeNotesMap;
  holesPositions: BagpipeHolesPositions;
  imagesProperties: BagpipesImagesProperties;
  images: BagpipeImages;
  notesToHoles: BagpipesNotesToHoles;
}

export type BagpipeNotesMap = {
  [key: string]: number[];
};
export interface Hole {
  yPos: number;
  leftMargin: number;
  diameter: number;
}

export interface BagpipeHolesPositions {
  closable: Hole[];
  blowImage?: Hole;
}

export enum SharpNotesEnum {
  "C4" = "C4",
  "C#4" = "C#4",
  "D4" = "D4",
  "D#4" = "D#4",
  "E4" = "E4",
  "F4" = "F4",
  "F#4" = "F#4",
  "G4" = "G4",
  "G#4" = "G#4",
  "A4" = "A4",
  "A#4" = "A#4",
  "B4" = "B4",
  "C5" = "C5",
  "C#5" = "C#5",
  "D5" = "D5",
  "D#5" = "D#5",
  "E5" = "E5",
  "F5" = "F5",
  "F#5" = "F#5",
  "G5" = "G5",
  "G#5" = "G#5",
  "A5" = "A5",
  "A#5" = "A#5",
  "B5" = "B5",
}

export enum BagpipeTypes {
  BelarusianTraditionalDuda = "bd",
  BelarusianNONTraditionalDuda = "bnd",
  BelarusianOpenDuda = "bod",
}
