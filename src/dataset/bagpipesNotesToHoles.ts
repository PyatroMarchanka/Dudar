import { BagpipeTypes, SharpNotesEnum } from "../interfaces";

export interface BagpipesNotesToLines {
  [key: string]: number;
}

const tinWhistleOctaveLines = (octave: 4 | 5): BagpipesNotesToLines => {
  const next = octave + 1;
  return {
    [`A${octave}`]: 6,
    [`A#${octave}`]: 5,
    [`B${octave}`]: 5,
    [`C${next}`]: 4,
    [`C#${next}`]: 4,
    [`D${next}`]: 3,
    [`D#${next}`]: 2,
    [`E${next}`]: 2,
    [`F${next}`]: 1,
    [`F#${next}`]: 1,
    [`G${next}`]: 0,
    [`G#${next}`]: 0,
  };
};

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
  [BagpipeTypes.Polish]: {
    [SharpNotesEnum["E4"]]: 7,
    [SharpNotesEnum["G#4"]]: 6,
    [SharpNotesEnum.A4]: 5,
    [SharpNotesEnum.B4]: 4,
    [SharpNotesEnum["C#5"]]: 3,
    [SharpNotesEnum.D5]: 2,
    [SharpNotesEnum.E5]: 1,
    [SharpNotesEnum["F#5"]]: 0,
  },
  [BagpipeTypes.BelarusianNONTraditionalDuda]: {
    [SharpNotesEnum.G4]: 8,
    [SharpNotesEnum["G#4"]]: 8,
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
    [SharpNotesEnum["G#4"]]: 8,
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
  [BagpipeTypes.Dudelsack]: {
    [SharpNotesEnum.G4]: 8,
    [SharpNotesEnum.A4]: 7,
    [SharpNotesEnum.B4]: 6,
    [SharpNotesEnum.C5]: 5,
    [SharpNotesEnum.D5]: 4,
    [SharpNotesEnum.E5]: 3,
    [SharpNotesEnum.F5]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
  [BagpipeTypes.Highlander]: {
    [SharpNotesEnum.G4]: 8,
    [SharpNotesEnum.A4]: 7,
    [SharpNotesEnum.B4]: 6,
    [SharpNotesEnum['C#5']]: 5,
    [SharpNotesEnum.D5]: 4,
    [SharpNotesEnum.E5]: 3,
    [SharpNotesEnum['F#5']]: 2,
    [SharpNotesEnum.G5]: 1,
    [SharpNotesEnum.A5]: 0,
  },
  // Line 0 is "all holes open", line N is the lowest covered hole N-1.
  // All octaves share the same lines; a chromatic note shares the line of the
  // scale note above it.
  [BagpipeTypes.TinWhistle]: {
    ...tinWhistleOctaveLines(4),
    ...tinWhistleOctaveLines(5),
    [SharpNotesEnum.A6]: 6,
  },
};
