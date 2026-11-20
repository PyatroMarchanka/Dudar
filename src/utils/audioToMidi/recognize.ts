import { notesMaps } from '../../dataset/bagpipesNotesMaps';
import { BagpipeTypes, SharpNotesEnum } from '../../interfaces';
import { convertNoteToMidiPitch } from '../midiUtils/noteUtils';
import { fft } from './fft';

// Finds the notes of a bagpipe melody in a mono recording.
//
// We know which bagpipe is playing, so instead of asking "which of all notes is
// this?" every moment is matched against the few notes that chanter can play.
// That makes it work on pipes that aren't tuned to A = 440 and with the drones
// sounding: the drones never change, so the steady part of the spectrum is
// removed before looking for the chanter.

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

const TARGET_RATE = 16000;
const HOP_SECONDS = 0.01;
const WINDOW = 512;
const MAX_FREQ = 5000;
const HARMONIC_WEIGHTS = [1, 0.8, 0.6, 0.5];
const GRID_LOW = 45;
const GRID_HIGH = 100;
const GRID_STEP = 0.1;
// How far a played note may be from its equal-tempered pitch (semitones).
// Bagpipe scales are not equal-tempered: some notes sit 15-30 cents off.
const NOTE_TOLERANCE = 0.35;
const SWITCH_PENALTY = 0.6;
const SILENCE_PENALTY = 0.8;
const MIN_SILENCE_SECONDS = 0.08;
const DEFAULT_MIN_NOTE_SECONDS = 0.06;

const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

const percentile = (values: ArrayLike<number>, p: number) => {
  if (!values.length) return 0;
  const sorted = Array.from(values).sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))];
};

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));

// Averages groups of samples: a rough low-pass and a lower rate in one step
const downsample = (samples: Float32Array, sampleRate: number) => {
  const factor = Math.max(1, Math.round(sampleRate / TARGET_RATE));
  if (factor === 1) return { data: samples, rate: sampleRate };
  const data = new Float32Array(Math.floor(samples.length / factor));
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < factor; j++) sum += samples[i * factor + j];
    data[i] = sum / factor;
  }
  return { data, rate: sampleRate / factor };
};

// The notes the bagpipe can play, written for an A instrument
export const getBagpipePitches = (bagpipeType: BagpipeTypes) =>
  Object.keys(notesMaps[bagpipeType] ?? {})
    .map((note) => convertNoteToMidiPitch(note as SharpNotesEnum))
    .sort((a, b) => a - b);

export const recognizeNotes = async (
  samples: Float32Array,
  sampleRate: number,
  { bagpipeType, transpose, minNoteSeconds = DEFAULT_MIN_NOTE_SECONDS, onProgress }: RecognizeOptions
): Promise<Recognition> => {
  const empty: Recognition = {
    notes: [],
    ornaments: 0,
    keyTranspose: transpose,
    tuningOffset: 0,
    soundingSeconds: 0,
    fit: 0,
  };
  const written = getBagpipePitches(bagpipeType);
  const { data, rate } = downsample(samples, sampleRate);
  const hop = Math.max(1, Math.round(HOP_SECONDS * rate));
  const frameCount = data.length >= WINDOW ? Math.floor((data.length - WINDOW) / hop) + 1 : 0;
  if (!frameCount || !written.length) return empty;

  const binHz = rate / WINDOW;
  const bins = Math.min(WINDOW / 2, Math.floor(MAX_FREQ / binHz));
  const hann = new Float32Array(WINDOW).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (WINDOW - 1)));

  // 1. Spectrum of every frame (square root of the magnitude, to tame loud harmonics)
  const spectra = new Float32Array(frameCount * bins);
  const rms = new Float32Array(frameCount);
  const re = new Float32Array(WINDOW);
  const im = new Float32Array(WINDOW);
  for (let f = 0; f < frameCount; f++) {
    const offset = f * hop;
    let energy = 0;
    for (let i = 0; i < WINDOW; i++) {
      const value = data[offset + i];
      energy += value * value;
      re[i] = value * hann[i];
      im[i] = 0;
    }
    rms[f] = Math.sqrt(energy / WINDOW);
    fft(re, im);
    for (let b = 0; b < bins; b++) {
      spectra[f * bins + b] = Math.sqrt(Math.sqrt(re[b] * re[b] + im[b] * im[b]));
    }
    if (f % 2000 === 1999) {
      onProgress?.((0.6 * f) / frameCount);
      await yieldToBrowser();
    }
  }

  // 2. Frames where the bag is sounding at all
  const loud = percentile(rms, 0.95);
  if (loud < 1e-4) return empty;
  const sounding = Array.from(rms, (value) => value > loud * 0.08);

  // 3. Remove the drones: what every sounding frame has in common. A low
  // percentile, so a chanter note held for a long time isn't removed too.
  const soundingFrames = sounding.map((on, f) => (on ? f : -1)).filter((f) => f >= 0);
  const step = Math.max(1, Math.floor(soundingFrames.length / 3000));
  const sampled = soundingFrames.filter((_, i) => i % step === 0);
  const column = new Float32Array(sampled.length);
  const drone = new Float32Array(bins);
  for (let b = 0; b < bins; b++) {
    sampled.forEach((f, i) => (column[i] = spectra[f * bins + b]));
    drone[b] = percentile(column, 0.2);
  }
  for (let f = 0; f < frameCount; f++) {
    for (let b = 0; b < bins; b++) {
      const i = f * bins + b;
      spectra[i] = Math.max(0, spectra[i] - drone[b]);
    }
  }
  onProgress?.(0.7);
  await yieldToBrowser();

  // How strongly a frame has a note at `midi` (a fractional MIDI number):
  // the weighted sum of its first harmonics
  const salience = (f: number, midi: number) => {
    const hz = midiToHz(midi);
    let sum = 0;
    for (let h = 0; h < HARMONIC_WEIGHTS.length; h++) {
      const position = ((h + 1) * hz) / binHz;
      const low = Math.floor(position);
      if (low + 1 >= bins) break;
      const t = position - low;
      sum += HARMONIC_WEIGHTS[h] * (spectra[f * bins + low] * (1 - t) + spectra[f * bins + low + 1] * t);
    }
    return sum;
  };

  // 4. The strongest pitch of each sounding frame, on a fine grid
  const gridSize = Math.round((GRID_HIGH - GRID_LOW) / GRID_STEP) + 1;
  const bestPitch = new Float32Array(frameCount);
  const bestSalience = new Float32Array(frameCount);
  for (let f = 0; f < frameCount; f++) {
    if (!sounding[f]) continue;
    let best = 0;
    let bestIndex = 0;
    for (let g = 0; g < gridSize; g++) {
      const value = salience(f, GRID_LOW + g * GRID_STEP);
      if (value > best) {
        best = value;
        bestIndex = g;
      }
    }
    bestPitch[f] = GRID_LOW + bestIndex * GRID_STEP;
    bestSalience[f] = best;
  }
  onProgress?.(0.85);
  await yieldToBrowser();

  const strong = percentile(
    soundingFrames.map((f) => bestSalience[f]),
    0.95
  );
  const voiced = soundingFrames.filter((f) => bestSalience[f] > strong * 0.2);
  if (!voiced.length || strong <= 0) return empty;

  // 5. How the pipe is tuned: the average distance from the nearest semitone...
  let sin = 0;
  let cos = 0;
  voiced.forEach((f) => {
    const angle = 2 * Math.PI * (bestPitch[f] - Math.round(bestPitch[f]));
    sin += bestSalience[f] * Math.sin(angle);
    cos += bestSalience[f] * Math.cos(angle);
  });
  const tuningOffset = Math.atan2(sin, cos) / (2 * Math.PI);

  // ...and its key: the shift of the bagpipe's notes that explains the most
  // of what was heard, preferring the key in the settings
  const fitOf = (shift: number) => {
    let matched = 0;
    let total = 0;
    voiced.forEach((f) => {
      total += bestSalience[f];
      const near = written.some((pitch) => Math.abs(bestPitch[f] - (pitch + shift + tuningOffset)) < NOTE_TOLERANCE);
      if (near) matched += bestSalience[f];
    });
    return total ? matched / total : 0;
  };
  const shifts = new Set<number>();
  for (let s = transpose - 3; s <= transpose + 3; s++) [s - 12, s, s + 12].forEach((value) => shifts.add(value));
  let keyTranspose = transpose;
  let fit = -1;
  let bestScore = -Infinity;
  shifts.forEach((shift) => {
    const value = fitOf(shift);
    const score = value - 0.01 * Math.abs(shift - transpose);
    if (score > bestScore) {
      bestScore = score;
      fit = value;
      keyTranspose = shift;
    }
  });

  // 6. Each frame scored against the bagpipe's notes (plus "no note"), then the
  // most likely sequence (Viterbi), which ignores a frame or two of noise
  const candidates = written.map((pitch) => pitch + keyTranspose + tuningOffset);
  const states = candidates.length + 1;
  const silence = candidates.length;
  const scores = new Float32Array(frameCount * states);
  const floor = strong * 0.25;
  for (let f = 0; f < frameCount; f++) {
    const values = candidates.map((midi) => {
      let best = 0;
      for (let d = -0.3; d <= 0.301; d += 0.1) best = Math.max(best, salience(f, midi + d));
      return best;
    });
    const max = Math.max(...values);
    const quiet = !sounding[f] || max < strong * 0.12;
    const norm = Math.max(max, floor);
    values.forEach((value, k) => (scores[f * states + k] = (quiet ? 0.3 : 1) * (value / norm)));
    scores[f * states + silence] = quiet ? 1 : Math.min(1, Math.max(0, 1 - max / floor));
  }

  const back = new Int16Array(frameCount * states);
  let total = new Float32Array(states);
  for (let k = 0; k < states; k++) total[k] = scores[k];
  for (let f = 1; f < frameCount; f++) {
    const next = new Float32Array(states);
    for (let k = 0; k < states; k++) {
      let best = -Infinity;
      let from = 0;
      for (let j = 0; j < states; j++) {
        const penalty = j === k ? 0 : j === silence || k === silence ? SILENCE_PENALTY : SWITCH_PENALTY;
        const value = total[j] - penalty;
        if (value > best) {
          best = value;
          from = j;
        }
      }
      next[k] = best + scores[f * states + k];
      back[f * states + k] = from;
    }
    total = next;
  }
  const path = new Int16Array(frameCount);
  path[frameCount - 1] = total.indexOf(Math.max(...Array.from(total)));
  for (let f = frameCount - 1; f > 0; f--) path[f - 1] = back[f * states + path[f]];
  onProgress?.(0.95);

  // 7. Runs of one state become segments, with times in seconds
  const frameTime = (f: number) => (f * hop + WINDOW / 2) / rate;
  const segments: { state: number; start: number; end: number }[] = [];
  for (let f = 0; f < frameCount; f++) {
    const time = frameTime(f) - HOP_SECONDS / 2;
    const last = segments[segments.length - 1];
    if (last && last.state === path[f]) {
      last.end = time + HOP_SECONDS;
    } else {
      segments.push({ state: path[f], start: time, end: time + HOP_SECONDS });
    }
  }

  const { notes, ornaments } = cleanSegments(
    segments.map(({ state, start, end }) => ({
      pitch: state === silence ? null : written[state],
      start,
      end,
    })),
    minNoteSeconds
  );

  onProgress?.(1);
  return {
    notes,
    ornaments,
    keyTranspose,
    tuningOffset,
    soundingSeconds: (soundingFrames.length * hop) / rate,
    fit: Math.max(0, fit),
  };
};

export interface Segment {
  // Null for silence
  pitch: number | null;
  start: number;
  end: number;
}

// Turns raw segments into notes. A bagpipe never stops between notes, so the
// only way to play the same note twice is to put a grace note between them:
// notes shorter than `minNoteSeconds` are taken as ornaments. The ornament's
// time goes to the note after it, and an ornament between two equal notes
// keeps them apart. Very short silences are joined to the note before them.
export const cleanSegments = (segments: Segment[], minNoteSeconds: number) => {
  const notes: RecognizedNote[] = [];
  let ornaments = 0;
  let pendingStart: number | null = null;
  let splitNext = false;

  segments.forEach((segment, index) => {
    const length = segment.end - segment.start;
    const last = notes[notes.length - 1];

    if (segment.pitch === null) {
      if (length < MIN_SILENCE_SECONDS && last && Math.abs(last.end - segment.start) < 1e-6) {
        // A short break (a closed fingering) still separates two notes
        last.end = segment.end;
        splitNext = true;
        return;
      }
      if (pendingStart !== null && last) last.end = Math.max(last.end, pendingStart);
      pendingStart = null;
      splitNext = false;
      return;
    }

    if (length < minNoteSeconds) {
      // An ornament: drop it, and split equal notes around it
      const next = segments[index + 1];
      const nextIsNote = next && next.pitch !== null;
      if (!nextIsNote) {
        if (last && Math.abs(last.end - segment.start) < 1e-6) last.end = segment.end;
        return;
      }
      ornaments++;
      if (pendingStart === null) pendingStart = segment.start;
      if (last && next.pitch === last.pitch) splitNext = true;
      return;
    }

    const start = pendingStart ?? segment.start;
    if (last && last.pitch === segment.pitch && !splitNext && Math.abs(last.end - start) < 1e-6) {
      last.end = segment.end;
    } else {
      if (last && last.end > start) last.end = start;
      notes.push({ pitch: segment.pitch, start, end: segment.end });
    }
    pendingStart = null;
    splitNext = false;
  });

  return { notes, ornaments };
};
