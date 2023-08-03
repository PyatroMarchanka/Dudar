import React from "react";
import { SharpNotes } from "../../interfaces";

import { useDrawStatic } from "../../hooks/useDrawStatic";
import { GenericCanvas } from "./GenericCanvas";

type Props = {
  activeHole: { note: SharpNotes; octave: number } | null;
};

export const StaticCanvas = ({ activeHole }: Props) => {
  const canvasRef = useDrawStatic(activeHole);

  return <GenericCanvas canvasRef={canvasRef} />;
};
