import React, { useContext, useEffect } from "react";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { MidiPlayer } from "../../utils/MidiPlayer";

interface Props {
  player: MidiPlayer | null;
}

export default ({ player }: Props) => {
  const {
    state: { midiData },
  } = useContext(store);
  const { tick, setTick } = useNotesMoving();
  console.log("tick", tick);

  useEffect(() => {
    if (player) {
      player.handleNotesMoving = setTick;
    }
  }, [player]);

  return <div></div>;
};
