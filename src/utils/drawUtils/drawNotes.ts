import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "./../../interfaces/index";
import { Note } from "@tonejs/midi/dist/Note";
import { SharpNotes } from "../../interfaces";
import { mainColors } from "../theme";

const notesScale = 0.3;

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

  if (startPos < brickLeftMargin) {
    ctx.fillStyle = mainColors.red;
  } else {
    ctx.fillStyle = mainColors.darkerGray;
  }

  ctx.fillRect(
    startPos,
    y.yPosInPx - imageProperties.notes.brickHeightHalf,
    dur * notesScale,
    imageProperties.notes.brickhHeight
  );
};

export const drawNotes = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
  ctx.beginPath();

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

  ctx.fill();
};
