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
    .map((hole, i) => {
      if (!hole.isAdditional) {
        const isPreviousAdditional = holes[i + 1]?.isAdditional === true;

        return coeff(
          hole.yPos + hole.diameter / 2 + (isPreviousAdditional ? 11 : 0)
        );
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

const polishHolesClosable = [
  { yPos: 554, leftMargin: 73, diameter: 17 },
  { yPos: 473, leftMargin: 68, diameter: 35 },
  { yPos: 386, leftMargin: 68, diameter: 35 },
  { yPos: 314, leftMargin: 73, diameter: 17 },
  { yPos: 245, leftMargin: 68, diameter: 35 },
  { yPos: 185, leftMargin: 68, diameter: 35 },
  { yPos: 135, leftMargin: 30, diameter: 17 },
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
  { yPos: 620, leftMargin: 50, diameter: 25 },
  { yPos: 568, leftMargin: 50, diameter: 25 },
  { yPos: 492, leftMargin: 53, diameter: 20 },
  { yPos: 436, leftMargin: 50, diameter: 25 },
  { yPos: 328, leftMargin: 50, diameter: 25 },
  { yPos: 262, leftMargin: 53, diameter: 20 },
  { yPos: 186, leftMargin: 50, diameter: 25 },
  { yPos: 140, leftMargin: 20, diameter: 25 },
].reverse();

const highlanderClosable = [
  { yPos: 523, leftMargin: 41, diameter: 25 },
  { yPos: 444, leftMargin: 41, diameter: 25 },
  { yPos: 379, leftMargin: 41, diameter: 22 },
  { yPos: 332, leftMargin: 41, diameter: 22 },
  { yPos: 278, leftMargin: 41, diameter: 20 },
  { yPos: 225, leftMargin: 41, diameter: 20 },
  { yPos: 183, leftMargin: 42, diameter: 17 },
  { yPos: 140, leftMargin: 25, diameter: 25 },
].reverse();

const belarusianTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [...holesToLinesYPositions([...belarusianTraditionalHolesClosable]), coeff(570)],
};

const polishHoles: BagpipeHolesPositions = {
  closable: polishHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [...holesToLinesYPositions([...polishHolesClosable]), coeff(600)],
};

const belarusianNONTraditionalHoles: BagpipeHolesPositions = {
  closable: belarusianNONTraditionalHolesClosable.map(applyCoefficientToHole),
  linesYPositions: [
    ...holesToLinesYPositions([...belarusianNONTraditionalHolesClosable]),
    coeff(570),
  ],
};

const blowImageBelOpenDuda = {
  yPos: coeff(115),
  leftMargin: coeff(32),
  diameter: coeff(30),
};

const belarusianOpenHoles: BagpipeHolesPositions = {
  closable: belarusianOpenHolesClosable.map(applyCoefficientToHole),
  blowImage: blowImageBelOpenDuda,
  linesYPositions: [
    ...holesToLinesYPositions(belarusianOpenHolesClosable),coeff(570),
  ],
};

const blowImageDudelsack = {
  yPos: coeff(90),
  leftMargin: coeff(45),
  diameter: coeff(33),
};

const blowImageHighlander = {
  yPos: coeff(90),
  leftMargin: coeff(36),
  diameter: coeff(27),
};

const dudelsackHoles: BagpipeHolesPositions = {
  closable: dudelsackClosable.map(applyCoefficientToHole),
  blowImage: blowImageDudelsack,
  linesYPositions: [blowImageDudelsack.yPos, ...holesToLinesYPositions(dudelsackClosable)],
};

const highlanderHoles: BagpipeHolesPositions = {
  closable: highlanderClosable.map(applyCoefficientToHole),
  blowImage: blowImageHighlander,
  linesYPositions: [blowImageHighlander.yPos, ...holesToLinesYPositions(highlanderClosable)],
};

export const holesPositions = {
  [BagpipeTypes.BelarusianTraditionalDuda]: belarusianTraditionalHoles,
  [BagpipeTypes.BelarusianNONTraditionalDuda]: belarusianNONTraditionalHoles,
  [BagpipeTypes.BelarusianOpenDuda]: belarusianOpenHoles,
  [BagpipeTypes.Polish]: polishHoles,
  [BagpipeTypes.Dudelsack]: dudelsackHoles,
  [BagpipeTypes.Highlander]: highlanderHoles,
};
