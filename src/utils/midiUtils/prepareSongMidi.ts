import { Midi } from "@tonejs/midi";
import { TimeSignatures } from "../../dataset/songs/interfaces";
import { addMetronome } from "./addMetronome";
import { fixMidiDataOctaves } from "./fixMidiDataOctaves";

export interface PreparedSongMidi {
  midi: Midi;
  songWithMetronome: ArrayBuffer;
  songLength: number;
  lowestOctave: number;
}

// Shared by useLoadSong (regular catalog songs) and useAbcSong (ABC-notation
// tunes converted to MIDI): turns a raw MIDI buffer into everything the
// player, canvas and music sheet need.
export const prepareSongMidi = async (
  buffer: ArrayBuffer,
  timeSignature: TimeSignatures,
  originalTempo: number | undefined,
  fallbackTempo: number,
  // Off when the notes are already placed in the instrument's range (ABC tunes
  // rearranged for a flute), since the fingering reads the unshifted MIDI.
  normalizeOctaves = true
): Promise<PreparedSongMidi> => {
  const songWithMetronome = await addMetronome(buffer, timeSignature);
  const midi = new Midi(songWithMetronome);
  midi.header.setTempo((originalTempo || fallbackTempo) / 2);

  const songLength = midi.header.ticksToSeconds(midi.durationTicks);
  const lowestOctave = normalizeOctaves
    ? fixMidiDataOctaves(midi).lowestOctave
    : Math.min(...(midi.tracks.find((track) => track.notes.length)?.notes.map((note) => note.octave) ?? [4]));

  return { midi, songWithMetronome, songLength, lowestOctave };
};
