import React from "react";

import { useDrawDynamic } from "../../hooks/useDrawDynamic";
import { GenericCanvas } from "./GenericCanvas";
import { MidiPlayer } from "../../utils/MidiPlayer";

type Props = {
  player: MidiPlayer | null;
};

export const DynamicCanvas = ({ player }: Props) => {
  const { canvasRef, dragHandlers, isDragging } = useDrawDynamic(player);

  return (
    <GenericCanvas
      canvasRef={canvasRef}
      interactive
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      {...dragHandlers}
    />
  );
};
