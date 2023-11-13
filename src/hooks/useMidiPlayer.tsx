import { useContext, useEffect, useState } from "react";
import {
  MidiNoteHandler,
  MidiPlayer,
  PlaybackProgressHandler,
} from "../utils/MidiPlayer";
import { store } from "../context";

export const useMidiPlayer = (
  handleNote: MidiNoteHandler,
  handleProgress: PlaybackProgressHandler,
  playerRef: any
) => {
  const {
    state: { tempo, metronome },
    setIsPlaying,
  } = useContext(store);
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);

  const switchIsPlaying = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const player = new MidiPlayer(playerRef, tempo, metronome);
    player.initPlayer(handleNote, handleProgress, switchIsPlaying);
    setMidiPlayer(player);
  }, []);

  return { Player: midiPlayer };
};
