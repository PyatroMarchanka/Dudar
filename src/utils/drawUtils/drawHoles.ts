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
  const blowImageYPos = holesPositions.blowImage.yPos;
  const blowImageLeftMargin = holesPositions.blowImage.leftMargin;
  const blowImageSize = holesPositions.blowImage.diameter;

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
  const { holesPositions, images } = bagpipes[bagpipeType];

  const holes = holesPositions.closable;

  holes.forEach((hole, i) => {
    drawHole(ctx, bagpipeType, hole, false, i === 0);
  });

  drawBlowImage(ctx, bagpipeType);
};

export const drawActiveHoles = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  activeNote: { note: SharpNotes; octave: number }
) => {
  if (!activeNote) {
    return;
  }
  const { notesMap, images, holesPositions } = bagpipes[bagpipeType];

  if (activeNote.note + activeNote.octave in notesMap) {
  }
};

// export const drawActiveHoles = (
//   ctx: CanvasRenderingContext2D,
//   lowestOctave: number,
//   activeHole?: { note: SharpNotes; octave: number } | null,
//   isClosedManer?: boolean
// ) => {
//   if (!activeHole) {
//     return;
//   }

//   const yPos = getYposByNote(activeHole.note, activeHole?.octave, lowestOctave);
//   if (!yPos?.yPosInPx) {
//     return;
//   }
//   const topMargin = holeImageRadiusHalf;

//   if (!isClosedManer) {
//     yPosesReversed.forEach((pos, i) => {
//       if (i <= yPoses.length - yPos.position - 1 && i >= 1) {
//         ctx.drawImage(
//           i === 1 ? backActiveHoleImage : activeHoleImage,
//           i === 1 ? lastHoleLeftMargin : holeLeftMargin,
//           pos - topMargin,
//           holeImageRadius,
//           holeImageRadius
//         );
//       }
//     });
//   } else {
//     ctx.drawImage(
//       activeHoleImage,
//       holeLeftMargin,
//       yPos.yPosInPx - topMargin,
//       holeImageRadius,
//       holeImageRadius
//     );
//   }
// };
