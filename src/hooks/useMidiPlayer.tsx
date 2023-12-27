import { useContext, useEffect, useState } from "react";
import { MidiNoteHandler, MidiPlayer, PlaybackProgressHandler } from "../utils/MidiPlayer";
import { store } from "../context";
import { getUserOnboardingFinished } from "../constants/localStorage";

export const useMidiPlayer = (
  handleNote: MidiNoteHandler,
  handleProgress: PlaybackProgressHandler,
  playerRef: any
) => {
  const {
    state: { tempo, metronome, transpose },
    setIsPlaying,
  } = useContext(store);
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  const switchIsPlaying = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isUserOnboardingCompleted) {
      let player: MidiPlayer | null = new MidiPlayer(playerRef, tempo, metronome, transpose);
      player.initPlayer(handleNote, handleProgress, switchIsPlaying);
      setMidiPlayer(player);
    }
  }, []);

  return { Player: midiPlayer, setMidiPlayer };
};
