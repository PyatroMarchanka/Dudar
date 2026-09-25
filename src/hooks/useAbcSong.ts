import { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { store } from "../context";
import { abcToMidi, prepareSongMidi } from "../utils/midiUtils";
import { isFluteInstrument } from "../brand";

// Loads a song from ABC notation passed in the `abc` query param
// (e.g. /app/abc?abc=X:1%0AT:...), converts it to MIDI with abcjs and feeds
// it through the same pipeline a regular catalog song uses. Unlike
// useLoadSong, it never touches the song catalog (no useSong/useSongList),
// so it's safe to use standalone, including inside an iframe.
//
// On flutes the tune keeps its written key and is rearranged onto the fingering
// of the selected whistle (the transpose setting), e.g. an E minor tune on a D
// whistle. Catalog songs are instead already written for an A instrument.
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
  const isFlute = isFluteInstrument(bagpipeType);
  const instrumentTranspose = isFlute ? transpose : undefined;
  // Re-converting for another whistle key must not reset a tempo the user changed
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
        const { buffer, song } = abcToMidi(abc, { instrumentTranspose });
        if (cancelled) return;

        setActiveSong(song);
        setIsSongUnavailable(false);

        const { midi, songWithMetronome, songLength } = await prepareSongMidi(
          buffer,
          song.timeSignature,
          song.originalTempo,
          tempo,
          !isFlute
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
  }, [abc, instrumentTranspose]);
};
