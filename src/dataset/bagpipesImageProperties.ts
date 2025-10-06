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

const belarusianDudaImageProperties = {
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
    brickLeftMargin: coeff(90),
    notesNamesLeftMargin: coeff(40),
    noteNameColor: "#fff",
  },
  bg: {
    width: coeff(552),
    heigth: coeff(1000),
    imageScale: coeff(412) / coeff(800),
    leftMargin: coeff(-40),
    topMargin: coeff(0),
  },
};

export const bagpipesImagesProperties: {
  [key: string]: BagpipesImagesProperties;
} = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianDudaImageProperties,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianDudaImageProperties,
  [BagpipeTypes.BelarusianOpenDuda]: {
    ...belarusianDudaImageProperties,
    main_pipe: { ...belarusianDudaImageProperties.main_pipe, topMargin: 20 },
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
      notesNamesLeftMargin: coeff(5),
      noteNameColor: "#000",
    },
    bg: {
      width: coeff(552),
      heigth: coeff(1000),
      imageScale: coeff(412) / coeff(800),
      leftMargin: coeff(-40),
      topMargin: coeff(0),
    },
  },
  [BagpipeTypes.Highlander]: {
    main_pipe: {
      width: coeff(270),
      heigth: coeff(800),
      imageScale: coeff(200) / coeff(896),
      leftMargin: coeff(-85),
      topMargin: coeff(0),
    },
    bg: {
      width: coeff(400),
      heigth: coeff(800),
      imageScale: coeff(412) / coeff(800),
      leftMargin: coeff(75),
      topMargin: coeff(100),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: 45,
      notesNamesLeftMargin: coeff(5),
      noteNameColor: "#000",
    },
  },
  [BagpipeTypes.Polish]: {
    main_pipe: {
      width: coeff(600),
      heigth: coeff(1125),
      imageScale: coeff(400) / coeff(750),
      leftMargin: coeff(0),
      topMargin: coeff(-220),
    },
    bg: {
      width: coeff(800),
      heigth: coeff(819),
      imageScale: coeff(400) / coeff(419),
      leftMargin: coeff(-175),
      topMargin: coeff(0),
    },
    notes: {
      lineHeight: 2,
      brickhHeight: coeff(18),
      brickHeightHalf: coeff(18 / 2),
      notesScale: 0.3,
      brickLeftMargin: 45,
      notesNamesLeftMargin: coeff(5),
      noteNameColor: "#000",
    },
  },
};
