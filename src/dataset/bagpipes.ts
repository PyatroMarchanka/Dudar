import { bagpipesImagesProperties } from "./bagpipesImageProperties";
import { notesMaps } from "./bagpipesNotesMaps";
import { BagpipeConfig, BagpipeTypes } from "../interfaces";
import { holesPositions } from "./bagpipesHolesPositions";
import { bagpipeImages } from "./bagpipeImages";
import { bagpipesNotesToLines } from "./bagpipesNotesToHoles";

const bagpipeNames = {
  [BagpipeTypes.BelarusianTraditionalDuda]:
    "Belarusian Duda - Traditional Fingers",
  [BagpipeTypes.BelarusianNONTraditionalDuda]:
    "Belarusian Duda - Nontraditional fingers",
  [BagpipeTypes.BelarusianOpenDuda]: "Belarusian Duda - Open fingers",
};

const getBagpipeData = (bagpipeType: BagpipeTypes): BagpipeConfig => {
  return {
    name: bagpipeNames[bagpipeType],
    type: bagpipeType,
    notesMap: notesMaps[bagpipeType],
    holesPositions: holesPositions[bagpipeType],
    imagesProperties: bagpipesImagesProperties[bagpipeType],
    images: bagpipeImages[bagpipeType],
    notesToLines: bagpipesNotesToLines[bagpipeType],
  };
};

export const bagpipes: { [key: string]: BagpipeConfig } = {
  [BagpipeTypes.BelarusianTraditionalDuda]: getBagpipeData(
    BagpipeTypes.BelarusianTraditionalDuda
  ),
  [BagpipeTypes.BelarusianNONTraditionalDuda]: getBagpipeData(
    BagpipeTypes.BelarusianNONTraditionalDuda
  ),
  [BagpipeTypes.BelarusianOpenDuda]: getBagpipeData(
    BagpipeTypes.BelarusianOpenDuda
  ),
};
