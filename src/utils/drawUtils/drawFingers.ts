import { imagesTree } from "../../dataset/bagpipeImages";
import { bagpipes } from "../../dataset/bagpipes";
import { BagpipeTypes, SharpNotes, SharpNotesEnum } from "../../interfaces";

type HoleType = "normal" | "double" | "doubleHalf";

const getXpos = (
  bagpipeType: BagpipeTypes,
) => {
  switch (bagpipeType) {
    case BagpipeTypes.Polish:
      return {
        backXposNormal: -5,
        backXposActive: -35,
        xPosNormal: 23,
        xPosNormalActive: 35,
        fingerSize: 35,
      };
    default:
      return {
        backXposNormal: -8,
        backXposActive: -25,
        xPosNormal: 53,
        xPosNormalActive: 65,
        fingerSize: 40,
      };
  }
};

const drawFinger = (
  ctx: CanvasRenderingContext2D,
  yPos: number,
  isActive: boolean,
  idx: number,
  holeType: HoleType,
  bagpipeType: BagpipeTypes
) => {
  const isBack = idx === 0;
  const { backXposNormal, backXposActive, xPosNormal, xPosNormalActive, fingerSize } =
    getXpos(bagpipeType);

  const backXpos = isActive ? backXposActive : backXposNormal;
  const normalXpos = isActive ? xPosNormalActive : xPosNormal;
  const xPos = isBack ? backXpos : normalXpos;
  const image = (imagesTree as any)[idx > 3 ? "right" : "left"][
    isActive ? "active" : "inactive"
  ][holeType];
  ctx.drawImage(image, xPos, yPos - 20, fingerSize, fingerSize);
};

const getHoleType = (
  bagpipeType: BagpipeTypes,
  i: number,
  notes: SharpNotesEnum[]
): HoleType => {
  const isCbekar = notes.includes(SharpNotesEnum.C5);
  const isFbekar = notes.includes(SharpNotesEnum.F5);
  const isGbekar = notes.includes(SharpNotesEnum.G4);

  const map: any = {
    [BagpipeTypes.BelarusianNONTraditionalDuda]: {
      2: isFbekar ? "doubleHalf" : "double",
      5: isCbekar ? "doubleHalf" : "double",
    },
    [BagpipeTypes.BelarusianOpenDuda]: {
      2: isFbekar ? "doubleHalf" : "double",
      5: isCbekar ? "doubleHalf" : "double",
    },
    [BagpipeTypes.BelarusianTraditionalDuda]: {
      0: isFbekar ? "doubleHalf" : "double",
      3: isCbekar ? "doubleHalf" : "double",
      6: isGbekar ? "doubleHalf" : "double",
    },
    [BagpipeTypes.Dudelsack]: {},
    [BagpipeTypes.Highlander]: {},
    [BagpipeTypes.Polish]: {},
  };

  return map[bagpipeType][i] || "normal";
};

export const drawFingers = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  activeNote: { note: SharpNotes; octave: number },
  notesNames: SharpNotesEnum[]
) => {
  if (!activeNote) {
    return;
  }
  const { holesPositions, fingersMaps } = bagpipes[bagpipeType];
  const note = activeNote.note + activeNote.octave;

  const yPoses = holesPositions.linesYPositions.slice(
    0,
    holesPositions.linesYPositions.length - 1
  );
  const holeTypes = yPoses.map((_, i) => {
    return getHoleType(bagpipeType, i, notesNames);
  });

  yPoses.forEach((yPos, i) => {
    if (note in fingersMaps) {
      const inactiveFingers = fingersMaps[note];
      drawFinger(ctx, yPos, !inactiveFingers.includes(i), i, holeTypes[i], bagpipeType);
    }
  });
};
