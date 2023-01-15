import { BagpipeHolesPositions, BagpipeTypes } from "../interfaces";

const coefficient = 0.8;
export const coeff = (num: number) => num * coefficient;

const belarusianNONTraditionalHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 554, leftMargin: 43 - 20, diameter: 38 },
    { yPos: 508, leftMargin: 43, diameter: 38 },
    { yPos: 452, leftMargin: 43, diameter: 38 },
    { yPos: 396, leftMargin: 43, diameter: 38 },
    { yPos: 298, leftMargin: 43, diameter: 38 },
    { yPos: 242, leftMargin: 43, diameter: 38 },
    { yPos: 186, leftMargin: 43, diameter: 38 },
    { yPos: 130, leftMargin: 43, diameter: 38 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    diameter: coeff(hole.diameter),
    leftMargin: coeff(hole.leftMargin),
  })),
  blowImage: { yPos: coeff(640), leftMargin: coeff(43), diameter: coeff(38) },
};

const belarusianOpenHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 554, leftMargin: 43, diameter: 38 },
    { yPos: 508, leftMargin: 43, diameter: 38 },
    { yPos: 452, leftMargin: 43, diameter: 38 },
    { yPos: 396, leftMargin: 43, diameter: 38 },
    { yPos: 298, leftMargin: 43, diameter: 38 },
    { yPos: 242, leftMargin: 43, diameter: 38 },
    { yPos: 186, leftMargin: 43, diameter: 38 },
    { yPos: 130, leftMargin: 43, diameter: 38 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    leftMargin: coeff(hole.leftMargin),
    diameter: coeff(hole.diameter),
  })),
  blowImage: { yPos: coeff(640), leftMargin: coeff(43), diameter: coeff(38) },
};

const belarusianTraditionalHoles: BagpipeHolesPositions = {
  closable: [
    { yPos: 524, leftMargin: 43, diameter: 38 },
    { yPos: 478, leftMargin: 43, diameter: 38 },
    { yPos: 422, leftMargin: 43, diameter: 38 },
    { yPos: 366, leftMargin: 43, diameter: 38 },
    { yPos: 268, leftMargin: 43, diameter: 38 },
    { yPos: 212, leftMargin: 43, diameter: 38 },
    { yPos: 156, leftMargin: 43, diameter: 38 },
    { yPos: 100, leftMargin: 43, diameter: 38 },
  ].map((hole) => ({
    yPos: coeff(hole.yPos),
    leftMargin: coeff(hole.leftMargin),
    diameter: coeff(hole.diameter),
  })),
  blowImage: { yPos: coeff(640), leftMargin: coeff(43), diameter: coeff(38) },
};

export const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalHoles,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalHoles,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenHoles,
};
