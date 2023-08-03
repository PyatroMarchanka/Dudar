import { Midi } from "@tonejs/midi";
import { BagpipeTypes, SharpNotesEnum } from "../../interfaces";
import { bagpipes } from "../../dataset/bagpipes";
import _ from "lodash";
import { Song } from "../../dataset/songs/interfaces";

export const getSongNotesWithOctaveFromMidi = (midi: Midi): SharpNotesEnum[] => {
  const notes = midi?.tracks.filter((track) => track.notes.length)[0].notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note) => {
    const noteWthOctave = note.pitch + note.octave;
    if (!(noteWthOctave in notesObject)) {
      notesObject[noteWthOctave] = noteWthOctave;
    }
  });

  return Object.keys(notesObject) as SharpNotesEnum[];
};

const bagpipeNotesMaps = Object.values(BagpipeTypes).map((bagpipeType) => ({
  bagpipeNotes: Object.keys(bagpipes[bagpipeType].notesMap),
  bagpipeType,
}));

export const findBagpipesForSong = (midi: Midi): BagpipeTypes[] => {
  const songNotesFromMidi = getSongNotesWithOctaveFromMidi(midi);
  const filteredBagpipesForSong = bagpipeNotesMaps.filter(
    ({ bagpipeNotes }) => !songNotesFromMidi.filter((note) => !bagpipeNotes.includes(note)).length
  );

  const bagpipesForSong = filteredBagpipesForSong.map(({ bagpipeType }) => bagpipeType);

  return bagpipesForSong;
};

type List = Song[];

export const getSongListWithBagpipeTypes = async (): Promise<Song[]> => {
  const songListUrl = "midi/list.json";

  const songListFromFile = await fetch(songListUrl);
  const songList: List = await songListFromFile.json();
  let updatedSongList: Song[] = [];

  try {
    updatedSongList = await Promise.all(
      songList.map(async (song) => {
        const file = await fetch(`midi/${song.pathName}`);
        const buffer = await file.arrayBuffer();

        const midi = new Midi(buffer);
        const bagpipesToPlay = findBagpipesForSong(midi);

        return { ...song, bagpipesToPlay };
      })
    );
  } catch (error) {
    console.log(error);
  }

  return updatedSongList;
};
