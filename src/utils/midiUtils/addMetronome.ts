import { parseMidi, MidiData, writeMidi } from "midi-file";
import { toArrayBuffer } from "../commonUtils";
import { getTicksPerBeatByTimeSignature } from "../../dataset/songs/utils";
import { TimeSignatures } from "../../dataset/songs/interfaces";
import { Buffer } from "buffer";

// Building the metronome track is O(rounds) in both time and memory
// (`new Array(rounds).fill(track).flat(1)`), so a song with an outsized
// duration - e.g. a crafted ABC tune with very long note values - needs a
// hard cap to avoid pegging the main thread. No real song gets close to this.
const MAX_METRONOME_ROUNDS = 10_000;

export const addMetronome = async (songBuffer: ArrayBuffer, timeSignature: TimeSignatures) => {
  // METRONOME ADDING
  const ticks = getTicksPerBeatByTimeSignature(timeSignature);
  const outputSongBuffer = Buffer.from(songBuffer);
  const parsedSong = parseMidi(outputSongBuffer);
  const metronomeFile = await fetch(`/midi/common/metronome-${timeSignature.split('/').join('-')}.mid`);
  const metronomeBuffer = await metronomeFile.arrayBuffer();
  const outputMetronomeBuffer = Buffer.from(metronomeBuffer);
  let parsedMetronome = parseMidi(outputMetronomeBuffer);
  const songTicksPerBeat = parsedSong.header.ticksPerBeat || 480;
  // Update metronome tempo
  parsedMetronome.header.ticksPerBeat = songTicksPerBeat;
  // Songs are usually a single track, but some sources (e.g. ABC-to-MIDI
  // conversion) put notes in a later track and leave an empty meta track at
  // index 0, so the song's real length is the longest track, not track 0.
  const songLength = Math.max(
    ...parsedSong.tracks.map((track) => track.reduce((acc, cur) => acc + cur.deltaTime, 0))
  );

  const metronomRoundsCountForSong = Math.ceil(songLength / ticks);
  if (metronomRoundsCountForSong > MAX_METRONOME_ROUNDS) {
    throw new Error(
      `Song is too long to add a metronome track (${metronomRoundsCountForSong} rounds, max ${MAX_METRONOME_ROUNDS})`
    );
  }

  const resultMetronomTrack = new Array(metronomRoundsCountForSong)
    .fill(parsedMetronome.tracks[0])
    .flat(1);

  const songWithMetronome: MidiData = {
    header: {
      ...parsedSong.header,
      numTracks: parsedSong.header.numTracks + 1,
    },
    tracks: [...parsedSong.tracks, resultMetronomTrack],
  };

  const outputBuffer = Buffer.from(writeMidi(songWithMetronome));
  return toArrayBuffer(outputBuffer);
};
