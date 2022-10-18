import { Note } from "@tonejs/midi/dist/Note";
import { Notes, SharpNotes } from "../../interfaces";

const numbers = {
  4: {
    G: 0,
    A: 1,
    B: 2,
  },
  5: {
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    A: 8,
  },
};

export const getYposByNote = (note: SharpNotes, octave: number) => {
  const yPoses = [388, 326, 274, 229, 177, 132, 91, 58, 20];
  const result = yPoses[(numbers as any)[octave][note[0]]];

  return result;
};

export const drawActiveHole = (
  ctx: CanvasRenderingContext2D,
  activeHole?: { note: SharpNotes; octave: number }
) => {
  if (!activeHole) {
    return;
  }

  ctx.beginPath();
  const yPos = getYposByNote(activeHole.note, activeHole?.octave);
  ctx.strokeStyle = "#fff";

  ctx.arc(-30, yPos, 20, 0, 2 * Math.PI);
  ctx.stroke();
};

export const drawNote = (
  ctx: CanvasRenderingContext2D,
  note: Notes,
  dur: number,
  start: number,
  tick: number,
  octave: number
) => {
  const y = getYposByNote(note, octave);
  const coefficient = 0.2;
  const brickhHeight = 30;

  const startPos = start * coefficient - tick * coefficient;
  if (startPos < 30) {
    ctx.fillStyle = "#b8440a";
  } else {
    ctx.fillStyle = "#b8720a";
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillRect(startPos, y, dur * coefficient, brickhHeight);

  ctx.strokeRect(startPos, y, dur * coefficient, brickhHeight);
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.beginPath();

  nextNotes &&
    nextNotes?.forEach((note) => {
      drawNote(
        ctx,
        note.pitch as Notes,
        note.durationTicks,
        note.ticks,
        tick,
        note.octave
      );
    });

  nextToNextNotes &&
    nextToNextNotes?.forEach((note) => {
      drawNote(
        ctx,
        note.pitch as Notes,
        note.durationTicks,
        note.ticks,
        tick,
        note.octave
      );
    });

  ctx.fill();
};

export const drawBagpipe = (ctx: CanvasRenderingContext2D) => {
  const image = new Image();
  image.src = "/images/bagpipe-9-holes.png";

  ctx.fillStyle = "#929292";

  ctx.fillRect(0, 0, 50, 500);
  ctx.drawImage(image, -30, 8, 136, 500);
};
