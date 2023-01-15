import { BagpipeTypes } from "../../interfaces";
import { drawBagpipe } from "./drawBagpipe";
import { drawClosedHoles } from "./drawHoles";

export const drawAll = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  drawBagpipe(ctx, bagpipeType);
  drawClosedHoles(ctx, bagpipeType);
};
