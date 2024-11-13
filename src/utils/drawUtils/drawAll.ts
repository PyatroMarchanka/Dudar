import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import { BagpipeTypes, SharpNotes, SharpNotesEnum } from "../../interfaces";
import { drawBagpipe, drawNotesNames, NotesMap } from "./drawBagpipe";
import { drawBarsLines } from "./drawBarsLines";
import { drawActiveHoles, drawClosedHoles } from "./drawHoles";
import { drawNotes } from "./drawNotes";
import { Song } from "../../dataset/songs/interfaces";
import { drawFingers } from "./drawFingers";

export const drawDynamic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  midiData: Midi | null,
  previousNotes: Note[] | undefined,
  nextNotes?: Note[] | undefined,
  nextToNextNotes?: Note[] | undefined,
  song?: Song
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBarsLines(ctx, tick, midiData, bagpipeType, song?.timeSignature);
  drawNotes(ctx, bagpipeType, tick, previousNotes, nextNotes, nextToNextNotes);
};

export const cleanLines = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const drawStatic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  notesToLineIdx: NotesMap,
  bagpipeNotes: SharpNotesEnum[],
  activeNote?: {
    note: SharpNotes;
    octave: number;
  } | null
) => {
  const isFingersAnimation =
    bagpipeType !== BagpipeTypes.Dudelsack &&
    bagpipeType !== BagpipeTypes.Highlander;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBagpipe(ctx, bagpipeType);
  if (!isFingersAnimation) {
    drawClosedHoles(ctx, bagpipeType);
  }
  drawNotesNames(ctx, bagpipeType, notesToLineIdx);
  
  if (activeNote) {
    if (!isFingersAnimation) {
      drawActiveHoles(ctx!, bagpipeType, activeNote);
    } else {
      drawFingers(ctx!, bagpipeType, activeNote, bagpipeNotes);
    }
  }
};
