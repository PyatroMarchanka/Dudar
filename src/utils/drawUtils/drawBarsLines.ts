import { holesPositions } from "./../../dataset/bagpipesHolesPositions";
import { Midi } from "@tonejs/midi";
import { sizes } from "../../constants/style";
import { BagpipeTypes } from "../../interfaces";
import { bagpipes } from "../../dataset/bagpipes";
import { mainColors } from "../theme";

const getLinePosition = (midiData: Midi, tick: number) => {
  const ticksPerBar = midiData.header.ppq * 4;
  const currentBar = Math.ceil(tick / ticksPerBar);
  const lineXPosStart = currentBar * ticksPerBar - tick;

  const lines = [lineXPosStart, lineXPosStart + ticksPerBar];

  return lines.map((line) => line * sizes.notesScale + sizes.brickLeftMargin);
};

export const drawBarsLines = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  midiData: Midi | null,
  bagpipeType: BagpipeTypes
) => {
  if (!midiData) return;
  const lines = getLinePosition(midiData, tick);
  const { holesPositions, imagesProperties } = bagpipes[bagpipeType];
  const [top, bottom] = [
    holesPositions.linesYPositions[0],
    holesPositions.linesYPositions[holesPositions.linesYPositions.length - 1],
  ];
  ctx.strokeStyle = mainColors.lightGrey;
  ctx.lineWidth = imagesProperties.notes.lineHeight;
  lines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line, top);
    ctx.lineTo(line, bottom);
    ctx.stroke();
  });
};
