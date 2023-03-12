import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import { BagpipeTypes, SharpNotes } from "../../interfaces";
import {
  drawBagpipe,
  drawNotesNames,
  drawShadow,
  NotesMap,
} from "./drawBagpipe";
import { drawBarsLines } from "./drawBarsLines";
import { drawActiveHoles, drawClosedHoles } from "./drawHoles";
import { drawNotes } from "./drawNotes";

export const drawDynamic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  midiData: Midi | null,
  nextNotes?: Note[] | undefined,
  nextToNextNotes?: Note[] | undefined
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBarsLines(ctx, tick, midiData, bagpipeType);
  drawNotes(ctx, bagpipeType, tick, nextNotes, nextToNextNotes);
};

export const cleanLines = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const drawStatic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  notesToLineIdx: NotesMap,
  activeNote?: {
    note: SharpNotes;
    octave: number;
  } | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawShadow(ctx, bagpipeType);
  drawBagpipe(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);
  drawNotesNames(ctx, bagpipeType, notesToLineIdx);

  if (activeNote) {
    drawActiveHoles(ctx!, bagpipeType, activeNote);
  }
};
