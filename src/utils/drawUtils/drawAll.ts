import { Note } from "@tonejs/midi/dist/Note";
import { BagpipeTypes, SharpNotes } from "../../interfaces";
import {
  drawBagpipe,
  drawNotesNames,
  drawShadow,
  SongNotesData,
} from "./drawBagpipe";
import { drawActiveHoles, drawClosedHoles } from "./drawHoles";
import { drawLines } from "./drawLines";
import { drawNotes } from "./drawNotes";

export const drawAll = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  songNotesData: SongNotesData,
  nextNotes?: Note[] | undefined,
  nextToNextNotes?: Note[] | undefined,
  activeNote?: {
    note: SharpNotes;
    octave: number;
  } | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawLines(ctx, bagpipeType);
  drawNotes(ctx, bagpipeType, tick, nextNotes, nextToNextNotes);
  drawBagpipe(ctx, bagpipeType);
  drawShadow(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);
  drawNotesNames(ctx, bagpipeType, songNotesData);

  if (activeNote) {
    drawActiveHoles(ctx!, bagpipeType, activeNote);
  }
};

export const cleanLines = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const drawStatic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawLines(ctx, bagpipeType);
  drawBagpipe(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);
  drawShadow(ctx, bagpipeType);
};
