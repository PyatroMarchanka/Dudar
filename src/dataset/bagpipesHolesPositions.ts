import { BagpipeHolesPositions, BagpipeTypes, Hole } from "../interfaces";

const coefficient = 0.8;

export const coeff = (num: number) => num * coefficient;

const applyCoefficientToHole = (hole: Hole) => ({
  yPos: coeff(hole.yPos),
  leftMargin: coeff(hole.leftMargin),
  diameter: coeff(hole.diameter),
});

const holesToLinesYPositions = (holes: Hole[]) => {
  const res = holes
    .map((hole) => {
      if (!hole.isAdditional) {
        return coeff(hole.yPos + hole.diameter / 2);
      }

      return 0;
    })
    .filter(Boolean);
  return res;
};

const belarusianTraditionalHolesClosable = [
  { yPos: 564, leftMargin: 43, diameter: 20, isAdditional: true },
  { yPos: 544, leftMargin: 63, diameter: 20 },
  { yPos: 478, leftMargin: 43, diameter: 35 },
  { yPos: 422, leftMargin: 43, diameter: 35 },
  { yPos: 302, leftMargin: 43, diameter: 20, isAdditional: true },
  { yPos: 282, leftMargin: 63, diameter: 20 },
  { yPos: 222, leftMargin: 43, diameter: 35 },
  { yPos: 176, leftMargin: 43, diameter: 35 },
  { yPos: 120, leftMargin: 63, diameter: 20, isAdditional: true },
  { yPos: 140, leftMargin: 43, diameter: 20 },
];

const belarusianNONTraditionalHolesClosable = [
  { yPos: 624, leftMargin: 50, diameter: 25 },
  { yPos: 528, leftMargin: 50, diameter: 25 },
  { yPos: 482, leftMargin: 60, diameter: 20, isAdditional: true },
  { yPos: 452, leftMargin: 50, diameter: 20 },
  { yPos: 386, leftMargin: 50, diameter: 25 },
  { yPos: 318, leftMargin: 50, diameter: 25 },
  { yPos: 262, leftMargin: 63, diameter: 20, isAdditional: true },
  { yPos: 242, leftMargin: 43, diameter: 20 },
  { yPos: 176, leftMargin: 50, diameter: 25 },
  { yPos: 130, leftMargin: 50, diameter: 25 },
];

const belarusianOpenHolesClosable = [
  { yPos: 620, leftMargin: 30, diameter: 25 },
  { yPos: 568, leftMargin: 50, diameter: 25 },
  { yPos: 522, leftMargin: 60, diameter: 20, isAdditional: true },
  { yPos: 492, leftMargin: 50, diameter: 20 },
  { yPos: 436, leftMargin: 50, diameter: 25 },
  { yPos: 348, leftMargin: 50, diameter: 25 },
  { yPos: 292, leftMargin: 63, diameter: 20, isAdditional: true },
  { yPos: 262, leftMargin: 43, diameter: 20 },
  { yPos: 196, leftMargin: 50, diameter: 25 },
  { yPos: 150, leftMargin: 50, diameter: 25 },
];

const belarusianTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [
    ...holesToLinesYPositions([...belarusianTraditionalHolesClosable]),
    coeff(100),
  ],
};

const belarusianNONTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianNONTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [
    ...holesToLinesYPositions([...belarusianNONTraditionalHolesClosable]),
    coeff(100),
  ],
};

const blowImage = {
  yPos: coeff(680),
  leftMargin: coeff(43),
  diameter: coeff(38),
};

const belarusianOpenHoles: BagpipeHolesPositions = {
  closable: belarusianOpenHolesClosable.map(applyCoefficientToHole),
  blowImage: blowImage,
  linesYPositions: [
    blowImage.yPos,
    ...holesToLinesYPositions(belarusianOpenHolesClosable),
  ],
};

export const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalHoles,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalHoles,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenHoles,
};
