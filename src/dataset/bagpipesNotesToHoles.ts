import { BagpipeTypes, SharpNotesEnum } from "../interfaces";

export interface BagpipesNotesToLines {
  [key: string]: number;
}
export const bagpipesNotesToLines: { [key: string]: BagpipesNotesToLines } = {
  [BagpipeTypes.BelarusianTraditionalDuda]: {
    [SharpNotesEnum["E4"]]: 7,
    [SharpNotesEnum["G4"]]: 6,
    [SharpNotesEnum["G#4"]]: 6,
    [SharpNotesEnum.A4]: 5,
    [SharpNotesEnum.B4]: 4,
    [SharpNotesEnum.C5]: 3,
    [SharpNotesEnum["C#5"]]: 3,
    [SharpNotesEnum.D5]: 2,
    [SharpNotesEnum.E5]: 1,
    [SharpNotesEnum.F5]: 0,
    [SharpNotesEnum["F#5"]]: 0,
  },
  [BagpipeTypes.BelarusianNONTraditionalDuda]: {
    [SharpNotesEnum.G4]: 8,
    [SharpNotesEnum.A4]: 7,
    [SharpNotesEnum.B4]: 6,
    [SharpNotesEnum.C5]: 5,
    [SharpNotesEnum["C#5"]]: 5,
    [SharpNotesEnum.D5]: 4,
    [SharpNotesEnum.E5]: 3,
    [SharpNotesEnum.F5]: 2,
    [SharpNotesEnum["F#5"]]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
  [BagpipeTypes.BelarusianOpenDuda]: {
    [SharpNotesEnum.G4]: 8,
    [SharpNotesEnum.A4]: 7,
    [SharpNotesEnum.B4]: 6,
    [SharpNotesEnum.C5]: 5,
    [SharpNotesEnum["C#5"]]: 5,
    [SharpNotesEnum.D5]: 4,
    [SharpNotesEnum.E5]: 3,
    [SharpNotesEnum.F5]: 2,
    [SharpNotesEnum["F#5"]]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
};
