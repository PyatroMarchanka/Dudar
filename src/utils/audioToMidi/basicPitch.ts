import type { BasicPitch } from '@spotify/basic-pitch';
import { getBagpipePitches, RecognizedNote, Recognition, RecognizeOptions } from './recognize';

// Finds the notes of a bagpipe melody in a mono recording.
//
// Spotify's Basic Pitch (a small neural network, Apache-2.0) turns the sound
// into notes; what we add is knowledge of the bagpipe: the key is the one
// where most of the sound falls on the chanter's notes, anything that isn't
// one of its notes (drone overtones, clicks, noise) is thrown away, notes
// heard at the same moment become one, and grace notes are left out.

const MODEL_RATE = 22050;
// Basic Pitch hears a note start this long after it really starts
const ONSET_LAG_SECONDS = 0.08;
const ONSET_THRESHOLD = 0.5;
const FRAME_THRESHOLD = 0.3;
const MIN_NOTE_FRAMES = 3;
// Notes starting this close together are one note
const SAME_MOMENT_SECONDS = 0.08;
// The same pitch with a gap this short is one note
const SAME_NOTE_GAP_SECONDS = 0.05;
const DEFAULT_MIN_NOTE_SECONDS = 0.06;
// A note this long is a drone (or a held sound), not a melody note
const MAX_MELODY_NOTE_SECONDS = 4;
// A long note counts for the key like this many seconds at most
const MAX_KEY_WEIGHT_SECONDS = 1;
// Keys whose fit is this close to the best count as equal
const KEY_TIE = 0.03;

const modelUrl = () => `${process.env.PUBLIC_URL || ''}/models/basic-pitch/model.json`;

let model: BasicPitch | null = null;

// Resamples to the rate the model wants
export const resample = async (samples: Float32Array, sampleRate: number): Promise<Float32Array> => {
  if (sampleRate === MODEL_RATE) return samples;
  const length = Math.max(1, Math.ceil((samples.length * MODEL_RATE) / sampleRate));
  const offline = new OfflineAudioContext(1, length, MODEL_RATE);
  const buffer = offline.createBuffer(1, samples.length, sampleRate);
  buffer.copyToChannel(samples, 0);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return rendered.getChannelData(0);
};

interface HeardNote {
  pitch: number;
  start: number;
  end: number;
}

// Which key (semitones between the written notes and the pipe's sound) puts the
// most sound on the chanter's notes; among nearly equal keys, the one closest to
// the key in the settings
const findKey = (heard: HeardNote[], written: Set<number>, preferred: number) => {
  const weight = (note: HeardNote) => Math.min(note.end - note.start, MAX_KEY_WEIGHT_SECONDS);
  const total = heard.reduce((sum, note) => sum + weight(note), 0) || 1;
  const circle = (semitones: number) => {
    const value = ((semitones % 12) + 12) % 12;
    return Math.min(value, 12 - value);
  };
  const fits: { key: number; fit: number }[] = [];
  for (let key = -12; key <= 12; key++) {
    const fitting = heard.reduce(
      (sum, note) => (written.has(note.pitch - key) ? sum + weight(note) : sum),
      0
    );
    fits.push({ key, fit: fitting / total });
  }
  const top = Math.max(...fits.map(({ fit }) => fit));
  return fits
    .filter(({ fit }) => fit >= top - KEY_TIE)
    .sort((x, y) => circle(x.key - preferred) - circle(y.key - preferred) || y.fit - x.fit)[0];
};

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
  const written = new Set(getBagpipePitches(bagpipeType));
  if (!written.size || samples.length < sampleRate / 2) return empty;

  // Loaded only when needed: the library brings TensorFlow.js with it
  const { BasicPitch, noteFramesToTime, outputToNotesPoly } = await import('@spotify/basic-pitch');
  if (!model) model = new BasicPitch(modelUrl());
  const audio = await resample(samples, sampleRate);

  const frames: number[][] = [];
  const onsets: number[][] = [];
  await model.evaluateModel(
    audio,
    (f, o) => {
      frames.push(...f);
      onsets.push(...o);
    },
    (fraction) => onProgress?.(fraction)
  );
  const events = noteFramesToTime(outputToNotesPoly(frames, onsets, ONSET_THRESHOLD, FRAME_THRESHOLD, MIN_NOTE_FRAMES));
  return buildRecognition(events, { bagpipeType, transpose, minNoteSeconds });
};

export interface RawNote {
  pitchMidi: number;
  startTimeSeconds: number;
  durationSeconds: number;
}

// Cleans what Basic Pitch heard into the melody notes of one bagpipe
export const buildRecognition = (
  events: RawNote[],
  {
    bagpipeType,
    transpose,
    minNoteSeconds = DEFAULT_MIN_NOTE_SECONDS,
  }: Pick<RecognizeOptions, 'bagpipeType' | 'transpose' | 'minNoteSeconds'>
): Recognition => {
  const empty: Recognition = {
    notes: [],
    ornaments: 0,
    keyTranspose: transpose,
    tuningOffset: 0,
    soundingSeconds: 0,
    fit: 0,
  };
  const written = new Set(getBagpipePitches(bagpipeType));
  const heard: HeardNote[] = events
    .filter((event) => event.durationSeconds <= MAX_MELODY_NOTE_SECONDS)
    .map((event) => ({
      pitch: event.pitchMidi,
      start: Math.max(0, event.startTimeSeconds - ONSET_LAG_SECONDS),
      end: Math.max(0, event.startTimeSeconds + event.durationSeconds - ONSET_LAG_SECONDS),
    }))
    .sort((a, b) => a.start - b.start);
  if (!heard.length) return empty;

  const soundingSeconds = heard.reduce((sum, note) => sum + (note.end - note.start), 0);
  const { key, fit } = findKey(heard, written, transpose);

  // Only the chanter's notes; at one moment only one note (the longer one);
  // the same pitch twice in a row with no gap is one note
  const single: HeardNote[] = [];
  for (const note of heard) {
    if (!written.has(note.pitch - key)) continue;
    const last = single[single.length - 1];
    if (last && note.start - last.start < SAME_MOMENT_SECONDS) {
      if (note.end - note.start > last.end - last.start) single[single.length - 1] = note;
      continue;
    }
    if (last && last.pitch === note.pitch && note.start - last.end < SAME_NOTE_GAP_SECONDS) {
      last.end = Math.max(last.end, note.end);
      continue;
    }
    single.push({ ...note });
  }

  // Grace notes and cuts are too short to be melody notes
  const kept = single.filter((note) => note.end - note.start >= minNoteSeconds);
  const notes: RecognizedNote[] = kept.map((note) => ({
    pitch: note.pitch - key,
    start: note.start,
    end: note.end,
  }));

  return {
    notes,
    ornaments: single.length - kept.length,
    keyTranspose: ((key % 12) + 12) % 12,
    tuningOffset: 0,
    soundingSeconds,
    fit,
  };
};

// Decodes an audio file (any format the browser plays) into mono samples
export const decodeAudioFile = async (file: File): Promise<{ samples: Float32Array; sampleRate: number }> => {
  const AudioContextClass: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  const context = new AudioContextClass();
  try {
    const decoded = await context.decodeAudioData(await file.arrayBuffer());
    const samples = new Float32Array(decoded.length);
    for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
      const data = decoded.getChannelData(channel);
      for (let i = 0; i < samples.length; i++) samples[i] += data[i] / decoded.numberOfChannels;
    }
    return { samples, sampleRate: decoded.sampleRate };
  } finally {
    context.close().catch(() => undefined);
  }
};
