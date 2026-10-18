import { MidiNoteLike } from './notation';

export type Mode = 'major' | 'minor';

const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const pitchClassOf = (note: string) => PITCH_CLASSES.indexOf(note);

// Decides whether a melody on the given tonic is in minor or major.
// The tonic is known from the bagpipe, so only the third above it is compared: the minor third (3 semitones)
// against the major third (4 semitones), weighted by how long each sounds. When the melody has no third at all,
// the sixth (8 vs 9 semitones) decides. Ties and melodies with neither stay major.
export const detectMode = (notes: MidiNoteLike[], tonicPitchClass: number): Mode => {
  const weights = new Array(12).fill(0);
  notes.forEach((note) => {
    const degree = (((note.midi - tonicPitchClass) % 12) + 12) % 12;
    weights[degree] += note.durationTicks || 1;
  });
  if (weights[3] || weights[4]) return weights[3] > weights[4] ? 'minor' : 'major';
  return weights[8] > weights[9] ? 'minor' : 'major';
};

// The major key sharing its key signature with the given key, e.g. C for A minor.
export const signatureTonic = (tonic: string, mode: Mode) => {
  const pitchClass = pitchClassOf(tonic);
  if (mode === 'major' || pitchClass < 0) return tonic;
  return PITCH_CLASSES[(pitchClass + 3) % 12];
};
