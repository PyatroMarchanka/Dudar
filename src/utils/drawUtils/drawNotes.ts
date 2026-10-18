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

// Index of the first note that starts at or after `tick` (notes are sorted by start tick)
const firstNoteFrom = (notes: Note[], tick: number) => {
  let lo = 0;
  let hi = notes.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (notes[mid].ticks < tick) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};

const longestDurationCache = new WeakMap<Note[], number>();

const getLongestDuration = (notes: Note[]) => {
  let longest = longestDurationCache.get(notes);
  if (longest === undefined) {
    longest = notes.reduce((max, note) => Math.max(max, note.durationTicks), 0);
    longestDurationCache.set(notes, longest);
  }
  return longest;
};

export const drawNotes = (ctx: CanvasRenderingContext2D, bagpipeType: BagpipeTypes, tick: number, notes?: Note[]) => {
  if (!notes || !notes.length) return;

  // Pre-calculate shared values once
  const imageProperties = bagpipes[bagpipeType].imagesProperties;
  const tickScaled = tick * sizes.notesScale;
  const canvasWidth = ctx.canvas.width;
  const brickLeftMargin = imageProperties.notes.brickLeftMargin;
  const brickHeightHalf = imageProperties.notes.brickHeightHalf;
  const brickHeight = imageProperties.notes.brickhHeight;
  const { notesToLines, holesPositions, overblownNotes } = bagpipes[bagpipeType];

  // Pre-cache colors
  const colorPast = mainColors.darkRed;
  const colorNormal = mainColors.darkerGray;
  // Upper-octave flute notes share lines with the lower octave, so they get their own color
  const colorOverblown = mainColors.orange;

  // Tick range that fits on the canvas, derived from its actual width
  const leftEdgeTick = tick - brickLeftMargin / sizes.notesScale;
  const rightEdgeTick = tick + (canvasWidth - brickLeftMargin) / sizes.notesScale;
  // A long note that started before the left edge can still reach into view
  const firstIdx = firstNoteFrom(notes, leftEdgeTick - getLongestDuration(notes));

  for (let i = firstIdx; i < notes.length; i++) {
    const note = notes[i];
    if (note.ticks > rightEdgeTick) break;

    const pitch = note.pitch as SharpNotes;

    // Get Y position
    const noteName = pitch + note.octave;
    const yPos = holesPositions.linesYPositions[notesToLines[noteName]];
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
    ctx.roundRect(startPos, yPos - brickHeightHalf, noteWidth, brickHeight, 10);
    if (startPos < brickLeftMargin) {
      ctx.fillStyle = colorPast;
    } else {
      ctx.fillStyle = overblownNotes?.includes(noteName) ? colorOverblown : colorNormal;
    }
    ctx.fill();
  }
};
