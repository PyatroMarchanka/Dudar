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
    notesNamesLeftMargin: number;
    noteNameColor: string;
  };
  bg?: {
    width: number;
    heigth: number;
    imageScale: number;
    leftMargin: number;
    topMargin: number;
  };
}

export const bagpipesImagesProperties: {
  [key: string]: BagpipesImagesProperties;
} = {
  [BagpipeTypes.BelarusianTraditionalDuda]: {
    main_pipe: {
      width: coeff(400),
      heigth: coeff(900),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(0),
      topMargin: coeff(-27),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: coeff(55),
      notesNamesLeftMargin: coeff(40),
      noteNameColor: "#fff",
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
      notesNamesLeftMargin: coeff(5),
      noteNameColor: "#000",
    },
    bg: {
      width: coeff(454),
      heigth: coeff(454) / (414 / 896),
      leftMargin: 100,
      topMargin: 100,
      imageScale: 414 / 896,
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
      notesNamesLeftMargin: coeff(5),
      noteNameColor: "#000",
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
      notesNamesLeftMargin: coeff(40),
      noteNameColor: "#000",
    },
  },
};
