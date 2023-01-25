import { BagpipeTypes } from ".";
import { SongTypes } from "../dataset/songs/interfaces";

export const getLabelBySongType = (type: SongTypes) => {
  switch (type) {
    case SongTypes.Belarusian:
      return "Belarusian";

    case SongTypes.Irish:
      return "Irish";

    case SongTypes.Medieval:
      return "Medieval";

    case SongTypes.Schotland:
      return "Schotland";

    default:
      break;
  }
};

export const getLabelByBagpipeType = (type: BagpipeTypes) => {
  switch (type) {
    case BagpipeTypes.BelarusianNONTraditionalDuda:
      return "Belarusian Duda - Nontraditional fingers";

    case BagpipeTypes.BelarusianOpenDuda:
      return "Belarusian Duda - Open fingers";

    case BagpipeTypes.BelarusianTraditionalDuda:
      return "Belarusian Duda - Traditional Fingers";

    default:
      return "Belarusian Duda - Traditional fingers";
  }
};
