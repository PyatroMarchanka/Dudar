import { bagpipes } from '../../dataset/bagpipes';
import { BagpipeTypes, SharpNotesEnum } from '../../interfaces';
import { convertNoteToMidiPitch } from '../../utils/midiUtils';
import { RollNote } from '../../utils/midiUtils/melodyRoll';

// One row of the editor: a hole line of the bagpipe, as on the play screen.
// Several notes can share a line (a half-covered hole, or the upper octave of
// a whistle); a tap adds the lane's current choice among them.
export interface Lane {
  line: number;
  // Sorted from low to high, written for an A instrument
  notes: SharpNotesEnum[];
  pitches: number[];
}

export const getLanes = (bagpipeType: BagpipeTypes): Lane[] => {
  const notesToLines = bagpipes[bagpipeType]?.notesToLines ?? {};
  const byLine = new Map<number, SharpNotesEnum[]>();
  Object.entries(notesToLines).forEach(([note, line]) => {
    byLine.set(line, [...(byLine.get(line) ?? []), note as SharpNotesEnum]);
  });

  return Array.from(byLine.entries())
    .sort(([a], [b]) => a - b)
    .map(([line, notes]) => {
      const sorted = notes
        .map((note) => ({ note, pitch: convertNoteToMidiPitch(note) }))
        .sort((a, b) => a.pitch - b.pitch);
      return { line, notes: sorted.map(({ note }) => note), pitches: sorted.map(({ pitch }) => pitch) };
    });
};

// Index of the lane a pitch is drawn on, -1 when this bagpipe has no line for it
export const getLaneIndex = (lanes: Lane[], pitch: number) => lanes.findIndex((lane) => lane.pitches.includes(pitch));

// The note each lane adds on a tap: the one used last in the melody, else the lowest
export const getLaneChoices = (lanes: Lane[], notes: RollNote[]): number[] =>
  lanes.map((lane) => {
    for (let i = notes.length - 1; i >= 0; i--) {
      if (lane.pitches.includes(notes[i][0])) return notes[i][0];
    }
    return lane.pitches[0];
  });
