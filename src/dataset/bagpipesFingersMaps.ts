import { BagpipeNotesMap, BagpipeTypes, SharpNotesEnum } from "../interfaces";

const belarusianTraditionalDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum["E4"]]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum["G4"]]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 5, 6],
  [SharpNotesEnum.C5]: [0, 1, 2, 4, 5, 6],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 4, 5, 6],
  [SharpNotesEnum.D5]: [0, 1, 3, 4, 5, 6],
  [SharpNotesEnum.E5]: [0, 2, 3, 4, 5, 6],
  [SharpNotesEnum.F5]: [1, 2, 3, 4, 5, 6],
  [SharpNotesEnum["F#5"]]: [1, 2, 3, 4, 5, 6],
};

const polishDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum["E4"]]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 5, 6],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 4, 5, 6],
  [SharpNotesEnum.D5]: [0, 1, 3, 4, 5, 6],
  [SharpNotesEnum.E5]: [0, 2, 3, 4, 5, 6],
  [SharpNotesEnum["F#5"]]: [1, 2, 3, 4, 5, 6],
};

const belarusianNONTraditionalDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4, 6],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 4, 6],
  [SharpNotesEnum.D5]: [0, 1, 2, 3, 5, 6],
  [SharpNotesEnum.E5]: [0, 1, 2, 4, 5, 6],
  [SharpNotesEnum.F5]: [0, 1, 3, 4, 5, 6],
  [SharpNotesEnum["F#5"]]: [0, 1, 3, 4, 5, 6],
  [SharpNotesEnum.G5]: [0, 2, 3, 4, 5, 6],
  [SharpNotesEnum.A5]: [1, 2, 3, 4, 5, 6],
};

const belarusianOpenDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.C5]: [0, 1, 2, 3, 4],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 4],
  [SharpNotesEnum.D5]: [0, 1, 2, 3],
  [SharpNotesEnum.E5]: [0, 1, 2],
  [SharpNotesEnum.F5]: [0, 1],
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

const highlanderNotes: BagpipeNotesMap = {
  [SharpNotesEnum.G4]: [0, 1, 2, 3, 4, 5, 6, 7],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 3, 4],
  [SharpNotesEnum.D5]: [0, 1, 2, 3],
  [SharpNotesEnum.E5]: [0, 1, 2],
  [SharpNotesEnum["F#5"]]: [0, 1],
  [SharpNotesEnum.G5]: [0],
  [SharpNotesEnum.A5]: [],
};

export const fingersMaps = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalDudaNotes,
  [BagpipeTypes.BelarusianNONTraditionalDuda]:
    belarusianNONTraditionalDudaNotes,
  [BagpipeTypes.Polish]: polishDudaNotes,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenDudaNotes,
  [BagpipeTypes.Dudelsack]: dudelsackNotes,
  [BagpipeTypes.Highlander]: highlanderNotes,
};
