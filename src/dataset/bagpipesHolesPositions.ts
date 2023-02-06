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
  { yPos: 524, leftMargin: 73, diameter: 20, isAdditional: true },
  { yPos: 504, leftMargin: 93, diameter: 20 },
  { yPos: 433, leftMargin: 68, diameter: 35 },
  { yPos: 366, leftMargin: 68, diameter: 35 },
  { yPos: 322, leftMargin: 70, diameter: 20, isAdditional: true },
  { yPos: 302, leftMargin: 90, diameter: 20 },
  { yPos: 245, leftMargin: 68, diameter: 35 },
  { yPos: 178, leftMargin: 68, diameter: 35 },
  { yPos: 145, leftMargin: 5, diameter: 17, isAdditional: true },
  { yPos: 125, leftMargin: 5, diameter: 17 },
].reverse();

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
  yPos: coeff(680),
  leftMargin: coeff(43),
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
