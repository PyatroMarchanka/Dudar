import { bagpipesImagesProperties } from "./bagpipesImageProperties";
import { notesMaps } from "./bagpipesNotesMaps";
import { BagpipeConfig, BagpipeTypes } from "../interfaces";
import { holesPositions } from "./bagpipesHolesPositions";
import { bagpipeImages } from "./bagpipeImages";
import { bagpipesNotesToLines } from "./bagpipesNotesToHoles";
import { getLabelByBagpipeType } from "../interfaces/enumUtils";

const bagpipeNames = {
  [BagpipeTypes.BelarusianTraditionalDuda]: getLabelByBagpipeType(
    BagpipeTypes.BelarusianTraditionalDuda
  ),
  [BagpipeTypes.BelarusianNONTraditionalDuda]: getLabelByBagpipeType(
    BagpipeTypes.BelarusianNONTraditionalDuda
  ),
  [BagpipeTypes.BelarusianOpenDuda]: getLabelByBagpipeType(
    BagpipeTypes.BelarusianOpenDuda
  ),
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
