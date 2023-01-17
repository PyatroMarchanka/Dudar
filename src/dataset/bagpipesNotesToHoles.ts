import { BagpipeTypes, SharpNotesEnum } from "../interfaces";

export interface BagpipesNotesToHoles {
  [key: string]: number;
}
export const bagpipesNotesToHoles: { [key: string]: BagpipesNotesToHoles } = {
  [BagpipeTypes.BelarusianTraditionalDuda]: {
    [SharpNotesEnum["E4"]]: 10,
    [SharpNotesEnum["G4"]]: 9,
    [SharpNotesEnum["G#4"]]: 8,
    [SharpNotesEnum.A4]: 7,
    [SharpNotesEnum.B4]: 6,
    [SharpNotesEnum.C5]: 5,
    [SharpNotesEnum["C#5"]]: 4,
    [SharpNotesEnum.D5]: 3,
    [SharpNotesEnum.E5]: 2,
    [SharpNotesEnum.F5]: 1,
    [SharpNotesEnum["F#5"]]: 0,
  },
  [BagpipeTypes.BelarusianNONTraditionalDuda]: {
    [SharpNotesEnum.G4]: 10,
    [SharpNotesEnum.A4]: 9,
    [SharpNotesEnum.B4]: 8,
    [SharpNotesEnum.C5]: 7,
    [SharpNotesEnum["C#5"]]: 6,
    [SharpNotesEnum.D5]: 5,
    [SharpNotesEnum.E5]: 4,
    [SharpNotesEnum.F5]: 3,
    [SharpNotesEnum["F#5"]]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
  [BagpipeTypes.BelarusianOpenDuda]: {
    [SharpNotesEnum.G4]: 10,
    [SharpNotesEnum.A4]: 9,
    [SharpNotesEnum.B4]: 8,
    [SharpNotesEnum.C5]: 7,
    [SharpNotesEnum["C#5"]]: 6,
    [SharpNotesEnum.D5]: 5,
    [SharpNotesEnum.E5]: 4,
    [SharpNotesEnum.F5]: 3,
    [SharpNotesEnum["F#5"]]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
};
