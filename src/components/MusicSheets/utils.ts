import {
  StaveNote,
  Dot,
  Stave,
  Beam,
  Voice,
  Formatter,
  TickContext,
} from "vexflow";

interface MidiNote {
  duration: number;
  midi: number;
  noteOffVelocity: number;
  ticks: number;
  velocity: number;
}

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
    2: { dur: "w", dots: 0 },
    1.5: { dur: "h", dots: 1 },
    1.25: { dur: "h", dots: 2 },
    1: { dur: "h", dots: 0 },
    0.75: { dur: "q", dots: 1 },
    0.5: { dur: "q", dots: 0 },
    0.375: { dur: "8", dots: 1 },
    0.25: { dur: "8", dots: 0 },
    0.125: { dur: "16", dots: 0 },
    0.0625: { dur: "32", dots: 0 },
  };
  if (!durationRatios[duration]) {
    throw new Error(`Unknown duration: ${duration}`);
  }

  return durationRatios[duration]; // Default to quarter note if not found
};

export const convertMidiNoteToStaveNote = (midiNote: MidiNote): StaveNote => {
  const keys = [midiToPitch(midiNote.midi)];
  const duration = midiToDuration(midiNote.duration);
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

export const splitNotesIntoBars = (notes: any[], barLength: number) => {
  const bars: any[][] = [];
  let currentBar: any[] = [];
  let currentLength = 0;

  notes.forEach((note) => {
    const noteLength = note.duration;
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
  bar: any[],
  index: number,
  context: any,
  tonality: string,
  activeBarNote: number[]
) => {
  let notes = bar.map((note) => convertMidiNoteToStaveNote(note));
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
  new Formatter().joinVoices([voice]).format([voice], 350);
  const stave = new Stave(10, 40 + 80 * index, 450);
  stave.addClef("treble").setContext(context).draw();
  stave.addKeySignature(tonality).setContext(context).draw();

  voice.draw(context, stave);

  beams.forEach(function (beam) {
    beam.setContext(context).draw();
  });
};
