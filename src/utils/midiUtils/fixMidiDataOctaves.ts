import { Midi } from "@tonejs/midi";

export const fixMidiDataOctaves = (midiData: Midi): { midiData: Midi; lowestOctave: number } => {
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
