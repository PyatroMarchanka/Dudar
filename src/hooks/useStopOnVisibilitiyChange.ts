import { useCallback, useContext, useEffect } from "react";
import { MidiPlayer } from "../utils/MidiPlayer";
import { store } from "../context";

export const useStopOnVisibilitiyChange = (midiPlayer: MidiPlayer | null) => {
  const {
    state: { isPlaying },
    setIsPlaying,
  } = useContext(store);
  const onWindowChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      midiPlayer?.pause();
      setIsPlaying(false);
    }
  }, [midiPlayer, isPlaying]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onWindowChange);

    return () => {
      document.removeEventListener("visibilitychange", onWindowChange);
    };
  }, [midiPlayer, onWindowChange]);
};
