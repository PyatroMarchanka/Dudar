import { imagesTree, whistleFingerImages } from "../../dataset/bagpipeImages";
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
        yOffset: 20,
        backFingerIdx: 0,
        firstRightHandIdx: 4,
      };
    // Six front holes, no thumb hole: left hand on the top three, right hand below
    case BagpipeTypes.TinWhistle:
      return {
        backXposNormal: 0,
        backXposActive: 0,
        xPosNormal: 45,
        xPosNormalActive: 56,
        fingerSize: 20,
        yOffset: 10,
        backFingerIdx: undefined,
        firstRightHandIdx: 3,
      };
    default:
      return {
        backXposNormal: -8,
        backXposActive: -25,
        xPosNormal: 53,
        xPosNormalActive: 65,
        fingerSize: 40,
        yOffset: 20,
        backFingerIdx: 0,
        firstRightHandIdx: 4,
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
  const {
    backXposNormal,
    backXposActive,
    xPosNormal,
    xPosNormalActive,
    fingerSize,
    yOffset,
    backFingerIdx,
    firstRightHandIdx,
  } = getXpos(bagpipeType);
  const isBack = idx === backFingerIdx;

  const backXpos = isActive ? backXposActive : backXposNormal;
  const normalXpos = isActive ? xPosNormalActive : xPosNormal;
  const xPos = isBack ? backXpos : normalXpos;
  // The whistle's metal body uses its own steel/charcoal markers instead of the
  // skin-toned finger icons used on the bagpipes, and has no left/right coloring.
  const image =
    bagpipeType === BagpipeTypes.TinWhistle
      ? whistleFingerImages[isActive ? "active" : "inactive"]
      : (imagesTree as any)[idx >= firstRightHandIdx ? "right" : "left"][
          isActive ? "active" : "inactive"
        ][holeType];
  ctx.drawImage(image, xPos, yPos - yOffset, fingerSize, fingerSize);
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
    [BagpipeTypes.TinWhistle]: {},
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

  const yPoses =
    holesPositions.fingersYPositions ||
    holesPositions.linesYPositions.slice(0, holesPositions.linesYPositions.length - 1);
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
