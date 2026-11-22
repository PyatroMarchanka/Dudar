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
  // The shortest melody note allowed, in ticks (120 = 1/16 at 480 ticks per quarter)
  gridTicks: number;
  // Semitones between the written notes and the pipe, from the recognition
  keyTranspose: number;
}

// How much worse a note start is for each step away from the beat (beat, 1/8,
// 1/16 of a beat...), in beats of timing error. Melodies mostly move on the
// beat, so a note only goes off the beat when it was clearly played there.
const LEVEL_PENALTY_BEATS = 0.06;
// How far everything may be moved together to sit better on the beat
const MAX_SHIFT_BEATS = 0.2;
// A note shorter than this share of a 1/16 is an embellishment (grace note, cut)
const ORNAMENT_SIXTEENTH_SHARE = 0.65;
// Embellishments are written as 1/32 notes
const ORNAMENT_TICKS = ROLL_PPQ / 8;
// The tempo search range (quarter notes per minute) and where tunes usually are
const MIN_TEMPO = 50;
const MAX_TEMPO = 200;
const USUAL_TEMPO = 100;

// Seconds per metronome click: quarters for x/4, eighths for x/8
export const getClickSeconds = (bpm: number, timeSignature: TimeSignatures) => {
  const unit = Number(timeSignature.split('/')[1]);
  return (60 / bpm) * (4 / unit);
};

// Seconds of a note value at a tempo: 1/32 is noteSeconds(bpm, 32)
export const noteSeconds = (bpm: number, value: number) => (60 / bpm) * (4 / value);

const beatTicksOf = (timeSignature: TimeSignatures) => (ROLL_PPQ * 4) / Number(timeSignature.split('/')[1]);

// 0 on a beat, 1 on an eighth of it, 2 on a sixteenth...
const levelOf = (tick: number, beatTicks: number) => {
  let step = beatTicks;
  for (let depth = 0; depth < 6; depth++, step /= 2) {
    if (Math.abs(tick / step - Math.round(tick / step)) < 1e-6) return depth;
  }
  return 6;
};

// Finds the tempo a melody was played at (quarter notes per minute): the one
// where the note starts sit best on beats, eighths and sixteenths, keeping to
// the tempos tunes are usually played at when two fit about equally well
// (twice or half the tempo fits a melody almost as well as the right one).
export const estimateTempo = (measured: RecognizedNote[], timeSignature: TimeSignatures = '4/4'): number => {
  // Short notes (embellishments) say little about the beat
  const onsets = measured.filter((note) => note.end - note.start >= 0.09).map((note) => note.start);
  if (onsets.length < 4) return USUAL_TEMPO;
  const unitQuarters = 4 / Number(timeSignature.split('/')[1]);
  const origin = onsets[0];

  let best = { bpm: USUAL_TEMPO, cost: Infinity };
  for (let bpm = MIN_TEMPO; bpm <= MAX_TEMPO; bpm += 0.5) {
    // Seconds per beat (a quarter for x/4, an eighth for x/8)
    const beat = (60 / bpm) * unitQuarters;
    let bestShift = Infinity;
    for (let s = -10; s <= 10; s++) {
      const shift = (MAX_SHIFT_BEATS * s) / 10;
      let total = 0;
      for (const onset of onsets) {
        const position = (onset - origin) / beat + shift;
        let cost = Infinity;
        for (let depth = 0; depth <= 2; depth++) {
          const step = 1 / 2 ** depth;
          const error = Math.abs(position - Math.round(position / step) * step);
          cost = Math.min(cost, error + LEVEL_PENALTY_BEATS * depth);
        }
        total += cost;
      }
      bestShift = Math.min(bestShift, total);
    }
    // Far from the usual tempos: only if clearly better
    const away = Math.max(0, Math.abs(Math.log2(bpm / USUAL_TEMPO)) - 0.45);
    const cost = bestShift / onsets.length + 0.08 * away;
    if (cost < best.cost) best = { bpm, cost };
  }
  return Math.round(best.bpm);
};

// Turns notes measured in seconds into a melody:
// - the first clear note (not an embellishment) starts bar 1 on beat 1, and
//   anything before it is dropped;
// - a bagpipe never stops, so every note lasts until the next one (no rests);
// - note starts go to the nearest grid line, preferring beats (most for long
//   notes), then eighths, then sixteenths, so a melody doesn't drift off the
//   beat. Triplets are never made: everything is in halves;
// - a note too short to be a melody note is an embellishment: it becomes a
//   1/32 note just before the note it leads to, taking its time from the note
//   before.
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

  const ornamentSeconds = noteSeconds(bpm, 16) * ORNAMENT_SIXTEENTH_SHARE;
  const isOrnament = (note: RecognizedNote) => note.end - note.start < ornamentSeconds;
  const firstClear = measured.findIndex((note) => !isOrnament(note));
  if (firstClear < 0) return roll;
  const notes = measured.slice(firstClear);

  const ticksPerSecond = (ROLL_PPQ * bpm) / 60;
  const beatTicks = beatTicksOf(timeSignature);
  const barTicks = getBarTicks({ timeSignature, ppq: ROLL_PPQ });
  const origin = notes[0].start;

  // The melody notes (the embellishments come back in below)
  const main = notes.filter((note) => !isOrnament(note));
  const starts = main.map((note) => (note.start - origin) * ticksPerSecond);
  // Long notes care most about being on the beat
  const weights = main.map((note) => 0.5 + 1.5 * Math.min(1, ((note.end - note.start) * ticksPerSecond) / beatTicks));

  // The best grid line for a start, and how bad it is
  const place = (tick: number, weight: number) => {
    let best = Math.round(tick / gridTicks) * gridTicks;
    let bestCost = Infinity;
    for (let k = Math.floor(tick / gridTicks) - 4; k <= Math.ceil(tick / gridTicks) + 4; k++) {
      const candidate = k * gridTicks;
      const cost =
        Math.abs(tick - candidate) / beatTicks + LEVEL_PENALTY_BEATS * weight * levelOf(candidate, beatTicks);
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
    const total = starts.reduce((sum, start, n) => sum + place(start + candidate, weights[n]).cost, 0);
    if (total < bestTotal - 1e-9) {
      bestTotal = total;
      shift = candidate;
    }
  }

  // Two notes on one grid line: the one that sounded shorter goes
  const placed: { pitch: number; tick: number; seconds: number; source: RecognizedNote }[] = [];
  main.forEach((note, i) => {
    const tick = place(starts[i] + shift, weights[i]).tick;
    const seconds = note.end - note.start;
    const last = placed[placed.length - 1];
    if (last && tick <= last.tick) {
      if (seconds > last.seconds) {
        last.pitch = note.pitch;
        last.seconds = seconds;
        last.source = note;
      }
      return;
    }
    placed.push({ pitch: note.pitch, tick, seconds, source: note });
  });

  // Embellishments go just before the melody note that follows them
  const out: { pitch: number; tick: number }[] = [];
  placed.forEach((current, i) => {
    const previous = placed[i - 1];
    if (previous) {
      const between = notes.filter(
        (note) => isOrnament(note) && note.start >= previous.source.start && note.start < current.source.start
      );
      // Room: the note before keeps at least a 1/16
      const room = Math.floor((current.tick - previous.tick - gridTicks) / ORNAMENT_TICKS);
      const count = Math.max(0, Math.min(between.length, room));
      between.slice(between.length - count).forEach((note, n) => {
        out.push({ pitch: note.pitch, tick: current.tick - (count - n) * ORNAMENT_TICKS });
      });
    }
    out.push({ pitch: current.pitch, tick: current.tick });
  });

  const offset = out[0].tick;
  const lastNote = notes[notes.length - 1];
  const lastEnd = Math.max(out[out.length - 1].tick + gridTicks, place((lastNote.end - origin) * ticksPerSecond + shift, 1).tick);
  const rollNotes: RollNote[] = out
    .map(({ pitch, tick }, i): RollNote => {
      const end = i + 1 < out.length ? out[i + 1].tick : lastEnd;
      return [pitch, tick - offset, end - tick];
    })
    .filter(([pitch]) => pitch >= 0 && pitch <= 127)
    .slice(0, MAX_ROLL_NOTES);

  const end = Math.max(...rollNotes.map(([, start, duration]) => start + duration));
  const bars = Math.min(MAX_ROLL_BARS, Math.max(1, Math.ceil(end / barTicks)));
  return { ...roll, bars, notes: rollNotes.filter(([, start]) => start < bars * barTicks) };
};
