import { Midi } from "@tonejs/midi";
import { sizes } from "../../constants/style";
import { BagpipeTypes } from "../../interfaces";
import { bagpipes } from "../../dataset/bagpipes";
import { mainColors } from "../theme";
import { TimeSignatures } from "../../dataset/songs/interfaces";

const getLinePosition = (
  midiData: Midi,
  tick: number,
  bagpipeType: BagpipeTypes,
  timeSignature?: TimeSignatures
) => {
  const [beatsPerBar, fullBeats] = timeSignature?.split("/").map(Number) || [4, 4];
  const ticksPerBar = midiData.header.ppq * (beatsPerBar / (fullBeats / 4));
  const currentBar = Math.ceil(tick / ticksPerBar);
  const lineXPosStart = currentBar * ticksPerBar - tick;

  const lines = [lineXPosStart, lineXPosStart + ticksPerBar];

  const { imagesProperties } = bagpipes[bagpipeType];

  return {
    lines: lines.map((line) => line * sizes.notesScale + imagesProperties.notes.brickLeftMargin),
    currentBar,
  };
};

export const drawBarsLines = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  midiData: Midi | null,
  bagpipeType: BagpipeTypes,
  timeSignature?: TimeSignatures
) => {
  if (!midiData) return;
  const { lines, currentBar } = getLinePosition(midiData, tick, bagpipeType, timeSignature);

  const { holesPositions, imagesProperties } = bagpipes[bagpipeType];
  const [top, bottom] = [
    holesPositions.linesYPositions[0] - 30,
    holesPositions.linesYPositions[holesPositions.linesYPositions.length - 1],
  ];

  ctx.strokeStyle = mainColors.lightGrey;
  ctx.lineWidth = imagesProperties.notes.lineHeight;
  ctx.font = "bold 16px Arial";

  lines.forEach((line, i) => {
    ctx.beginPath();
    ctx.moveTo(line, top);
    ctx.lineTo(line, bottom);
    ctx.stroke();

    ctx.fillText((currentBar + 1 + i).toString(), line + 10, top + 20);
  });
};
