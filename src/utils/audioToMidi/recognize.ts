import { notesMaps } from '../../dataset/bagpipesNotesMaps';
import { BagpipeTypes, SharpNotesEnum } from '../../interfaces';
import { convertNoteToMidiPitch } from '../midiUtils/noteUtils';

// What the recognition returns (see basicPitch.ts).

export interface RecognizedNote {
  // Written for an A instrument, like the editor's notes
  pitch: number;
  // Seconds from the start of the recording
  start: number;
  end: number;
}

export interface RecognizeOptions {
  bagpipeType: BagpipeTypes;
  // The transpose setting: the key the pipe is most likely in
  transpose: number;
  // Shorter notes are taken as ornaments (grace notes, cuts) and left out
  minNoteSeconds?: number;
  onProgress?: (fraction: number) => void;
}

export interface Recognition {
  notes: RecognizedNote[];
  // How many short notes were taken as ornaments and left out
  ornaments: number;
  // Semitones between the written notes and what the pipe sounds
  keyTranspose: number;
  // How far the pipe is from equal tuning at A = 440, in semitones (-0.5..0.5)
  tuningOffset: number;
  // Seconds in which the chanter was heard
  soundingSeconds: number;
  // Share of the sounding time whose pitch is one of this bagpipe's notes (0..1)
  fit: number;
}

// The pitches (written for an A instrument) a bagpipe's chanter can play
export const getBagpipePitches = (bagpipeType: BagpipeTypes) =>
  Object.keys(notesMaps[bagpipeType] ?? {})
    .map((note) => convertNoteToMidiPitch(note as SharpNotesEnum))
    .sort((a, b) => a - b);
