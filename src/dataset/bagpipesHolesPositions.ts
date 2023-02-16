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
  { yPos: 524, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 504, leftMargin: 73, diameter: 17 },
  { yPos: 433, leftMargin: 68, diameter: 35 },
  { yPos: 366, leftMargin: 68, diameter: 35 },
  { yPos: 324, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 304, leftMargin: 73, diameter: 17 },
  { yPos: 245, leftMargin: 68, diameter: 35 },
  { yPos: 178, leftMargin: 68, diameter: 35 },
  { yPos: 145, leftMargin: 5, diameter: 17, isAdditional: true },
  { yPos: 125, leftMargin: 5, diameter: 17 },
].reverse();

const belarusianNONTraditionalHolesClosable = [
  { yPos: 475, leftMargin: 68, diameter: 35 },
  { yPos: 420, leftMargin: 68, diameter: 35 },
  { yPos: 387, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 365, leftMargin: 73, diameter: 17 },
  { yPos: 312, leftMargin: 68, diameter: 35 },
  { yPos: 258, leftMargin: 68, diameter: 35 },
  { yPos: 222, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 202, leftMargin: 73, diameter: 17 },
  { yPos: 146, leftMargin: 68, diameter: 35 },
  { yPos: 120, leftMargin: -6, diameter: 35 },
].reverse();

const belarusianOpenHolesClosable = [
  { yPos: 525, leftMargin: 68, diameter: 35 },
  { yPos: 470, leftMargin: 68, diameter: 35 },
  { yPos: 437, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 415, leftMargin: 73, diameter: 17 },
  { yPos: 362, leftMargin: 68, diameter: 35 },
  { yPos: 308, leftMargin: 68, diameter: 35 },
  { yPos: 272, leftMargin: 73, diameter: 17, isAdditional: true },
  { yPos: 252, leftMargin: 73, diameter: 17 },
  { yPos: 196, leftMargin: 68, diameter: 35 },
  { yPos: 170, leftMargin: -6, diameter: 35 },
].reverse();

const dudelsackClosable = [
  { yPos: 620, leftMargin: 30, diameter: 25 },
  { yPos: 568, leftMargin: 50, diameter: 25 },
  { yPos: 492, leftMargin: 53, diameter: 20 },
  { yPos: 436, leftMargin: 50, diameter: 25 },
  { yPos: 328, leftMargin: 50, diameter: 25 },
  { yPos: 262, leftMargin: 53, diameter: 20 },
  { yPos: 186, leftMargin: 50, diameter: 25 },
  { yPos: 140, leftMargin: 50, diameter: 25 },
];

const belarusianTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [
    ...holesToLinesYPositions([...belarusianTraditionalHolesClosable]),
    coeff(570),
  ],
};

const belarusianNONTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianNONTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [
    ...holesToLinesYPositions([...belarusianNONTraditionalHolesClosable]),
    coeff(100),
  ],
};

const blowImageBelOpenDuda = {
  yPos: coeff(110),
  leftMargin: coeff(30),
  diameter: coeff(38),
};

const belarusianOpenHoles: BagpipeHolesPositions = {
  closable: belarusianOpenHolesClosable.map(applyCoefficientToHole),
  blowImage: blowImageBelOpenDuda,
  linesYPositions: [
    blowImageBelOpenDuda.yPos,
    ...holesToLinesYPositions(belarusianOpenHolesClosable),
  ],
};

const blowImageDudelsack = {
  yPos: coeff(680),
  leftMargin: coeff(45),
  diameter: coeff(33),
};

const dudelsackHoles: BagpipeHolesPositions = {
  closable: dudelsackClosable.map(applyCoefficientToHole),
  blowImage: blowImageDudelsack,
  linesYPositions: [
    blowImageDudelsack.yPos,
    ...holesToLinesYPositions(dudelsackClosable),
  ],
};

export const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalHoles,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalHoles,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenHoles,
  [BagpipeTypes.Dudelsack]: dudelsackHoles,
};
