import { useContext, useEffect } from 'react';
import { store } from '../context';
import { prepareSongMidi } from '../utils/midiUtils';
import { MelodyRoll, rollToMidi } from '../utils/midiUtils/melodyRoll';

// Loads a melody drawn in the piano-roll editor into the player, through the
// same pipeline as catalog songs. The notes are already written for an A
// instrument, so transpose works as for a catalog song. `roll` is `undefined`
// while loading (nothing happens) and `null` when there is nothing to play.
export const useRollSong = (roll: MelodyRoll | null | undefined, title: string | undefined) => {
  const {
    state: { tempo },
    setActiveSong,
    setIsSongLoading,
    setIsSongUnavailable,
    setMidi,
    setMidiData,
    setSongLength,
    setTempo,
  } = useContext(store);

  useEffect(() => {
    if (roll === undefined) return;
    if (!roll || !roll.notes.length) {
      setActiveSong(null);
      setIsSongLoading(false);
      setIsSongUnavailable(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsSongLoading(true);
        const { buffer, song } = rollToMidi(roll, title || '');
        setActiveSong(song);
        setIsSongUnavailable(false);

        const { midi, songWithMetronome, songLength } = await prepareSongMidi(
          buffer,
          song.timeSignature,
          song.originalTempo,
          tempo,
          false
        );
        if (cancelled) return;

        setSongLength(songLength);
        setMidiData(midi);
        setMidi(songWithMetronome);
        setIsSongLoading(false);
        if (song.originalTempo) {
          setTempo(song.originalTempo);
        }
      } catch (error) {
        if (cancelled) return;
        console.log(error);
        setActiveSong(null);
        setIsSongUnavailable(true);
        setIsSongLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roll, title]);
};
