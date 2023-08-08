import { useContext, useEffect } from "react";
import { MidiPlayer } from "../utils/MidiPlayer";
import { store } from "../context";

export const useLoop = (player: MidiPlayer | null) => {
  const {
    state: { loop },
    setLoop,
  } = useContext(store);

  const onLoop = () => {
    if (loop) {
      setLoop(false);
      player?.setLoop(false)
    } else {
      setLoop(true);
      player?.setLoop(true)
      player?.setCurrentBarStart();
    }
  };

  useEffect(() => {
    player?.setLoop(loop)
  }, [player])

  return {
    onLoop,
    isLoop: loop,
  };
};
