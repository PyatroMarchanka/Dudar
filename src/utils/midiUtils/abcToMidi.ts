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

// Converts ABC notation text into a synthetic Song + MIDI buffer that can be
// fed into the same pipeline (prepareSongMidi) as a regular catalog song.
export const abcToMidi = (abc: string): AbcSongResult => {
  if (abc.length > MAX_ABC_LENGTH) {
    throw new Error(`ABC notation is too large (${abc.length} chars, max ${MAX_ABC_LENGTH})`);
  }

  const tune = abcjs.parseOnly(abc)[0];

  const midiBytes = abcjs.synth.getMidiFile(tune, {
    midiOutputType: "binary",
    chordsOff: true,
  }) as Uint8Array;

  const midiBuffer = Buffer.from(midiBytes);

  // abcjs never throws on empty/garbage ABC text - it just produces a tune
  // with no notes. Detect that here instead.
  const noteCount = parseMidi(midiBuffer).tracks.reduce(
    (acc, track) => acc + track.filter((event) => event.type === "noteOn").length,
    0
  );
  if (!noteCount) {
    throw new Error("No notes found in the ABC notation");
  }
  if (noteCount > MAX_NOTE_COUNT) {
    throw new Error(`ABC tune has too many notes (${noteCount}, max ${MAX_NOTE_COUNT})`);
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
