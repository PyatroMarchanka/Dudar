import { Modes } from "../interfaces";
import { BagpipeConfig, Bagpipes } from "../utils/bagpipesUtils";

export const bagpipes: BagpipeConfig[] = [
  {
    mode: Modes.Mixolidian,
    holesCount: 8,
    name: "Belarusian Duda - Mixolidian",
    type: Bagpipes.BelarusianDuda,
  },
  {
    mode: Modes.Dorian,
    holesCount: 8,
    name: "Belarusian Duda - Dorian",
    type: Bagpipes.BelarusianDuda,
  },
  {
    mode: Modes.Eolian,
    holesCount: 8,
    name: "Belarusian Duda - Minor",
    type: Bagpipes.BelarusianDuda,
  },
  {
    mode: Modes.Ionian,
    holesCount: 8,
    name: "Belarusian Duda - Major",
    type: Bagpipes.BelarusianDuda,
  },
  {
    mode: Modes.Ionian,
    holesCount: 8,
    name: "Spanish Gaita",
    type: Bagpipes.SpanishGaita,
  },
  {
    mode: Modes.Eolian,
    holesCount: 8,
    name: "Deutsch Dudelsack",
    type: Bagpipes.DeutschDudelsack,
  },
];
