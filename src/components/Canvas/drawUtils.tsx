import { Note } from "@tonejs/midi/dist/Note";
import { Notes } from "../../interfaces";

export const getYposByNote = (note: Notes) => {
  const allNotes = ["G", "A", "B", "C", "D", "E", "F", "G", "A"];
  const yPoses = [388, 326, 274, 229, 177, 132, 91, 58, 20];
  return yPoses[allNotes.indexOf(note[0])];
};

export const drawNote = (
  ctx: CanvasRenderingContext2D,
  note: Notes,
  dur: number,
  start: number,
  tick: number
) => {
  const y = getYposByNote(note);
  const coefficient = 0.5;
  const brickhHeight = 23;

  const startPos = start * coefficient - tick * coefficient;
  if (startPos < 0) {
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
      drawNote(ctx, note.pitch as Notes, note.durationTicks, note.ticks, tick);
    });

  nextToNextNotes &&
    nextToNextNotes?.forEach((note) => {
      drawNote(ctx, note.pitch as Notes, note.durationTicks, note.ticks, tick);
    });

  ctx.fill();
};

export const drawBagpipe = (ctx: CanvasRenderingContext2D) => {
  const image = new Image();
  image.src = "/images/bagpipe-9-holes.png";
  ctx.drawImage(image, -30, 8, 136, 500);
};
