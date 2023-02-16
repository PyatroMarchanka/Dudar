import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "./../../interfaces/index";
import { Note } from "@tonejs/midi/dist/Note";
import { SharpNotes } from "../../interfaces";
import { mainColors } from "../theme";

CanvasRenderingContext2D.prototype.roundRect = function (
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

const notesScale = 0.2;

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
  const brickLeftMargin = 55;

  const startPos = start * notesScale - tick * notesScale + brickLeftMargin;
  ctx.beginPath();
  // @ts-ignore
  ctx.roundRect(
    startPos,
    y.yPosInPx - imageProperties.notes.brickHeightHalf,
    dur * notesScale,
    imageProperties.notes.brickhHeight,
    10
  );
  if (startPos < brickLeftMargin) {
    ctx.fillStyle = mainColors.red;
  } else {
    ctx.fillStyle = mainColors.darkerGray;
  }
  ctx.fill();
};

export const drawNotes = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
  nextNotes &&
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

  nextToNextNotes &&
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
