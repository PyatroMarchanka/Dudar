import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import {
  StaveNote,
  Dot,
  Stave,
  Beam,
  Voice,
  Formatter,
  TickContext,
  StaveText,
} from "vexflow";
import { TimeSignatures } from "../../dataset/songs/interfaces";

export const STAVE_HEIGHT = 90;

const midiToPitch = (midi: number): string => {
  const octave = Math.floor(midi / 12) - 1;
  const note = [
    "c",
    "c#",
    "d",
    "d#",
    "e",
    "f",
    "f#",
    "g",
    "g#",
    "a",
    "a#",
    "b",
  ][midi % 12];
  return `${note}/${octave}`;
};

const midiToDuration = (duration: number): { dur: string; dots: number } => {
  const durationRatios: { [key: number]: { dur: string; dots: number } } = {
    1920: { dur: "w", dots: 0 },
    1440: { dur: "h", dots: 1 },
    1280: { dur: "h", dots: 0 }, // Triple half note
    1200: { dur: "h", dots: 2 },
    960: { dur: "h", dots: 0 },
    840: { dur: "q", dots: 2 },
    720: { dur: "q", dots: 1 },
    640: { dur: "q", dots: 0 }, // Triple quarter note
    480: { dur: "q", dots: 0 },
    360: { dur: "8", dots: 1 },
    320: { dur: "8", dots: 0 }, // Triple eighth note
    240: { dur: "8", dots: 0 },
    180: { dur: "16", dots: 2 },
    160: { dur: "16", dots: 0 }, // Triple sixteenth note
    120: { dur: "16", dots: 0 },
    90: { dur: "32", dots: 1 },
    80: { dur: "32", dots: 0 }, // Triple thirty-second note
    60: { dur: "32", dots: 0 },
  };

  if (!durationRatios[duration]) {
    const closestDuration = Object.keys(durationRatios).reduce((prev, curr) => {
      return Math.abs(parseInt(curr) - duration) <
        Math.abs(parseInt(prev) - duration)
        ? curr
        : prev;
    });

    if (Math.abs(parseInt(closestDuration) - duration) <= 10) {
      return durationRatios[parseInt(closestDuration)];
    } else {
      throw new Error(`Unknown duration: ${duration}`);
    }
  }

  if (!durationRatios[duration]) {
    throw new Error(`Unknown duration: ${duration}`);
  }

  return durationRatios[duration]; // Default to quarter note if not found
};

export const convertMidiNoteToStaveNote = (
  midiNote: Note,
  ppq: number
): StaveNote | null => {
  const durationTicks = midiNote.durationTicks;
  const durationFormatted = durationTicks * (480 / ppq);
  const keys = [midiToPitch(midiNote.midi)];
  const duration = midiToDuration(durationFormatted);
  const note = new StaveNote({
    keys,
    duration: duration.dur,
    dots: duration.dots,
  });

  if (duration.dots === 1) {
    note.addModifier(new Dot());
  }

  return note;
};

export const convertAllNotes = (bars: Note[][], ppq: number) => {
  const staveNotes: any[][] = [];
  bars.forEach((bar) => {
    const notes = bar.map(
      (note) => convertMidiNoteToStaveNote(note, ppq) || null
    );
    staveNotes.push(notes);
  });

  if (staveNotes.flat().every((note) => note !== null)) {
    return staveNotes as StaveNote[][];
  }

  throw new Error("Failed to convert notes");
};

const getBarLength = (timeSignature: TimeSignatures) => {
  const [numerator] = timeSignature.split("/").map(Number);
  if (numerator % 4 === 0) {
    return 4;
  }
  if (numerator % 3 === 0) {
    return 3;
  }
  if (numerator % 5 === 0) {
    return 5;
  }

  if (numerator % 7 === 0) {
    return 3.5;
  }

  return 4;
};

export const splitNotesIntoBars = (
  notes: any[],
  timeSignature: TimeSignatures,
  ppq = 480
) => {
  const bars: any[][] = [];
  let currentBar: any[] = [];
  let currentLength = 0;
  const barLength = getBarLength(timeSignature) * ppq; // Assuming 480 ticks per quarter note
  notes.forEach((note) => {
    const noteLength = note.durationTicks;
    if (currentLength + noteLength > barLength) {
      bars.push(currentBar);
      currentBar = [];
      currentLength = 0;
    }
    currentBar.push(note);
    currentLength += noteLength;
  });

  if (currentBar.length > 0) {
    bars.push(currentBar);
  }

  return bars;
};

export const renderBar = (
  bar: StaveNote[],
  index: number,
  context: any,
  tonality: string,
  activeBarNote: number[],
  midiFile: Midi | null,
  timeSignatire: TimeSignatures
) => {
  if (!midiFile) return;

  try {
    let notes = bar;

    const isActiveBar = activeBarNote[0] === index;
    notes = notes.map((note, i) => {
      note.setTickContext(new TickContext()).setContext(context);
      if (isActiveBar && activeBarNote[1] === i) {
        note.setStyle({ fillStyle: "red", strokeStyle: "red" });
      } else {
        note.setStyle({ fillStyle: "black", strokeStyle: "black" });
      }
      return note;
    });

    const beams = Beam.generateBeams(notes).map(function (beam, i) {
      if (isActiveBar && activeBarNote[1] === i) {
        beam.setStyle({ fillStyle: "red", strokeStyle: "red" });
      } else {
        beam.setStyle({ fillStyle: "black", strokeStyle: "black" });
      }
      return beam;
    });

    const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false);

    voice.addTickables(notes);
    if (voice.getTickables().length > 0) {
      new Formatter()
        .joinVoices([voice])
        .format([voice], index === 0 ? 270 : 320);
    }

    const stave = new Stave(50, 40 + STAVE_HEIGHT * index, 400);

    stave.addKeySignature(tonality).setContext(context);

    if (index === 0) {
      stave.addClef("treble").setContext(context);
      stave.addTimeSignature(timeSignatire).setContext(context);
    }
    const barNumber = new StaveText((index + 1).toString(), StaveText.Position.LEFT);
    barNumber.setContext(context).setStave(stave).draw();
    stave.draw();
    voice.draw(context, stave);

    beams.forEach(function (beam) {
      beam.setContext(context).draw();
    });
    return true;
  } catch (error) {
    console.error("Error rendering bar", error);
    return false;
  }
};
