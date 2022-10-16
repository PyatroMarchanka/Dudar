import { Modes, SharpNotes, transposeNote } from "../interfaces/index";

interface BagpipeNotesSteps {
  main: number[];
  entry?: number;
}

export interface BagpipeNotes {
  main: SharpNotes[];
  entry?: SharpNotes;
}

export enum Bagpipes {
  BelarussianDuda = "bel_duda",
  SpanishGaita = "spanish_gaita",
  DeutschDudelsack = "deutsch_dudelsack",
}

export interface BagpipeType {
  type: Bagpipes;
  name: string;
  mode: Modes;
  holesCount: number;
}

const getBagpipeNotesSteps = (mode: Modes): BagpipeNotesSteps => {
  switch (mode) {
    case Modes.Mixolidian:
      return {
        main: [2, 2, 1, 2, 2, 1, 2],
        entry: 2,
      };
    case Modes.Dorian:
      return {
        main: [2, 1, 2, 2, 2, 1, 2],
        entry: 2,
      };

    case Modes.Ionian:
      return {
        main: [2, 2, 1, 2, 2, 2, 1],
        entry: 1,
      };
    case Modes.Eolian:
      return {
        main: [2, 1, 2, 2, 1, 2, 2],
        entry: 2,
      };

    default:
      return {
        main: [2, 2, 1, 2, 2, 1, 2],
        entry: 2,
      };
  }
};

const getBagpipeNotes = (
  tone: SharpNotes,
  steps: BagpipeNotesSteps
): BagpipeNotes => {
  let currentStep = 0;
  const resultNotes = steps.main.map((step) => {
    let note: SharpNotes;

    note = transposeNote(tone, currentStep);
    currentStep += step;
    return note;
  });

  return {
    main: resultNotes,
    entry: steps.entry ? transposeNote(tone, 12 - steps.entry) : undefined,
  };
};

export const getBagpipeData = (mode: Modes, tone: SharpNotes): BagpipeNotes => {
  const steps = getBagpipeNotesSteps(mode);
  const notes = getBagpipeNotes(tone, steps);
  return notes;
};
