import { Note } from "@tonejs/midi/dist/Note";
import { BagpipeTypes, SharpNotes } from "../../interfaces";
import { drawBagpipe } from "./drawBagpipe";
import { drawActiveHoles, drawClosedHoles } from "./drawHoles";
import { drawNotes } from "./drawNotes";

export const drawAll = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  nextNotes?: Note[] | undefined,
  nextToNextNotes?: Note[] | undefined,
  activeNote?: {
    note: SharpNotes;
    octave: number;
  } | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawNotes(ctx, bagpipeType, tick, nextNotes, nextToNextNotes);
  drawBagpipe(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);

  if (activeNote) {
    drawActiveHoles(ctx!, bagpipeType, activeNote);
  }
};

export const drawStatic = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawBagpipe(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);
};
