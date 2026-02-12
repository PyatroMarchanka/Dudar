import { bagpipes } from "../../dataset/bagpipes";
import { BagpipeTypes, Hole, SharpNotes } from "../../interfaces";

const getHoleImage = (
  bagpipeType: BagpipeTypes,
  isActive: boolean,
  isBack: boolean
) => {
  const { images } = bagpipes[bagpipeType];

  if (isActive && isBack) {
    return images.backActiveHoleImage;
  }

  if (!isActive && isBack) {
    return images.backClosedHoleImage;
  }

  if (!isActive && !isBack) {
    return images.closedHoleImage;
  }

  if (isActive && !isBack) {
    return images.activeHoleImage;
  }

  return images.closedHoleImage;
};

const drawBlowImage = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  const { holesPositions, images } = bagpipes[bagpipeType];
  const blowImageYPos = holesPositions.blowImage!.yPos;
  const blowImageLeftMargin = holesPositions.blowImage!.leftMargin;
  const blowImageSize = holesPositions.blowImage!.diameter;

  images.blowImage &&
    ctx.drawImage(
      images.blowImage,
      blowImageLeftMargin,
      blowImageYPos,
      blowImageSize,
      blowImageSize
    );
};

const drawHole = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  hole: Hole,
  isActive: boolean,
  isBack: boolean
) => {
  const image = getHoleImage(bagpipeType, isActive, isBack);
  image &&
    ctx.drawImage(
      image,
      hole.leftMargin,
      hole.yPos,
      hole.diameter,
      hole.diameter
    );
};

export const drawClosedHoles = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  const { holesPositions } = bagpipes[bagpipeType];

  const holes = holesPositions.closable;
  holes.forEach((hole, i) => {
    drawHole(ctx, bagpipeType, hole, false, i === 0);
  });

  if (holesPositions.blowImage) {
    drawBlowImage(ctx, bagpipeType);
  }
};

export const drawActiveHoles = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  activeNote: { note: SharpNotes; octave: number }
) => {
  if (!activeNote) {
    return;
  }
  const { notesMap, holesPositions } = bagpipes[bagpipeType];
  const note = activeNote.note + activeNote.octave;
  if (note in notesMap) {
    notesMap[note].forEach((holeIdx) => {
      drawHole(
        ctx,
        bagpipeType,
        holesPositions.closable[holeIdx],
        true,
        holeIdx === 0
      );
    });
  }
};
