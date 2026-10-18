import { useContext, useEffect, useState } from "react";
import {
  MidiNoteHandler,
  MidiPlayer,
  PlaybackProgressHandler,
} from "../utils/MidiPlayer";
import { store } from "../context";
import { getUserOnboardingFinished } from "../constants/localStorage";

export const useMidiPlayer = (
  handleNote: MidiNoteHandler,
  handleProgress: PlaybackProgressHandler,
  playerRef: any
) => {
  const {
    state: { tempo, metronome, loopBars, activeSong, bagpipeType },
    setIsPlaying,
    setLoop,
  } = useContext(store);
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);

  const switchIsPlaying = () => {
    setIsPlaying(false);
  };

  const initPlayer = () => {
    setMidiPlayer(null);
    midiPlayer?.stop();
    let player: MidiPlayer | null = new MidiPlayer(
      playerRef,
      tempo,
      metronome,
      loopBars,
      bagpipeType
    );
    player.initPlayer(handleNote, handleProgress, switchIsPlaying);
    setMidiPlayer(player);
  };

  useEffect(() => {
    initPlayer();
  }, []);

  // Pause when the app goes to the background. The player is kept as is, so
  // pressing play afterwards continues from the same place.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        midiPlayer?.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [midiPlayer]);

  useEffect(() => {
    if (midiPlayer && bagpipeType) {
      midiPlayer.setBagpipeType(bagpipeType);
    }
  }, [bagpipeType, midiPlayer]);

  useEffect(() => {
    if (activeSong && midiPlayer) {
      midiPlayer.setLoop(false);
      setLoop(false);
      midiPlayer?.setTimeSignature(activeSong?.timeSignature);
    }
  }, [activeSong, midiPlayer]);

  return { Player: midiPlayer, setMidiPlayer };
};
