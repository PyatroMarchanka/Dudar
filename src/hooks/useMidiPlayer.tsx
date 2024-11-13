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
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  const switchIsPlaying = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isUserOnboardingCompleted) {
      let player: MidiPlayer | null = new MidiPlayer(
        playerRef,
        tempo,
        metronome,
        loopBars,
        bagpipeType
      );
      player.initPlayer(handleNote, handleProgress, switchIsPlaying);
      setMidiPlayer(player);
    }
  }, []);

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
