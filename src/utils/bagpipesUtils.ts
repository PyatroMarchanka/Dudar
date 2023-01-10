import { Midi } from "@tonejs/midi";
import { Modes, SharpNotes, transposeNote } from "../interfaces/index";
import { convertToSharp, getSongNotesFromMidi } from "./midiUtils";

interface BagpipeNotesSteps {
  main: number[];
  entry?: number;
}

export interface BagpipeNotes {
  main: SharpNotes[];
  entry?: SharpNotes;
}

export enum Bagpipes {
  BelarusianDuda = "bel_duda",
  BelarusianTraditionalDuda = "bel_duda_traditional",
  SpanishGaita = "spanish_gaita",
  DeutschDudelsack = "deutsch_dudelsack",
  SwedishSackpipa = "swedish_sackpipa",
}

export interface BagpipeConfig {
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

const getModeFromMidi = (midi: Midi, transpose: number) => {
  const songNotes = getSongNotesFromMidi(midi).map(convertToSharp);

  if (songNotes.includes("C#")) {
    return songNotes.includes("G") ? Modes.Mixolidian : Modes.Ionian;
  }

  if (songNotes.includes("C")) {
    return songNotes.includes("F#") ? Modes.Dorian : Modes.Eolian;
  }

  return Modes.Dorian;
};

export const getBagpipeNotesFromMidi = (
  midi: Midi,
  transpose: number
): SharpNotes[] => {
  const tone = transposeNote("A", transpose);
  const mode = getModeFromMidi(midi, transpose);
  const { main: songNotes } = getBagpipeData(mode, tone);

  return [songNotes[songNotes.length - 1], ...songNotes, songNotes[0]];
};
