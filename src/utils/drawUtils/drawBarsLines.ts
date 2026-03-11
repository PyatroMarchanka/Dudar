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
  const ticksPerBeat = midiData.header.ppq * (1 / (fullBeats / 4));
  const currentBeat = Math.floor(tick / ticksPerBeat);
  
  // Pre-calculate constants used in the loop
  const { imagesProperties } = bagpipes[bagpipeType];
  const notesScale = sizes.notesScale;
  const brickLeftMargin = imagesProperties.notes.brickLeftMargin;
  
  // Generate beat lines - draw several beats before and after current position
  const linesData = [];
  for (let i = -2; i <= 10; i++) {
    const absoluteBeat = currentBeat + i;
    const beatPosition = (absoluteBeat * ticksPerBeat) - tick;
    const isFirstBeatOfBar = absoluteBeat % beatsPerBar === 0;
    const barNumber = Math.floor(absoluteBeat / beatsPerBar) + 1;
    
    linesData.push({
      position: beatPosition * notesScale + brickLeftMargin,
      isFirstBeatOfBar,
      barNumber
    });
  }

  return { linesData };
};

export const drawBarsLines = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  midiData: Midi | null,
  bagpipeType: BagpipeTypes,
  timeSignature?: TimeSignatures
) => {
  if (!midiData) return;
  const { linesData } = getLinePosition(midiData, tick, bagpipeType, timeSignature);

  const { holesPositions, imagesProperties } = bagpipes[bagpipeType];
  const top = holesPositions.linesYPositions[0] - 20;
  const bottom = holesPositions.linesYPositions[holesPositions.linesYPositions.length - 1];
  const topForRegularBeats = top + 20;
  const barNumberYPosition = top + 15;

  ctx.lineWidth = imagesProperties.notes.lineHeight;
  ctx.font = "bold 16px Arial";

  linesData.forEach((lineData) => {
    // Set stroke color: black for first beat of bar, light grey for other beats
    ctx.strokeStyle = lineData.isFirstBeatOfBar ? "black" : mainColors.linesColor;
    
    // Make non-first-beat lines shorter by 20px
    const lineTop = lineData.isFirstBeatOfBar ? top : topForRegularBeats;
    
    ctx.beginPath();
    ctx.moveTo(lineData.position, lineTop);
    ctx.lineTo(lineData.position, bottom);
    ctx.stroke();

    // Only show bar number on the first beat of each bar
    if (lineData.isFirstBeatOfBar) {
      ctx.fillText(lineData.barNumber.toString(), lineData.position + 10, barNumberYPosition);
    }
  });
};
