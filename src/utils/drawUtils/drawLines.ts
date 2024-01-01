import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "./../../interfaces/index";
import { drawShadow } from "./drawBagpipe";

export const drawLines = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { holesPositions, imagesProperties } = bagpipes[bagpipeType];
  ctx.fillStyle = "#D6D6D6";
  holesPositions.linesYPositions.forEach((yPos) => {
    ctx.fillRect(
      30,
      yPos,
      window.innerWidth,
      imagesProperties.notes.lineHeight
    );
  });

  drawShadow(ctx!, bagpipeType);
};
