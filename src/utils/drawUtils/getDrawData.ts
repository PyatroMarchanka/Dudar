import { BagpipeTypes } from "../../interfaces";

const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: [
    640, 554, 508, 452, 396, 298, 242, 186, 130,
  ],
  [BagpipeTypes.BelarusianNONTraditionalDuda]: [
    640, 554, 508, 452, 396, 298, 242, 186, 130,
  ],
  [BagpipeTypes.BelarusianOpenDuda]: [
    640, 554, 508, 452, 396, 298, 242, 186, 130,
  ],
};

const getHolesYPositions = (bagpipeType: BagpipeTypes) => {
  return holesPositions[bagpipeType];
};

const getBagpipeImage = (bagpipeType: BagpipeTypes) => {
  const images = {
    [BagpipeTypes.BelarusianTraditionalDuda]: "/images/main_pipe.png",
    [BagpipeTypes.BelarusianNONTraditionalDuda]: "/images/main_pipe.png",
    [BagpipeTypes.BelarusianOpenDuda]: "/images/main_pipe.png",
  };

  return images[bagpipeType];
};

export const getDrawData = (bagpipeType: BagpipeTypes) => {
  const holesYPositions = getHolesYPositions(bagpipeType);
  const holesYPositionsReversed = holesYPositions.reverse();
  const image = getBagpipeImage(bagpipeType);

  return {
    holesYPositions,
    holesYPositionsReversed,
    image,
  };
};
