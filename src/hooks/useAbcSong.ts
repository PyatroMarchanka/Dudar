import { useContext, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { store } from "../context";
import { notesMaps } from "../dataset/bagpipesNotesMaps";
import { SharpNotesEnum } from "../interfaces";
import { abcToMidi, convertNoteToMidiPitch, prepareSongMidi } from "../utils/midiUtils";

// Loads a song from ABC notation passed in the `abc` query param
// (e.g. /app/abc?abc=X:1%0AT:...), converts it to MIDI with abcjs and feeds
// it through the same pipeline a regular catalog song uses. Unlike
// useLoadSong, it never touches the song catalog (no useSong/useSongList),
// so it's safe to use standalone, including inside an iframe.
//
// The tune keeps its written key and is rearranged onto the fingering of the
// selected instrument in the selected key (the transpose setting), e.g. an E
// minor tune on a D whistle or a duda in G. So in ABC mode transpose changes
// the instrument, not the melody. Catalog songs are instead already written
// for an A instrument, and transpose shifts the melody with it.
export const useAbcSong = () => {
  const location = useLocation();
  const {
    state: { tempo, transpose, bagpipeType },
    setActiveSong,
    setIsSongLoading,
    setIsSongUnavailable,
    setMidi,
    setMidiData,
    setSongLength,
    setTempo,
  } = useContext(store);

  const abc = new URLSearchParams(location.search).get("abc");
  const playableNotes = useMemo(
    () => Object.keys(notesMaps[bagpipeType] ?? {}).map((note) => convertNoteToMidiPitch(note as SharpNotesEnum)),
    [bagpipeType]
  );
  // Re-converting for another instrument key must not reset a tempo the user changed
  const tempoAppliedForAbc = useRef<string | null>(null);

  useEffect(() => {
    if (!abc) {
      setActiveSong(null);
      setIsSongUnavailable(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsSongLoading(true);
        const { buffer, song } = abcToMidi(abc, { instrument: { transpose, playableNotes } });
        if (cancelled) return;

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

        if (song.originalTempo && tempoAppliedForAbc.current !== abc) {
          setTempo(song.originalTempo);
        }
        tempoAppliedForAbc.current = abc;
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
  }, [abc, transpose, playableNotes]);
};
