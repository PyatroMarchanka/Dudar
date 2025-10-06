import { fingersMaps } from "./bagpipesFingersMaps";
import { bagpipesImagesProperties } from "./bagpipesImageProperties";
import { notesMaps } from "./bagpipesNotesMaps";
import { BagpipeConfig, BagpipeTypes } from "../interfaces";
import { holesPositions } from "./bagpipesHolesPositions";
import { bagpipeImages } from "./bagpipeImages";
import { bagpipesNotesToLines } from "./bagpipesNotesToHoles";
import { getTranslationKeyByBagpipeType } from "../interfaces/enumUtils";

const bagpipeNames = {
  [BagpipeTypes.BelarusianTraditionalDuda]: getTranslationKeyByBagpipeType(
    BagpipeTypes.BelarusianTraditionalDuda
  ),
  [BagpipeTypes.Polish]: getTranslationKeyByBagpipeType(BagpipeTypes.Polish),
  [BagpipeTypes.BelarusianNONTraditionalDuda]: getTranslationKeyByBagpipeType(
    BagpipeTypes.BelarusianNONTraditionalDuda
  ),
  [BagpipeTypes.BelarusianOpenDuda]: getTranslationKeyByBagpipeType(
    BagpipeTypes.BelarusianOpenDuda
  ),
  [BagpipeTypes.Dudelsack]: getTranslationKeyByBagpipeType(BagpipeTypes.Dudelsack),
  [BagpipeTypes.Highlander]: getTranslationKeyByBagpipeType(BagpipeTypes.Highlander),
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
    fingersMaps: fingersMaps[bagpipeType],
  };
};

export const bagpipes: { [key: string]: BagpipeConfig } = {
  [BagpipeTypes.BelarusianTraditionalDuda]: getBagpipeData(BagpipeTypes.BelarusianTraditionalDuda),
  [BagpipeTypes.BelarusianNONTraditionalDuda]: getBagpipeData(
    BagpipeTypes.BelarusianNONTraditionalDuda
  ),
  [BagpipeTypes.Polish]: getBagpipeData(BagpipeTypes.Polish),
  [BagpipeTypes.BelarusianOpenDuda]: getBagpipeData(BagpipeTypes.BelarusianOpenDuda),
  [BagpipeTypes.Dudelsack]: getBagpipeData(BagpipeTypes.Dudelsack),
  [BagpipeTypes.Highlander]: getBagpipeData(BagpipeTypes.Highlander),
};
