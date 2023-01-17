import { BagpipeHolesPositions, BagpipeTypes } from "../interfaces";

const coefficient = 0.8;
export const coeff = (num: number) => num * coefficient;

const belarusianTraditionalHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 564, leftMargin: 43, diameter: 20 },
    { yPos: 544, leftMargin: 63, diameter: 20 },
    { yPos: 478, leftMargin: 43, diameter: 35 },
    { yPos: 422, leftMargin: 43, diameter: 35 },
    { yPos: 302, leftMargin: 43, diameter: 20 },
    { yPos: 282, leftMargin: 63, diameter: 20 },
    { yPos: 222, leftMargin: 43, diameter: 35 },
    { yPos: 176, leftMargin: 43, diameter: 35 },
    { yPos: 120, leftMargin: 63, diameter: 20 },
    { yPos: 140, leftMargin: 43, diameter: 20 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    leftMargin: coeff(hole.leftMargin),
    diameter: coeff(hole.diameter),
  })),
};

const belarusianNONTraditionalHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 574, leftMargin: 50, diameter: 25 },
    { yPos: 528, leftMargin: 50, diameter: 25 },
    { yPos: 482, leftMargin: 60, diameter: 20 },
    { yPos: 452, leftMargin: 50, diameter: 20 },
    { yPos: 386, leftMargin: 50, diameter: 25 },
    { yPos: 318, leftMargin: 50, diameter: 25 },
    { yPos: 262, leftMargin: 63, diameter: 20 },
    { yPos: 242, leftMargin: 43, diameter: 20 },
    { yPos: 176, leftMargin: 50, diameter: 25 },
    { yPos: 130, leftMargin: 50, diameter: 25 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    diameter: coeff(hole.diameter),
    leftMargin: coeff(hole.leftMargin),
  })),
};

const belarusianOpenHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 574, leftMargin: 50, diameter: 25 },
    { yPos: 528, leftMargin: 50, diameter: 25 },
    { yPos: 482, leftMargin: 60, diameter: 20 },
    { yPos: 452, leftMargin: 50, diameter: 20 },
    { yPos: 386, leftMargin: 50, diameter: 25 },
    { yPos: 318, leftMargin: 50, diameter: 25 },
    { yPos: 262, leftMargin: 63, diameter: 20 },
    { yPos: 242, leftMargin: 43, diameter: 20 },
    { yPos: 176, leftMargin: 50, diameter: 25 },
    { yPos: 130, leftMargin: 50, diameter: 25 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    diameter: coeff(hole.diameter),
    leftMargin: coeff(hole.leftMargin),
  })),
  blowImage: { yPos: coeff(640), leftMargin: coeff(43), diameter: coeff(38) },
};

export const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalHoles,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalHoles,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenHoles,
};
