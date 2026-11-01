import { Song } from '../../dataset/songs/interfaces';
import { abcToMidi, AbcInstrument } from './abcToMidi';
import { isMelodyRoll, rollToMidi } from './melodyRoll';

// A catalog song approved from a user's melody: it has no .mid file, its notes are in `song.melody`
export const isMelodySong = (song: Song) => song.source === 'melody' && !!song.melody;

// Only ABC melodies depend on the instrument: like on the melody's own link,
// the tune keeps its written key and is rearranged onto the instrument's fingering
export const isAbcMelodySong = (song: Song) => isMelodySong(song) && song.melody?.format === 'abc';

// Builds the MIDI of a melody song in the browser, the same way /app/melody/:id
// plays the melody it came from. `normalizeOctaves` is the matching
// prepareSongMidi flag: off, since the notes already sit in the instrument's range.
export const melodySongToMidi = (song: Song, instrument: AbcInstrument) => {
  const melody = song.melody;
  if (melody?.format === 'roll' && isMelodyRoll(melody.roll)) {
    return { buffer: rollToMidi(melody.roll, song.name).buffer, normalizeOctaves: false };
  }
  if (melody?.format === 'abc' && melody.abc) {
    return { buffer: abcToMidi(melody.abc, { instrument }).buffer, normalizeOctaves: false };
  }
  throw new Error('The song has no notes');
};
