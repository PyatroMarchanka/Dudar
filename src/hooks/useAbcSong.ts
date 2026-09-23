import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { store } from "../context";
import { abcToMidi, prepareSongMidi } from "../utils/midiUtils";

// Loads a song from ABC notation passed in the `abc` query param
// (e.g. /app/abc?abc=X:1%0AT:...), converts it to MIDI with abcjs and feeds
// it through the same pipeline a regular catalog song uses. Unlike
// useLoadSong, it never touches the song catalog (no useSong/useSongList),
// so it's safe to use standalone, including inside an iframe.
export const useAbcSong = () => {
  const location = useLocation();
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

  const abc = new URLSearchParams(location.search).get("abc");

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
        const { buffer, song } = abcToMidi(abc);
        if (cancelled) return;

        setActiveSong(song);
        setIsSongUnavailable(false);

        const { midi, songWithMetronome, songLength } = await prepareSongMidi(
          buffer,
          song.timeSignature,
          song.originalTempo,
          tempo
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
  }, [abc]);
};
