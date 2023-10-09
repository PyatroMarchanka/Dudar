import { BagpipeNotesMap, BagpipeTypes, SharpNotesEnum } from "../interfaces";

const belarusianTraditionalDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum["E4"]]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum["G4"]]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6, 8, 9],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5, 7, 8, 9],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4, 6, 7, 8, 9],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 6, 7, 8, 9],
  [SharpNotesEnum.D5]: [0, 1, 2, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum.E5]: [0, 1, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum.F5]: [0, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum["F#5"]]: [2, 3, 4, 5, 6, 7, 8, 9],
};

const belarusianNONTraditionalDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4, 5, 6, 8],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 4, 5, 8],
  [SharpNotesEnum.D5]: [0, 1, 2, 3, 4, 6, 7, 8],
  [SharpNotesEnum.E5]: [0, 1, 2, 3, 5, 6, 7, 8],
  [SharpNotesEnum.F5]: [0, 1, 2, 4, 5, 6, 7, 8],
  [SharpNotesEnum["F#5"]]: [0, 1, 4, 5, 6, 7, 8],
  [SharpNotesEnum.G5]: [0, 2, 3, 4, 5, 6, 7, 8],
  [SharpNotesEnum.A5]: [1, 2, 3, 4, 5, 6, 7, 8],
};

const belarusianOpenDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.D5]: [0, 1, 2, 3, 4],
  [SharpNotesEnum.E5]: [0, 1, 2, 3],
  [SharpNotesEnum.F5]: [0, 1, 2],
  [SharpNotesEnum["F#5"]]: [0, 1],
  [SharpNotesEnum.G5]: [0],
  [SharpNotesEnum.A5]: [],
};

const dudelsackNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4],
  [SharpNotesEnum.D5]: [0, 1, 2, 3],
  [SharpNotesEnum.E5]: [0, 1, 2],
  [SharpNotesEnum.F5]: [0, 1],
  [SharpNotesEnum.G5]: [0],
  [SharpNotesEnum.A5]: [],
};

export const notesMaps = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalDudaNotes,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalDudaNotes,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenDudaNotes,
  [BagpipeTypes.Dudelsack]: dudelsackNotes,
};
