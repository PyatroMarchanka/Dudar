import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import {
  getBarTicks,
  MAX_ROLL_BARS,
  MAX_ROLL_NOTES,
  MelodyRoll,
  ROLL_PPQ,
  RollNote,
  transposeToKey,
} from '../midiUtils/melodyRoll';
import { RecognizedNote } from './recognize';

export interface QuantizeOptions {
  bagpipeType: BagpipeTypes;
  timeSignature: TimeSignatures;
  // Quarter notes per minute
  bpm: number;
  // The shortest note length allowed, in ticks (120 = 1/16 at 480 ticks per quarter)
  gridTicks: number;
  // Semitones between the written notes and the pipe, from the recognition
  keyTranspose: number;
}

// How much worse a note start is for each step away from the beat (beat, 1/8,
// 1/16, 1/32 of a beat...), in beats of timing error. Melodies mostly move on
// the beat, so a note only goes off the beat when it was clearly played there.
const LEVEL_PENALTY_BEATS = 0.06;
// How far everything may be moved together to sit better on the beat
const MAX_SHIFT_BEATS = 0.2;

// Seconds per metronome click: quarters for x/4, eighths for x/8
export const getClickSeconds = (bpm: number, timeSignature: TimeSignatures) => {
  const unit = Number(timeSignature.split('/')[1]);
  return (60 / bpm) * (4 / unit);
};

// Seconds of a note value at a tempo: 1/32 is noteSeconds(bpm, 32)
export const noteSeconds = (bpm: number, value: number) => (60 / bpm) * (4 / value);

// Turns notes measured in seconds into a melody:
// - the first clear note (at least a 1/16 long) starts bar 1 on beat 1, and
//   anything before it is dropped;
// - a bagpipe never stops, so every note lasts until the next one (no rests);
// - note starts go to the nearest grid line, preferring beats, then eighths,
//   then sixteenths, so a melody doesn't drift off the beat.
export const quantizeNotes = (measured: RecognizedNote[], options: QuantizeOptions): MelodyRoll => {
  const { bagpipeType, timeSignature, bpm, gridTicks, keyTranspose } = options;
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

  const firstClear = measured.findIndex((note) => note.end - note.start >= noteSeconds(bpm, 16));
  if (firstClear < 0) return roll;
  const notes = measured.slice(firstClear);

  const ticksPerSecond = (ROLL_PPQ * bpm) / 60;
  const beatTicks = (ROLL_PPQ * 4) / Number(timeSignature.split('/')[1]);
  const barTicks = getBarTicks({ timeSignature, ppq: ROLL_PPQ });
  const origin = notes[0].start;
  const starts = notes.map((note) => (note.start - origin) * ticksPerSecond);

  // 0 on a beat, 1 on an eighth of it, 2 on a sixteenth...
  const level = (tick: number) => {
    let step = beatTicks;
    for (let depth = 0; depth < 6; depth++, step /= 2) {
      if (Math.abs(tick / step - Math.round(tick / step)) < 1e-6) return depth;
    }
    return 6;
  };
  // The best grid line for a start, and how bad it is
  const place = (tick: number) => {
    let best = Math.round(tick / gridTicks) * gridTicks;
    let bestCost = Infinity;
    for (let k = Math.floor(tick / gridTicks) - 4; k <= Math.ceil(tick / gridTicks) + 4; k++) {
      const candidate = k * gridTicks;
      const cost = Math.abs(tick - candidate) / beatTicks + LEVEL_PENALTY_BEATS * level(candidate);
      if (cost < bestCost) {
        bestCost = cost;
        best = candidate;
      }
    }
    return { tick: best, cost: bestCost };
  };

  // Players run a little early or late: move everything by the amount that
  // puts the notes best on the beat
  let shift = 0;
  let bestTotal = Infinity;
  const steps = 40;
  for (let i = -steps; i <= steps; i++) {
    const candidate = (MAX_SHIFT_BEATS * beatTicks * i) / steps;
    const total = starts.reduce((sum, start) => sum + place(start + candidate).cost, 0);
    if (total < bestTotal - 1e-9) {
      bestTotal = total;
      shift = candidate;
    }
  }

  // Two notes on one grid line: the one that sounded shorter goes
  const placed: { pitch: number; tick: number; seconds: number }[] = [];
  notes.forEach((note, i) => {
    const tick = place(starts[i] + shift).tick;
    const seconds = note.end - note.start;
    const last = placed[placed.length - 1];
    if (last && tick <= last.tick) {
      if (seconds > last.seconds) {
        last.pitch = note.pitch;
        last.seconds = seconds;
      }
      return;
    }
    placed.push({ pitch: note.pitch, tick, seconds });
  });

  // The first note starts bar 1
  const offset = placed[0].tick;
  const lastNote = notes[notes.length - 1];
  const lastEnd = Math.max(
    placed[placed.length - 1].tick + gridTicks,
    place((lastNote.end - origin) * ticksPerSecond + shift).tick
  );
  const rollNotes: RollNote[] = placed
    .map(({ pitch, tick }, i): RollNote => {
      const end = i + 1 < placed.length ? placed[i + 1].tick : lastEnd;
      return [pitch, tick - offset, end - tick];
    })
    .filter(([pitch]) => pitch >= 0 && pitch <= 127)
    .slice(0, MAX_ROLL_NOTES);

  const end = Math.max(...rollNotes.map(([, start, duration]) => start + duration));
  const bars = Math.min(MAX_ROLL_BARS, Math.max(1, Math.ceil(end / barTicks)));
  return { ...roll, bars, notes: rollNotes.filter(([, start]) => start < bars * barTicks) };
};
