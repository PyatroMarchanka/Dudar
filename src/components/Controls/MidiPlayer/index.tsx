import React, { useContext, useState } from "react";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";

interface Props {
  player: MidiPlayer | null;
}

export const PlayerControls = ({ player }: Props) => {
  const {
    state: { midiData, midi },
  } = useContext(store);
  const [isPlaying, setIsPlayed] = useState(false);

  const onPlay = () => {
    setIsPlayed(true);
    player?.playMidi(midi, midiData);
  };

  const onStop = () => {
    setIsPlayed(false);
    player?.stop();
  };

  if (!midi) {
    return null;
  }

  return (
    <div>
      <PlayStopButton
        isPlaying={isPlaying}
        handlePlaying={isPlaying ? onStop : onPlay}
      />
    </div>
  );
};
