import { Modes } from "../interfaces";
import { BagpipeType, Bagpipes } from "../utils/bagpipesUtils";
console.log("test");

export const bagpipes: BagpipeType[] = [
  {
    mode: Modes.Mixolidian,
    holesCount: 8,
    name: "Belarussian Duda - Mixolidian",
    type: Bagpipes.BelarussianDuda,
  },
  {
    mode: Modes.Dorian,
    holesCount: 8,
    name: "Belarussian Duda - Dorian",
    type: Bagpipes.BelarussianDuda,
  },
  {
    mode: Modes.Eolian,
    holesCount: 8,
    name: "Belarussian Duda - Minor",
    type: Bagpipes.BelarussianDuda,
  },
  {
    mode: Modes.Ionian,
    holesCount: 8,
    name: "Belarussian Duda - Major",
    type: Bagpipes.BelarussianDuda,
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
