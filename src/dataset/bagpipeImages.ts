import { BagpipeTypes } from "../interfaces";

export interface BagpipeImageSet {
  mainPipe?: string;
  activeHoleImage?: string;
  backActiveHoleImage?: string;
  closedHoleImage?: string;
  backClosedHoleImage?: string;
  blowImage?: string;
  bgImage?: string;
}

export interface BagpipeImages {
  mainPipe?: HTMLImageElement;
  activeHoleImage?: HTMLImageElement;
  backActiveHoleImage?: HTMLImageElement;
  closedHoleImage?: HTMLImageElement;
  backClosedHoleImage?: HTMLImageElement;
  blowImage?: HTMLImageElement;
  bgImage?: HTMLImageElement;
}

const getNewImageSet = (set: BagpipeImageSet): BagpipeImages => {
  const images = Object.keys(set).reduce((acc: any, key: string) => {
    acc[key] = new Image();
    acc[key].src = (set as any)[key];

    return acc;
  }, {});

  return images;
};

const srcs = {
  [BagpipeTypes.BelarusianTraditionalDuda]: {
    mainPipe: "/images/bel_duda_side_color.png",
    activeHoleImage: "/images/piston_open.svg",
    backActiveHoleImage: "/images/piston_back_open.svg",
    closedHoleImage: "/images/piston_closed.svg",
    backClosedHoleImage: "/images/piston_back_closed.svg",
    blowImage: "/images/blow.svg",
  },
  [BagpipeTypes.BelarusianNONTraditionalDuda]: {
    mainPipe: "/images/bel_duda_side_color_eight_holes.png",
    activeHoleImage: "/images/piston_open.svg",
    backActiveHoleImage: "/images/piston_back_open.svg",
    closedHoleImage: "/images/piston_closed.svg",
    backClosedHoleImage: "/images/piston_back_closed.svg",
    blowImage: "/images/blow.svg",
    bgImage: "/images/BG.png",
  },
  [BagpipeTypes.BelarusianOpenDuda]: {
    mainPipe: "/images/bel_duda_side_color_eight_holes.png",
    activeHoleImage: "/images/piston_open.svg",
    backActiveHoleImage: "/images/piston_back_open.svg",
    closedHoleImage: "/images/piston_closed.svg",
    backClosedHoleImage: "/images/piston_back_closed.svg",
    blowImage: "/images/blow.svg",
    bgImage: "/images/BG.png",
  },
  [BagpipeTypes.Dudelsack]: {
    mainPipe: "/images/dudelsack.png",
    activeHoleImage: "/images/piston_open.svg",
    backActiveHoleImage: "/images/piston_back_open.svg",
    closedHoleImage: "/images/piston_closed.svg",
    backClosedHoleImage: "/images/piston_back_closed.svg",
    blowImage: "/images/blow.svg",
  },
};

const getBagpipeImages = (bagpipeType: BagpipeTypes) => {
  return getNewImageSet(srcs[bagpipeType]);
};

export const bagpipeImages = {
  [BagpipeTypes.BelarusianTraditionalDuda]: getBagpipeImages(
    BagpipeTypes.BelarusianTraditionalDuda
  ),
  [BagpipeTypes.BelarusianNONTraditionalDuda]: getBagpipeImages(
    BagpipeTypes.BelarusianNONTraditionalDuda
  ),
  [BagpipeTypes.BelarusianOpenDuda]: getBagpipeImages(
    BagpipeTypes.BelarusianOpenDuda
  ),
  [BagpipeTypes.Dudelsack]: getBagpipeImages(BagpipeTypes.Dudelsack),
};
