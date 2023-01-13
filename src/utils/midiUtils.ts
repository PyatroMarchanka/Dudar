import { Notes, SharpMap, SharpNotes } from "./../interfaces/index";
import { Midi } from "@tonejs/midi";
import { parseMidi, MidiData, writeMidi } from "midi-file";
import { AllNotes } from "../dataset/notes";

export const convertToSharp = (note: Notes): SharpNotes => {
  const map: SharpMap = {
    Bb: "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
  };

  return (note in map ? map[note as keyof SharpMap] : note) as SharpNotes;
};

export const fixMidiDataOctaves = (
  midiData: Midi
): { midiData: Midi; lowestOctave: number } => {
  const octavesObject = {} as any;
  const notes = midiData?.tracks.filter((track) => track.notes.length)[0].notes;

  if (!notes) {
    return { midiData, lowestOctave: 4 };
  }

  notes.forEach((note) => {
    if (!(note.octave in octavesObject)) {
      octavesObject[note.octave] = note.octave;
    }
  });

  const octaves = Object.keys(octavesObject)
    .map((e) => +e)
    .sort((a: any, b: any) => a - b);

  midiData.tracks[0].notes = notes.map((note) => {
    note.octave += 4 - octaves[0];

    return note;
  });

  return { midiData, lowestOctave: octaves[0] };
};

export const getSongNotesFromMidi = (midi: Midi): SharpNotes[] => {
  const notes = midi?.tracks.filter((track) => track.notes.length)[0].notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note) => {
    if (!(note.pitch in notesObject)) {
      notesObject[note.pitch] = note.pitch;
    }
  });

  return Object.keys(notesObject) as SharpNotes[];
};

function toArrayBuffer(buf: Buffer) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export const addMetronome = async (songBuffer: ArrayBuffer) => {
  // METRONOME ADDING
  const outputSongBuffer = Buffer.from(songBuffer);
  const parsedSong = parseMidi(outputSongBuffer);

  const metronomeFile = await fetch(`midi/common/metronome.midi`);
  const metronomeBuffer = await metronomeFile.arrayBuffer();
  const outputMetronomeBuffer = Buffer.from(metronomeBuffer);
  let parsedMetronome = parseMidi(outputMetronomeBuffer);

  // Update metronome tempo
  parsedMetronome.header.ticksPerBeat = parsedSong.header.ticksPerBeat || 480;

  const songLength = parsedSong.tracks[0].reduce(
    (acc, cur) => acc + cur.deltaTime,
    0
  );

  const metronomRoundsCountForSong = Math.ceil(
    songLength / ((parsedSong.header.ticksPerBeat || 480) * 8)
  );

  parsedMetronome.tracks[0] = parsedMetronome.tracks[0]
    .map((note) => {
      if (parsedSong.header.ticksPerBeat !== 480 && note.deltaTime === 480) {
        note.deltaTime = parsedSong.header.ticksPerBeat || 480;
      }

      return note;
    })
    .filter(
      (note) => note.deltaTime <= (parsedSong.header.ticksPerBeat || 480)
    );

  const resultMetronomTrack = new Array(metronomRoundsCountForSong)
    .fill(parsedMetronome.tracks[0])
    .flat(1);

  const songWithMetronome: MidiData = {
    header: {
      ...parsedSong.header,
      numTracks: parsedSong.header.numTracks + 1,
    },
    tracks: [...parsedSong.tracks, resultMetronomTrack],
  };

  const outputBuffer = Buffer.from(writeMidi(songWithMetronome));
  return toArrayBuffer(outputBuffer);
};

export function transposeNote(note: SharpNotes, step: number): SharpNotes {
  let indexOfNote = AllNotes.indexOf(note);
  if (step < 0) {
    const index = (indexOfNote + step) % AllNotes.length;

    return AllNotes[index >= 0 ? index : 12 + index];
  }

  return AllNotes[(indexOfNote + step) % AllNotes.length];
}

export const convertMidiPitchToNote = (midiPitch: number) => {
  const note = midiPitch % 12;
  const octave = Math.floor(midiPitch / 12) - 1;
  return { note: AllNotes[note], octave };
};
