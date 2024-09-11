import { parseMidi, MidiData, writeMidi } from "midi-file";
import { toArrayBuffer } from "../commonUtils";
import { getTicksPerBeatByTimeSignature } from "../../dataset/songs/utils";
import { TimeSignatures } from "../../dataset/songs/interfaces";
import { Buffer } from "buffer";

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
  const songLength = parsedSong.tracks[0].reduce((acc, cur) => acc + cur.deltaTime, 0);

  const metronomRoundsCountForSong = Math.ceil(songLength / ticks);

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
