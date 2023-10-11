import { holesPositions } from './../../dataset/bagpipesHolesPositions';
import { fingerLeftActiveImageSrc, fingerLeftImageSrc, fingerRightActiveImageSrc, fingerRightImageSrc } from "../../dataset/bagpipeImages";
import { bagpipes } from "../../dataset/bagpipes";
import { BagpipeTypes, Hole, SharpNotes } from "../../interfaces";
const fingerLeftImage = new Image();
fingerLeftImage.src = fingerLeftImageSrc;

const fingerRightImage = new Image();
fingerRightImage.src = fingerRightImageSrc;

const fingerLeftActiveImage = new Image();
fingerLeftActiveImage.src = fingerLeftActiveImageSrc;

const fingerRightActiveImage = new Image();
fingerRightActiveImage.src = fingerRightActiveImageSrc;

const drawFinger = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  yPos: number,
  isActive: boolean,
  idx: number
) => {
  const isBack = idx === 0;
  if (fingerLeftImage) {
    const backXposNormal = -14;
    const backXposActive = -30;
    const xPosNormal = 53;
    const xPosNormalActive = 65;

    const backXpos = isActive ? backXposActive : backXposNormal;
    const normalXpos = isActive ? xPosNormalActive : xPosNormal;
    const xPos = isBack ? backXpos : normalXpos;

    const leftImage = isActive ? fingerLeftActiveImage : fingerLeftImage;
    const rightImage = isActive ? fingerRightActiveImage : fingerRightImage;
    const image = idx > 3 ? leftImage : rightImage;

    ctx.drawImage(image, xPos, yPos - 20, 40, 40);
  }
};

export const drawFingers = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  activeNote: { note: SharpNotes; octave: number }
) => {
  if (!activeNote) {
    return;
  }
  const { holesPositions, fingersMaps } = bagpipes[bagpipeType];
  const note = activeNote.note + activeNote.octave;

  const yPoses = holesPositions.linesYPositions.slice(0, holesPositions.linesYPositions.length - 1)
  yPoses.forEach((yPos, i) => {
    if (note in fingersMaps) {
      const inactiveFingers = fingersMaps[note];
      drawFinger(ctx, bagpipeType, yPos, !inactiveFingers.includes(i), i);
    }
  });
};
