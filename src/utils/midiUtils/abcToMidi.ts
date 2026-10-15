import abcjs from "abcjs";
import { parseMidi } from "midi-file";
import { Buffer } from "buffer";
import { IStats, Song, TimeSignatures } from "../../dataset/songs/interfaces";
import { BagpipeTypes } from "../../interfaces";
import { toArrayBuffer } from "../commonUtils";

// Meters that have a matching public/midi/common/metronome-X-Y.mid file.
// Anything else (including time signatures the app otherwise supports, like
// 8/8 and 10/8, which have no metronome file) falls back to 4/4.
const METRONOME_TIME_SIGNATURES: TimeSignatures[] = [
  "3/4",
  "4/4",
  "5/4",
  "6/4",
  "6/8",
  "7/8",
  "9/8",
  "11/8",
];

const meterToTimeSignature = (meter: { num: number; den?: number }): TimeSignatures => {
  const candidate = `${meter.num}/${meter.den || 4}`;
  return (METRONOME_TIME_SIGNATURES as string[]).includes(candidate)
    ? (candidate as TimeSignatures)
    : "4/4";
};

const emptyStats = (): IStats => ({
  views: 0,
  likes: 0,
  lastViewed: new Date(),
});

// Letters that introduce an ABC information field (X:, T:, M:, L:, K:, ...).
// Every one of these must start its own line - see restoreAbcLineBreaks.
const HEADER_FIELD_LETTERS = "ABCDFGHIKLMNOPQRSTUVWXZmrsw";

// A bare key signature token - tonic plus an optional mode - e.g. "D",
// "Dmaj", "F#m", "Gmix", or the special "HP"/"Hp"/"none" forms. Used to find
// where a K: field's value ends, since (unlike other fields) it's normally
// followed on the same physical line by the tune body itself.
const KEY_TOKEN =
  "[A-Ga-g](?:#|b)?(?:maj(?:or)?|min(?:or)?|mix(?:olydian)?|dor(?:ian)?|phr(?:ygian)?|lyd(?:ian)?|loc(?:rian)?|ion(?:ian)?|aeo(?:lian)?|m)?|HP|Hp|none";

// The `abc` query param is normally pasted straight into a browser's address
// bar. Browsers can't keep a literal newline in a URL and don't %-encode it
// either - they just turn it into a space - so a multi-line tune collapses
// onto one line before it ever reaches this app. abcjs then reads everything
// after the first field (X:) as that field's value and never finds a K:
// field or a tune body, so it silently produces zero notes. Detect the
// collapsed form and reinsert the line breaks abcjs requires, using the
// space before a field letter as the seam - never before a bar-line repeat
// mark (":|"), which the lookahead excludes. K: needs a second pass: it's
// always the last header field, and its value has no following field letter
// to split on since the tune body starts right after it on the same line.
const restoreAbcLineBreaks = (abc: string): string => {
  if (abc.includes("\n")) return abc;
  const fieldPattern = new RegExp(`(^|\\s)([${HEADER_FIELD_LETTERS}]):(?!\\|)`, "g");
  const withFields = abc.replace(fieldPattern, (_match, before: string, letter: string) => `${before ? "\n" : ""}${letter}:`);
  const keyPattern = new RegExp(`(^|\\n)(K:\\s*(?:${KEY_TOKEN}))\\s+(?=\\S)`, "i");
  const withKey = withFields.replace(keyPattern, (_match, prefix: string, keyField: string) => `${prefix}${keyField}\n`);
  return withKey.trim();
};

export interface AbcSongResult {
  buffer: ArrayBuffer;
  song: Song;
}

// abcjs.parseOnly/getMidiFile run synchronously on the main thread with cost
// that grows worse than linearly in input size, so an attacker-controlled
// `?abc=` param (e.g. embedded in an iframe) needs a hard size cap - well
// past anything a real tune needs - to avoid freezing/crashing the tab.
const MAX_ABC_LENGTH = 20_000;
// Sanity cap on the resulting MIDI in case a compact ABC string expands into
// a huge number of events (e.g. via repeats/voices) despite passing the
// length check above.
const MAX_NOTE_COUNT = 10_000;

const renderMidi = (tune: abcjs.TuneObject, midiTranspose = 0) =>
  Buffer.from(
    abcjs.synth.getMidiFile(tune, {
      midiOutputType: "binary",
      chordsOff: true,
      midiTranspose,
    }) as Uint8Array
  );

const getNoteOns = (midiBuffer: Buffer) =>
  parseMidi(midiBuffer).tracks.flatMap((track) =>
    track.filter((event) => event.type === "noteOn" && event.velocity > 0)
  ) as { noteNumber: number }[];

// Compares scores element by element, earlier elements taking priority
const isHigherScore = (a: number[], b: number[]) => {
  const firstDiff = a.findIndex((value, i) => value !== b[i]);
  return firstDiff !== -1 && a[firstDiff] > b[firstDiff];
};

// Shift that moves concert-pitch notes into the A-frame fingering of an
// instrument whose tonic is `transpose` semitones from A, so the player (which
// adds the transpose back) still sounds the tune in its written key. Only the
// octave is free: pick the one that lands the most notes on the instrument's
// fingering chart, then the most inside its range, then the smallest jump.
const getFingeringShift = (notes: number[], { transpose, playableNotes }: AbcInstrument) => {
  const playable = new Set(playableNotes);
  const lowest = Math.min(...playableNotes);
  const highest = Math.max(...playableNotes);

  let best = { shift: -transpose, score: [-1, -1, 0] };
  for (let octaves = -4; octaves <= 4; octaves++) {
    const shift = -transpose + octaves * 12;
    const shifted = notes.map((note) => note + shift);
    const score = [
      shifted.filter((note) => playable.has(note)).length,
      shifted.filter((note) => note >= lowest && note <= highest).length,
      -Math.abs(octaves),
    ];
    if (isHigherScore(score, best.score)) {
      best = { shift, score };
    }
  }
  return best.shift;
};

export interface AbcInstrument {
  // Tonic of the instrument, in semitones from A (the `transpose` setting).
  transpose: number;
  // MIDI pitches of the instrument's fingering chart, written for an A
  // instrument (the keys of its notes map, e.g. A4 = 69).
  playableNotes: number[];
}

export interface AbcToMidiOptions {
  // When set, the tune keeps its written key and is rearranged onto that
  // instrument's fingering instead of being read as already written for an A
  // instrument. The transpose setting then only picks the instrument's key.
  instrument?: AbcInstrument;
}

// Converts ABC notation text into a synthetic Song + MIDI buffer that can be
// fed into the same pipeline (prepareSongMidi) as a regular catalog song.
export const abcToMidi = (abc: string, { instrument }: AbcToMidiOptions = {}): AbcSongResult => {
  if (abc.length > MAX_ABC_LENGTH) {
    throw new Error(`ABC notation is too large (${abc.length} chars, max ${MAX_ABC_LENGTH})`);
  }

  const tune = abcjs.parseOnly(restoreAbcLineBreaks(abc))[0];

  let midiBuffer = renderMidi(tune);

  // abcjs never throws on empty/garbage ABC text - it just produces a tune
  // with no notes. Detect that here instead.
  const noteOns = getNoteOns(midiBuffer);
  const noteCount = noteOns.length;
  if (!noteCount) {
    throw new Error("No notes found in the ABC notation");
  }
  if (noteCount > MAX_NOTE_COUNT) {
    throw new Error(`ABC tune has too many notes (${noteCount}, max ${MAX_NOTE_COUNT})`);
  }

  if (instrument?.playableNotes.length) {
    const shift = getFingeringShift(
      noteOns.map((event) => event.noteNumber),
      instrument
    );
    if (shift) {
      midiBuffer = renderMidi(tune, shift);
    }
  }

  const timeSignature = meterToTimeSignature(tune.getMeterFraction());
  const bpm = tune.getBpm();
  // useLoadSong/prepareSongMidi halve originalTempo before applying it, so
  // store double the real tempo to match the convention used by regular songs.
  const originalTempo = bpm ? Math.round(bpm * 2) : undefined;

  const song: Song = {
    id: "abc",
    name: tune.metaText?.title || "ABC tune",
    type: "other",
    bagpipesToPlay: [] as BagpipeTypes[],
    timeSignature,
    pathName: "",
    labels: [],
    originalTempo,
    links: [],
    stats: emptyStats(),
  };

  return { buffer: toArrayBuffer(midiBuffer), song };
};
