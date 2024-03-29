import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "./../../interfaces/index";
import { Note } from "@tonejs/midi/dist/Note";
import { SharpNotes } from "../../interfaces";
import { mainColors } from "../theme";
import { sizes } from "../../constants/style";

(CanvasRenderingContext2D.prototype as any).roundRect = function (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

const getYposByNote = (
  note: SharpNotes,
  octave: number,
  bagpipeType: BagpipeTypes
) => {
  const { notesToLines, holesPositions } = bagpipes[bagpipeType];
  let yPos = holesPositions.linesYPositions[notesToLines[note + octave]];

  return { yPosInPx: yPos };
};

const drawNote = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  note: SharpNotes,
  dur: number,
  start: number,
  tick: number,
  octave: number
) => {
  const imageProperties = bagpipes[bagpipeType].imagesProperties;

  const y = getYposByNote(note, octave, bagpipeType);
  if (!y?.yPosInPx) {
    return;
  }

  const startPos =
    start * sizes.notesScale -
    tick * sizes.notesScale +
    imageProperties.notes.brickLeftMargin;
  ctx.beginPath();
  // @ts-ignore
  ctx.roundRect(
    startPos,
    y.yPosInPx - imageProperties.notes.brickHeightHalf,
    dur * sizes.notesScale,
    imageProperties.notes.brickhHeight,
    10
  );
  if (startPos < imageProperties.notes.brickLeftMargin) {
    ctx.fillStyle = mainColors.darkRed;
  } else {
    ctx.fillStyle = mainColors.darkerGray;
  }
  ctx.fill();
};

export const drawNotes = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  previousNotes?: Note[],
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
 
  previousNotes?.forEach((note) => {
    drawNote(
      ctx,
      bagpipeType,
      note.pitch as SharpNotes,
      note.durationTicks,
      note.ticks,
      tick,
      note.octave
    );
  });

  nextNotes?.forEach((note) => {
    drawNote(
      ctx,
      bagpipeType,
      note.pitch as SharpNotes,
      note.durationTicks,
      note.ticks,
      tick,
      note.octave
    );
  });

  nextToNextNotes?.forEach((note) => {
    drawNote(
      ctx,
      bagpipeType,
      note.pitch as SharpNotes,
      note.durationTicks,
      note.ticks,
      tick,
      note.octave
    );
  });
};
