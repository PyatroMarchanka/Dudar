import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "../../interfaces";

export const drawBagpipe = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  const bagpipeImage = bagpipes[bagpipeType].images.mainPipe;
  const imagesProperties = bagpipes[bagpipeType].imagesProperties;

  ctx.drawImage(
    bagpipeImage,
    imagesProperties.main_pipe.leftMargin,
    imagesProperties.main_pipe.topMargin,
    imagesProperties.main_pipe.width,
    imagesProperties.main_pipe.heigth
  );
};
