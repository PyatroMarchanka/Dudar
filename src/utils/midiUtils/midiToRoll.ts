import { Midi } from '@tonejs/midi';
import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { fixMidiDataOctaves } from './fixMidiDataOctaves';
import {
  getBarTicks,
  MAX_ROLL_BARS,
  MAX_ROLL_BPM,
  MAX_ROLL_NOTES,
  MelodyRoll,
  MIN_ROLL_BPM,
  ROLL_PPQ,
  ROLL_TIME_SIGNATURES,
  RollNote,
} from './melodyRoll';

export interface MidiToRollOptions {
  bagpipeType: BagpipeTypes;
  // From the catalog song: they decide how it is played, the file's own events don't
  timeSignature: TimeSignatures;
  // Real quarter notes per minute. The song's originalTempo is double this.
  bpm?: number;
}

export interface MidiToRollResult {
  roll: MelodyRoll;
  // Things the conversion could not keep, for the admin to see before saving
  warnings: string[];
}

const DEFAULT_BPM = 100;

// Turns a catalog .mid file into the notes the editor works with. The notes
// are what the player plays from the file: the first track that has notes,
// with the lowest octave moved to 4 like prepareSongMidi does, so the result
// sounds and is fingered the same. Throws when the file can't be expressed as
// a roll.
export const midiToRoll = (
  buffer: ArrayBuffer,
  { bagpipeType, timeSignature, bpm }: MidiToRollOptions
): MidiToRollResult => {
  if (!ROLL_TIME_SIGNATURES.includes(timeSignature)) {
    throw new Error(`The editor doesn't support ${timeSignature} yet`);
  }

  const midi = new Midi(buffer);
  const tracksWithNotes = midi.tracks.filter((track) => track.notes.length);
  if (!tracksWithNotes.length) {
    throw new Error('The MIDI file has no notes');
  }

  const warnings: string[] = [];
  if (tracksWithNotes.length > 1) {
    warnings.push(`${tracksWithNotes.length} tracks have notes: only the first one is kept, as in the player.`);
  }
  if (midi.header.tempos.length > 1) {
    warnings.push('The file changes tempo: the editor has one tempo for the whole melody.');
  }

  // Same shift the player applies on load
  fixMidiDataOctaves(midi);
  const notes = midi.tracks.find((track) => track.notes.length)!.notes;

  const scale = ROLL_PPQ / midi.header.ppq;
  const rollNotes: RollNote[] = notes
    .map(
      (note): RollNote => [
        note.midi,
        Math.round(note.ticks * scale),
        Math.max(1, Math.round(note.durationTicks * scale)),
      ]
    )
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);

  if (rollNotes.length > MAX_ROLL_NOTES) {
    throw new Error(`Too many notes for the editor (${rollNotes.length}, max ${MAX_ROLL_NOTES})`);
  }
  if (rollNotes.some(([pitch]) => pitch < 0 || pitch > 127)) {
    throw new Error('The file has notes outside the MIDI range');
  }

  const overlapping = rollNotes.filter(
    (note, index) => index > 0 && note[1] < rollNotes[index - 1][1] + rollNotes[index - 1][2] - 1
  );
  if (overlapping.length) {
    warnings.push(`${overlapping.length} notes overlap the note before them.`);
  }

  const barTicks = getBarTicks({ timeSignature, ppq: ROLL_PPQ });
  const end = Math.max(...rollNotes.map(([, start, duration]) => start + duration));
  const bars = Math.max(1, Math.ceil(end / barTicks));
  if (bars > MAX_ROLL_BARS) {
    throw new Error(`Too long for the editor (${bars} bars, max ${MAX_ROLL_BARS})`);
  }

  const fileBpm = midi.header.tempos[0]?.bpm;
  const rawBpm = bpm ?? fileBpm ?? DEFAULT_BPM;
  const finalBpm = Math.min(MAX_ROLL_BPM, Math.max(MIN_ROLL_BPM, Math.round(rawBpm)));

  return {
    roll: { version: 1, bagpipeType, timeSignature, bpm: finalBpm, ppq: ROLL_PPQ, bars, notes: rollNotes },
    warnings,
  };
};
