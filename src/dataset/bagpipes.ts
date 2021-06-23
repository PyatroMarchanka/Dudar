import { BagpipeType, Modes, Notes, BagpipeNotes } from './../interfaces/index';

export const BelarusianDudaMixolidian: BagpipeType = {
  mode: Modes.Mixolidian,
  tone: 'A',
  holesCount: 8,
};

export const BelarusianDudaDorian: BagpipeType = {
  mode: Modes.Dorian,
  tone: 'A',
  holesCount: 8,
};

interface BagpipeNotesSteps {
  main: number[];
  entry?: number;
}

const getBagpipeNotesSteps = (mode: Modes) => {
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

// const getBagpipeNotes = (tone: Notes, steps: BagpipeNotesSteps) => {

//     const result: BagpipeNotes = {
//         main: [],
//         entry: undefined
//     }

//     steps.main.forEach(step => {
//         result.main.push()
//     })
// };
