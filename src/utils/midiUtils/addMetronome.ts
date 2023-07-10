import { parseMidi, MidiData, writeMidi } from "midi-file";
import { toArrayBuffer } from "../commonUtils";

export const addMetronome = async (songBuffer: ArrayBuffer) => {
  // METRONOME ADDING
  const outputSongBuffer = Buffer.from(songBuffer);
  const parsedSong = parseMidi(outputSongBuffer);

  const metronomeFile = await fetch(`midi/common/metronome.midi`);
  const metronomeBuffer = await metronomeFile.arrayBuffer();
  const outputMetronomeBuffer = Buffer.from(metronomeBuffer);
  let parsedMetronome = parseMidi(outputMetronomeBuffer);

  // Update metronome tempo
  parsedMetronome.header.ticksPerBeat = parsedSong.header.ticksPerBeat || 480;

  const songLength = parsedSong.tracks[0].reduce((acc, cur) => acc + cur.deltaTime, 0);

  const metronomRoundsCountForSong = Math.ceil(
    songLength / ((parsedSong.header.ticksPerBeat || 480) * 8)
  );

  parsedMetronome.tracks[0] = parsedMetronome.tracks[0]
    .map((note) => {
      if (parsedSong.header.ticksPerBeat !== 480 && note.deltaTime === 480) {
        note.deltaTime = parsedSong.header.ticksPerBeat || 480;
      }

      return note;
    })
    .filter((note) => note.deltaTime <= (parsedSong.header.ticksPerBeat || 480));

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
