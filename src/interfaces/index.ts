import { BagpipesNotesToLines } from "./../dataset/bagpipesNotesToHoles";
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

export type SharpNotes = "A" | "A#" | "B" | "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#";
export type SharpNotesDoReMi =
  | "До"
  | "До#"
  | "Рэ"
  | "Рэ#"
  | "Мі"
  | "Фа"
  | "Фа#"
  | "Соль"
  | "Соль#"
  | "Ля"
  | "Ля#"
  | "Сі";

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
  notesToLines: BagpipesNotesToLines;
  fingersMaps: BagpipeNotesMap;
}

export type BagpipeNotesMap = {
  [key: string]: number[];
};
export interface Hole {
  yPos: number;
  leftMargin: number;
  diameter: number;
  isAdditional?: boolean;
}

export interface BagpipeHolesPositions {
  closable: Hole[];
  blowImage?: Hole;
  linesYPositions: number[];
}

export enum SharpNotesEnum {
  "C3" = "C3",
  "C#3" = "C#3",
  "D3" = "D3",
  "D#3" = "D#3",
  "E3" = "E3",
  "F3" = "F3",
  "F#3" = "F#3",
  "G3" = "G3",
  "G#3" = "G#3",
  "A3" = "A3",
  "A#3" = "A#3",
  "B3" = "B3",
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
  Dudelsack = "ddl",
}

export enum Languages {
  Belarusian = "be",
  English = "en",
  Polish = "pl",
}

export enum HolesModes {
  Holes = "holes",
  Fingers = "fingers",
}
