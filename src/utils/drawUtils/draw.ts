import { BagpipeTypes } from "../../interfaces";
import { getDrawData } from "./getDrawData";

export const drawBagpipe = (bagpipeType: BagpipeTypes) => {
  const { holesYPositions, holesYPositionsReversed, image } =
    getDrawData(bagpipeType);
};
