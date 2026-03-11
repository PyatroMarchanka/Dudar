import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes } from "./../../interfaces/index";
import { Note } from "@tonejs/midi/dist/Note";
import { SharpNotes } from "../../interfaces";
import { mainColors } from "../theme";
import { sizes } from "../../constants/style";

(CanvasRenderingContext2D.prototype as any).roundRect = function (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

export const drawNotes = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  tick: number,
  previousNotes?: Note[],
  nextNotes?: Note[],
  nextToNextNotes?: Note[],
  previousPreviousNotes?: Note[],
  nextToNextToNextNotes?: Note[]
) => {
  // Pre-calculate shared values once
  const imageProperties = bagpipes[bagpipeType].imagesProperties;
  const tickScaled = tick * sizes.notesScale;
  const canvasWidth = ctx.canvas.width;
  const brickLeftMargin = imageProperties.notes.brickLeftMargin;
  const brickHeightHalf = imageProperties.notes.brickHeightHalf;
  const brickHeight = imageProperties.notes.brickhHeight;
  const { notesToLines, holesPositions } = bagpipes[bagpipeType];
  
  // Pre-cache colors
  const colorPast = mainColors.darkRed;
  const colorNormal = mainColors.darkerGray;
  
  // Combine all notes into single array to iterate once
  const allNotes = [
    ...(previousPreviousNotes || []),
    ...(previousNotes || []),
    ...(nextNotes || []),
    ...(nextToNextNotes || []),
    ...(nextToNextToNextNotes || [])
  ];
  
  // Draw all notes in one pass
  for (let i = 0; i < allNotes.length; i++) {
    const note = allNotes[i];
    const pitch = note.pitch as SharpNotes;
    
    // Get Y position
    const yPos = holesPositions.linesYPositions[notesToLines[pitch + note.octave]];
    if (!yPos) continue;
    
    // Calculate positions
    const startPos = note.ticks * sizes.notesScale - tickScaled + brickLeftMargin;
    const noteWidth = note.durationTicks * sizes.notesScale;
    const endPos = startPos + noteWidth;
    
    // Skip off-screen notes
    if (endPos < 0 || startPos > canvasWidth) continue;
    
    // Draw note
    ctx.beginPath();
    // @ts-ignore
    ctx.roundRect(
      startPos,
      yPos - brickHeightHalf,
      noteWidth,
      brickHeight,
      10
    );
    ctx.fillStyle = startPos < brickLeftMargin ? colorPast : colorNormal;
    ctx.fill();
  }
};
