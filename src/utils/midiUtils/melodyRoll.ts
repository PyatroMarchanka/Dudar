import { Midi } from '@tonejs/midi';
import { IStats, Song, TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';

// A melody drawn in the piano-roll editor (My melodies). It's stored as notes
// rather than ABC, so nothing is lost or re-rounded between saves, and turned
// into MIDI in the browser when played (rollToMidi).

// [pitch, startTick, durationTicks]. Pitches are MIDI numbers written for an A
// instrument, like the catalog .mid files, so transpose works the same way.
export type RollNote = [number, number, number];

export interface MelodyRoll {
  version: 1;
  // The bagpipe whose hole lines the melody was written on
  bagpipeType: BagpipeTypes;
  timeSignature: TimeSignatures;
  // Quarter notes per minute
  bpm: number;
  ppq: number;
  bars: number;
  notes: RollNote[];
  // Pitch class of the key's tonic (0 = C), written for an A instrument like the
  // notes. Absent means A, the tonic of the bagpipes.
  tonic?: number;
}

export const ROLL_PPQ = 480;
export const DEFAULT_ROLL_BPM = 100;
export const MIN_ROLL_BPM = 20;
export const MAX_ROLL_BPM = 400;
const DEFAULT_BARS = 4;
export const DEFAULT_TONIC = 9;

export const getTonic = (roll: Pick<MelodyRoll, 'tonic'>) => roll.tonic ?? DEFAULT_TONIC;
// Same caps as the server
export const MAX_ROLL_NOTES = 3_000;
export const MAX_ROLL_BARS = 500;

// Meters that have a public/midi/common/metronome-X-Y.mid file
export const ROLL_TIME_SIGNATURES: TimeSignatures[] = ['3/4', '4/4', '5/4', '6/4', '6/8', '7/8', '9/8', '11/8'];

export const createRoll = (bagpipeType: BagpipeTypes): MelodyRoll => ({
  version: 1,
  bagpipeType,
  timeSignature: '4/4',
  bpm: DEFAULT_ROLL_BPM,
  ppq: ROLL_PPQ,
  bars: DEFAULT_BARS,
  notes: [],
});

export const getBarTicks = ({ timeSignature, ppq }: Pick<MelodyRoll, 'timeSignature' | 'ppq'>) => {
  const [num, den] = timeSignature.split('/').map(Number);
  return (num * 4 * ppq) / den;
};

export const getRollEnd = (roll: MelodyRoll) => roll.bars * getBarTicks(roll);

const noteEnd = (note: RollNote) => note[1] + note[2];

const byStart = (a: RollNote, b: RollNote) => a[1] - b[1];

// Enough bars to hold every note, and never fewer than before
const fitBars = (roll: MelodyRoll): MelodyRoll => {
  const lastEnd = roll.notes.reduce((max, note) => Math.max(max, noteEnd(note)), 0);
  const needed = Math.ceil(lastEnd / getBarTicks(roll));
  return needed > roll.bars ? { ...roll, bars: Math.min(needed, MAX_ROLL_BARS) } : roll;
};

// A chanter plays one note at a time, so a new note replaces the notes that
// start inside it and cuts short the one that is still sounding when it starts.
// Returns the new roll and the index of the added note.
export const addNote = (roll: MelodyRoll, pitch: number, tick: number, duration: number) => {
  const end = tick + duration;
  const kept = roll.notes
    .filter((note) => note[1] < tick || note[1] >= end)
    .map((note): RollNote => (note[1] < tick && noteEnd(note) > tick ? [note[0], note[1], tick - note[1]] : note));
  const added: RollNote = [pitch, tick, duration];
  const notes = [...kept, added].sort(byStart);
  return { roll: fitBars({ ...roll, notes }), index: notes.indexOf(added) };
};

export const removeNote = (roll: MelodyRoll, index: number): MelodyRoll => ({
  ...roll,
  notes: roll.notes.filter((_, i) => i !== index),
});

// Changes a note's pitch and/or length, with the same overlap rules as adding it
export const updateNote = (roll: MelodyRoll, index: number, change: { pitch?: number; duration?: number }) => {
  const [pitch, tick, duration] = roll.notes[index];
  return addNote(removeNote(roll, index), change.pitch ?? pitch, tick, change.duration ?? duration);
};

// The grid line nearest to `tick`, counted from the start of its bar. The bar's
// end counts as a line too, for grids that don't divide the bar (1/4 in 7/8).
export const roundToGrid = (tick: number, grid: number, barTicks: number) => {
  const barStart = Math.floor(tick / barTicks) * barTicks;
  const onGrid = barStart + Math.round((tick - barStart) / grid) * grid;
  const barEnd = barStart + barTicks;
  return Math.abs(barEnd - tick) < Math.abs(onGrid - tick) || onGrid > barEnd ? barEnd : onGrid;
};

// What part of a note is dragged: the whole note, or its start or end edge
export type NoteDragMode = 'move' | 'start' | 'end';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Where a note lands when dragged `delta` ticks, snapped to the grid. It may
// push into the notes next to it, which then get shorter (see setNoteTiming),
// but never so far that they would disappear. Returns [tick, duration].
export const dragNoteTiming = (
  roll: MelodyRoll,
  index: number,
  mode: NoteDragMode,
  delta: number,
  grid: number
): [number, number] => {
  const [, tick, duration] = roll.notes[index];
  const end = tick + duration;
  const barTicks = getBarTicks(roll);
  const previous = roll.notes[index - 1];
  const next = roll.notes[index + 1];
  // A note never shrinks below one grid step, unless it was already shorter
  const minLengthOf = (note: RollNote) => Math.min(grid, note[2]);
  const minStart = previous ? previous[1] + minLengthOf(previous) : 0;
  const maxEnd = next ? noteEnd(next) - minLengthOf(next) : MAX_ROLL_BARS * barTicks;
  const minLength = Math.min(grid, duration);

  if (mode === 'start') {
    const start = clamp(roundToGrid(tick + delta, grid, barTicks), minStart, end - minLength);
    return [start, end - start];
  }
  if (mode === 'end') {
    const newEnd = clamp(roundToGrid(end + delta, grid, barTicks), tick + minLength, maxEnd);
    return [tick, newEnd - tick];
  }
  const start = clamp(roundToGrid(tick + delta, grid, barTicks), minStart, maxEnd - duration);
  return [start, duration];
};

// Sets a note's start and length, as given by dragNoteTiming. The note before
// it ends where it starts and the note after it starts where it ends, if they overlapped.
export const setNoteTiming = (roll: MelodyRoll, index: number, tick: number, duration: number): MelodyRoll => {
  const end = tick + duration;
  const notes = roll.notes.map((note, i): RollNote => {
    if (i === index) return [note[0], tick, duration];
    if (i === index - 1 && noteEnd(note) > tick) return [note[0], note[1], tick - note[1]];
    if (i === index + 1 && note[1] < end) return [note[0], end, noteEnd(note) - end];
    return note;
  });
  return fitBars({ ...roll, notes });
};

// The note that sounds at `tick` on one of `pitches` (the notes of a hole line)
export const findNoteAt = (roll: MelodyRoll, tick: number, pitches: number[]) =>
  roll.notes.findIndex((note) => pitches.includes(note[0]) && note[1] <= tick && noteEnd(note) > tick);

// Inserts empty bars before bar `atBar` (0-based), moving later notes along
export const insertBars = (roll: MelodyRoll, atBar: number, count: number): MelodyRoll => {
  const added = Math.min(count, MAX_ROLL_BARS - roll.bars);
  if (added <= 0) return roll;
  const atTick = atBar * getBarTicks(roll);
  const shift = added * getBarTicks(roll);
  return {
    ...roll,
    bars: roll.bars + added,
    notes: roll.notes.map((note): RollNote => (note[1] >= atTick ? [note[0], note[1] + shift, note[2]] : note)),
  };
};

// Removes `count` bars starting at bar `fromBar` (0-based) with their notes.
// A note running into them from before is cut at their start.
export const removeBars = (roll: MelodyRoll, fromBar: number, count: number): MelodyRoll => {
  const removed = Math.min(count, roll.bars - 1);
  if (removed <= 0) return roll;
  const barTicks = getBarTicks(roll);
  const from = fromBar * barTicks;
  const to = from + removed * barTicks;
  const notes = roll.notes
    .filter((note) => note[1] < from || note[1] >= to)
    .map((note): RollNote => {
      if (note[1] >= to) return [note[0], note[1] - (to - from), note[2]];
      if (noteEnd(note) > from) return [note[0], note[1], from - note[1]];
      return note;
    });
  return { ...roll, bars: roll.bars - removed, notes };
};

// Bars copied in the editor: their notes, counted from the start of the first one
export interface BarsClip {
  ticks: number;
  notes: RollNote[];
}

// Copies `count` bars starting at bar `fromBar` (0-based). A note running past
// the last of them is cut at its end.
export const copyBars = (roll: MelodyRoll, fromBar: number, count: number): BarsClip => {
  const barTicks = getBarTicks(roll);
  const from = fromBar * barTicks;
  const to = from + Math.max(1, Math.min(count, roll.bars - fromBar)) * barTicks;
  const notes = roll.notes
    .filter((note) => note[1] >= from && note[1] < to)
    .map((note): RollNote => [note[0], note[1] - from, Math.min(noteEnd(note), to) - note[1]]);
  return { ticks: to - from, notes };
};

// Puts copied bars at bar `atBar` (0-based), replacing what was there. Adds bars
// when they run past the end, and cuts short a note sounding into them.
export const pasteBars = (roll: MelodyRoll, clip: BarsClip, atBar: number): MelodyRoll => {
  const barTicks = getBarTicks(roll);
  const from = atBar * barTicks;
  const to = Math.min(from + clip.ticks, MAX_ROLL_BARS * barTicks);
  const kept = roll.notes
    .filter((note) => note[1] < from || note[1] >= to)
    .map((note): RollNote => (note[1] < from && noteEnd(note) > from ? [note[0], note[1], from - note[1]] : note));
  const pasted = clip.notes
    .filter((note) => from + note[1] < to)
    .map((note): RollNote => [note[0], from + note[1], Math.min(note[2], to - from - note[1])]);
  const bars = Math.max(roll.bars, Math.ceil(to / barTicks));
  return { ...roll, bars, notes: [...kept, ...pasted].sort(byStart) };
};

// Notes keep their place in time; the number of bars follows the new bar length
export const setTimeSignature = (roll: MelodyRoll, timeSignature: TimeSignatures): MelodyRoll => {
  const total = getRollEnd(roll);
  const next = { ...roll, timeSignature };
  return fitBars({ ...next, bars: Math.max(1, Math.round(total / getBarTicks(next))) });
};

export const isRollEmpty = (roll: MelodyRoll) => !roll.notes.length;

// Loose check for a roll read back from storage or the server
export const isMelodyRoll = (value: any): value is MelodyRoll =>
  !!value &&
  value.version === 1 &&
  typeof value.bagpipeType === 'string' &&
  ROLL_TIME_SIGNATURES.includes(value.timeSignature) &&
  Number.isFinite(value.bpm) &&
  Number.isFinite(value.ppq) &&
  Number.isInteger(value.bars) &&
  Array.isArray(value.notes) &&
  (value.tonic === undefined || (Number.isInteger(value.tonic) && value.tonic >= 0 && value.tonic <= 11));

const emptyStats = (): IStats => ({
  views: 0,
  likes: 0,
  lastViewed: new Date(),
});

// Catalog notes end one tick before the next one starts (see normalizeAbcMidi)
const GAP_TICKS = 1;

export interface RollSongResult {
  buffer: ArrayBuffer;
  song: Song;
}

// Builds a MIDI file shaped like the catalog ones (no tempo event: the player
// takes the tempo from the song) plus a synthetic Song, for prepareSongMidi.
export const rollToMidi = (roll: MelodyRoll, title: string): RollSongResult => {
  if (!roll.notes.length) {
    throw new Error('The melody has no notes');
  }
  const midi = new Midi();
  // Ticks are rescaled, so any stored ppq plays at the right speed
  const scale = midi.header.ppq / roll.ppq;
  const [num, den] = roll.timeSignature.split('/').map(Number);
  midi.header.timeSignatures.push({ ticks: 0, timeSignature: [num, den] });
  const track = midi.addTrack();
  roll.notes.forEach(([pitch, tick, duration]) => {
    const durationTicks = Math.round(duration * scale);
    track.addNote({
      midi: pitch,
      ticks: Math.round(tick * scale),
      durationTicks: durationTicks > GAP_TICKS ? durationTicks - GAP_TICKS : durationTicks,
      velocity: 0.8,
    });
  });

  const song: Song = {
    id: 'melody',
    name: title,
    type: 'other',
    bagpipesToPlay: [roll.bagpipeType],
    timeSignature: roll.timeSignature,
    pathName: '',
    labels: [],
    // prepareSongMidi halves originalTempo, like for catalog songs
    originalTempo: Math.round(roll.bpm * 2),
    links: [],
    stats: emptyStats(),
  };

  const array = midi.toArray();
  return { buffer: array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength) as ArrayBuffer, song };
};
