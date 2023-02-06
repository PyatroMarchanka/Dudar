import { BagpipeTypes } from "../interfaces";
import { coeff } from "./bagpipesHolesPositions";

export interface BagpipesImagesProperties {
  main_pipe: {
    width: number;
    heigth: number;
    imageScale: number;
    leftMargin: number;
    topMargin: number;
  };
  notes: {
    lineHeight: number;
    brickhHeight: number;
    brickHeightHalf: number;
    notesScale: number;
    brickLeftMargin: number;
  };
}

export const bagpipesImagesProperties: {
  [key: string]: BagpipesImagesProperties;
} = {
  [BagpipeTypes.BelarusianTraditionalDuda]: {
    main_pipe: {
      width: coeff(200),
      heigth: coeff(896),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(-38),
      topMargin: coeff(-27),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: coeff(55),
    },
  },
  [BagpipeTypes.BelarusianNONTraditionalDuda]: {
    main_pipe: {
      width: coeff(200),
      heigth: coeff(896),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(-38),
      topMargin: coeff(-27),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: coeff(55),
    },
  },
  [BagpipeTypes.BelarusianOpenDuda]: {
    main_pipe: {
      width: coeff(200),
      heigth: coeff(896),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(-38),
      topMargin: coeff(-27),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: coeff(55),
    },
  },
  [BagpipeTypes.Dudelsack]: {
    main_pipe: {
      width: coeff(200),
      heigth: coeff(896),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(-38),
      topMargin: coeff(0),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: coeff(55),
    },
  },
};
