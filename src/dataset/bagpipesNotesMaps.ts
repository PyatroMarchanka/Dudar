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

const polishDudaNotes: BagpipeNotesMap = {
  [SharpNotesEnum["E4"]]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum["G#4"]]: [0, 1, 2, 3, 4, 5],
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 6],
  [SharpNotesEnum.B4]: [0, 1, 2, 3, 5, 6],
  [SharpNotesEnum["C#5"]]: [0, 1, 2, 4, 5, 6],
  [SharpNotesEnum.D5]: [0, 1, 2, 3, 4, 5, 6],
  [SharpNotesEnum.E5]: [0, 1, 3, 4, 5, 6],
  [SharpNotesEnum["F#5"]]: [1, 2, 3, 4, 5, 6],
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

// The catalog tunes are in A, so the whistle is treated as an A whistle: A4 is played
// with all holes covered. Transpose only shifts the sound and the note names, so
// transposing to D keeps this fingering and sounds like a D whistle.
// Written an octave below sounding pitch. Holes are numbered from the mouthpiece
// down; listed holes are covered. The second octave uses the same fingering and is
// overblown (the upper tonic is usually played with the top hole open).
// Chromatic notes use cross fingerings. Notes that are really half-holed (A#: the
// lowest hole half covered) are shown with that hole open.
const tinWhistleOctave = (octave: 4 | 5) => {
  const next = octave + 1;
  return {
    [`A#${octave}`]: [0, 1, 2, 3, 4],
    [`B${octave}`]: [0, 1, 2, 3, 4],
    [`C${next}`]: [0, 1, 2, 4, 5],
    [`C#${next}`]: [0, 1, 2, 3],
    [`D${next}`]: [0, 1, 2],
    [`D#${next}`]: [0, 1, 4],
    [`E${next}`]: [0, 1],
    [`F${next}`]: [0, 2, 3, 4],
    [`F#${next}`]: [0],
  };
};

const tinWhistleNotes: BagpipeNotesMap = {
  [SharpNotesEnum.A4]: [0, 1, 2, 3, 4, 5],
  ...tinWhistleOctave(4),
  [SharpNotesEnum.G5]: [1, 2],
  [SharpNotesEnum["G#5"]]: [],
  // Second octave
  [SharpNotesEnum.A5]: [1, 2, 3, 4, 5],
  ...tinWhistleOctave(5),
  [SharpNotesEnum.G6]: [1],
  [SharpNotesEnum["G#6"]]: [],
  // Top of the third octave, blown hard
  [SharpNotesEnum.A6]: [1, 2, 3, 4, 5],
};

// Everything from the upper tonic (A5) up is overblown
const tinWhistleOverblownNotes = Object.keys(tinWhistleNotes).filter(
  (note) => note.endsWith("6") || ["A5", "A#5", "B5"].includes(note)
);

export const overblownNotes: { [key: string]: string[] } = {
  [BagpipeTypes.TinWhistle]: tinWhistleOverblownNotes,
};

export const notesMaps = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalDudaNotes,
  [BagpipeTypes.BelarusianNONTraditionalDuda]:
    belarusianNONTraditionalDudaNotes,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenDudaNotes,
  [BagpipeTypes.Polish]: polishDudaNotes,
  [BagpipeTypes.Dudelsack]: dudelsackNotes,
  [BagpipeTypes.Highlander]: highlanderNotes,
  [BagpipeTypes.TinWhistle]: tinWhistleNotes,
};
