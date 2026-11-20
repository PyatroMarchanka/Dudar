import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { getBarTicks, MAX_ROLL_BARS, MAX_ROLL_NOTES, MelodyRoll, ROLL_PPQ, RollNote, transposeToKey } from '../midiUtils/melodyRoll';
import { RecognizedNote } from './recognize';

export interface QuantizeOptions {
  bagpipeType: BagpipeTypes;
  timeSignature: TimeSignatures;
  // Quarter notes per minute
  bpm: number;
  // Seconds into the recording where the metronome's first click was heard
  firstBeatSeconds: number;
  // The shortest note length, in ticks (120 = 1/16 at 480 ticks per quarter)
  gridTicks: number;
  // Semitones between the written notes and the pipe, from the recognition
  keyTranspose: number;
}

// A gap longer than this between two notes is a real rest
const REST_SECONDS = 0.12;
// Latency left over after the recorder's own estimate is found from the notes
// themselves, but never more than this
const MAX_TIME_SHIFT_SECONDS = 0.12;

// Seconds per metronome click: quarters for x/4, eighths for x/8
export const getClickSeconds = (bpm: number, timeSignature: TimeSignatures) => {
  const unit = Number(timeSignature.split('/')[1]);
  return (60 / bpm) * (4 / unit);
};

// The shortest note in seconds for a grid, used to tell notes from ornaments
export const gridSeconds = (bpm: number, gridTicks: number) => ((60 / bpm) * gridTicks) / ROLL_PPQ;

// Turns notes measured in seconds into a melody on the metronome's grid. The
// first bar with a note becomes bar 1.
export const quantizeNotes = (notes: RecognizedNote[], options: QuantizeOptions): MelodyRoll => {
  const { bagpipeType, timeSignature, bpm, firstBeatSeconds, gridTicks, keyTranspose } = options;
  const ticksPerSecond = (ROLL_PPQ * bpm) / 60;
  const barTicks = getBarTicks({ timeSignature, ppq: ROLL_PPQ });
  const toTicks = (seconds: number) => (seconds - firstBeatSeconds) * ticksPerSecond;
  const snap = (ticks: number) => Math.round(ticks / gridTicks) * gridTicks;

  const roll: MelodyRoll = {
    version: 1,
    bagpipeType,
    timeSignature,
    bpm,
    ppq: ROLL_PPQ,
    bars: 1,
    notes: [],
    tonic: transposeToKey(keyTranspose),
  };
  if (!notes.length) return roll;

  // Players are a little early or late against the click, and the recorder's
  // latency is only estimated: shift everything by the amount that puts the
  // note starts closest to the grid
  const starts = notes.map((note) => toTicks(note.start));
  const maxShift = Math.min(MAX_TIME_SHIFT_SECONDS * ticksPerSecond, gridTicks * 0.45);
  let shift = 0;
  let bestCost = Infinity;
  const steps = 40;
  for (let i = -steps; i <= steps; i++) {
    const candidate = (maxShift * i) / steps;
    const cost =
      starts.reduce((sum, start) => {
        const distance = start + candidate - snap(start + candidate);
        return sum + distance * distance;
      }, 0) +
      notes.length * 0.05 * candidate * candidate;
    if (cost < bestCost) {
      bestCost = cost;
      shift = candidate;
    }
  }

  const snapped = starts.map((start) => snap(start + shift));
  for (let i = 1; i < snapped.length; i++) {
    // Two notes on one grid line: the later one moves to the next line
    if (snapped[i] <= snapped[i - 1]) snapped[i] = snapped[i - 1] + gridTicks;
  }

  const rollNotes: RollNote[] = notes.map((note, i) => {
    const start = snapped[i];
    const nextStart = snapped[i + 1];
    const restAfter = notes[i + 1] ? notes[i + 1].start - note.end > REST_SECONDS : true;
    let end = restAfter ? snap(toTicks(note.end) + shift) : nextStart;
    if (nextStart !== undefined) end = Math.min(end, nextStart);
    end = Math.max(end, start + gridTicks);
    if (nextStart !== undefined) end = Math.min(end, nextStart);
    return [note.pitch, start, end - start];
  });

  // The first bar with a note becomes bar 1 (also when the melody started
  // before the first click)
  const offset = Math.floor(rollNotes[0][1] / barTicks) * barTicks;
  const moved = rollNotes
    .map(([pitch, start, duration]): RollNote => [pitch, start - offset, duration])
    .filter(([pitch, , duration]) => pitch >= 0 && pitch <= 127 && duration > 0)
    .slice(0, MAX_ROLL_NOTES);
  const lastEnd = Math.max(...moved.map(([, start, duration]) => start + duration));
  const bars = Math.min(MAX_ROLL_BARS, Math.max(1, Math.ceil(lastEnd / barTicks)));
  const barsEnd = bars * barTicks;

  return { ...roll, bars, notes: moved.filter(([, start]) => start < barsEnd) };
};
