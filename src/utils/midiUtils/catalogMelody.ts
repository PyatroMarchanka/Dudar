import { Midi } from '@tonejs/midi';
import { songApi } from '../../api/songClient';
import { Song, SongMelody } from '../../dataset/songs/interfaces';
import { notesMaps } from '../../dataset/bagpipesNotesMaps';
import { BagpipeTypes, SharpNotesEnum } from '../../interfaces';
import { abcToMidi, AbcInstrument } from './abcToMidi';
import { findBagpipesForSong } from './findBagpipesForSong';
import { convertNoteToMidiPitch } from './noteUtils';
import { isMelodyRoll, rollToMidi } from './melodyRoll';

// A catalog song stored as notes in the database (approved from a user's
// melody, or edited in the notes editor): it has no .mid file to play. The
// song list carries only the notes' format; the notes are loaded when played.
export const isMelodySong = (song: Song) => song.source === 'melody';

// Only ABC melodies depend on the instrument: like on the melody's own link,
// the tune keeps its written key and is rearranged onto the instrument's fingering
export const isAbcMelodySong = (song: Song) => isMelodySong(song) && song.melody?.format === 'abc';

// Builds the MIDI of a melody song in the browser, the same way /app/melody/:id
// plays the melody it came from. `normalizeOctaves` is the matching
// prepareSongMidi flag: off, since the notes already sit in the instrument's range.
export const melodySongToMidi = async (song: Song, instrument: AbcInstrument) => {
  const melody = song.melody?.roll || song.melody?.abc ? song.melody : (await songApi.getSongNotes(song)).melody;
  if (melody?.format === 'roll' && isMelodyRoll(melody.roll)) {
    return { buffer: rollToMidi(melody.roll, song.name).buffer, normalizeOctaves: false };
  }
  if (melody?.format === 'abc' && melody.abc) {
    return { buffer: abcToMidi(melody.abc, { instrument }).buffer, normalizeOctaves: false };
  }
  throw new Error('The song has no notes');
};

const notesOfBagpipe = (bagpipeType: BagpipeTypes) =>
  Object.keys(notesMaps[bagpipeType] ?? {}).map((note) => convertNoteToMidiPitch(note as SharpNotesEnum));

// The bagpipes that can play a melody, checked note by note with
// findBagpipesForSong, as the melody will sound in the catalog (transpose 0).
// A drawn melody is checked as written. An ABC melody is rearranged for each
// bagpipe first, as the player does, and then checked against that bagpipe.
export const findBagpipesForMelody = (melody: SongMelody, title = ''): BagpipeTypes[] => {
  if (melody.format === 'roll') {
    if (!isMelodyRoll(melody.roll)) return [];
    return findBagpipesForSong(new Midi(rollToMidi(melody.roll, title).buffer));
  }
  if (!melody.abc) return [];
  return Object.values(BagpipeTypes).filter((bagpipeType) => {
    try {
      const { buffer } = abcToMidi(melody.abc!, {
        instrument: { transpose: 0, playableNotes: notesOfBagpipe(bagpipeType) },
      });
      return findBagpipesForSong(new Midi(buffer)).includes(bagpipeType);
    } catch (error) {
      return false;
    }
  });
};
