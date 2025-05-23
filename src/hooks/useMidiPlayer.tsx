import { useContext, useEffect, useState } from "react";
import {
  MidiNoteHandler,
  MidiPlayer,
  PlaybackProgressHandler,
} from "../utils/MidiPlayer";
import { store } from "../context";
import { getUserOnboardingFinished } from "../constants/localStorage";
import ContinueModal from "../components/global/ContinueModal";

export const useMidiPlayer = (
  handleNote: MidiNoteHandler,
  handleProgress: PlaybackProgressHandler,
  playerRef: any
) => {
  const {
    state: { tempo, metronome, loopBars, activeSong, bagpipeType, isPlaying },
    setIsPlaying,
    setLoop,
  } = useContext(store);
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);
  const [isCountinueModalOpen, setIsCountinueModalOpen] = useState(false);

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
    if (document.visibilityState === "hidden") {
      midiPlayer?.pause();

      if (isPlaying) {
        setIsCountinueModalOpen(true);
      }
      setIsPlaying(false);
      return;
    }

    initPlayer();
  }, [document.visibilityState]);

  const continueElement = (
    <ContinueModal
      open={isCountinueModalOpen}
      setOpen={setIsCountinueModalOpen}
    />
  );

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

  return { Player: midiPlayer, setMidiPlayer, continueElement };
};
