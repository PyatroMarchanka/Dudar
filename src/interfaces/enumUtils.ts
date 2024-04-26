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

    case SongTypes.Polish:
      return "Polish";

    case SongTypes.Balkan:
      return "Balkan";

    default:
      break;
  }
};

export const getTranslationKeyByBagpipeType = (type: BagpipeTypes) => {
  switch (type) {
    case BagpipeTypes.BelarusianNONTraditionalDuda:
      return "belNonTradDuda";

    case BagpipeTypes.BelarusianOpenDuda:
      return "belOpenDuda";

    case BagpipeTypes.BelarusianTraditionalDuda:
      return "belTradDuda";

    case BagpipeTypes.Dudelsack:
      return "dudelsack";

    case BagpipeTypes.Highlander:
      return "highlander";

    default:
      return "unknownBagpipe";
  }
};
