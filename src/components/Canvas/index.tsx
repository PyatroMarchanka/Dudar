import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { SharpNotes } from "../../interfaces";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { cleanLines, drawAll } from "../../utils/drawUtils/drawAll";
import {
  getSongNotesWithOctaveFromMidi,
  transposeNoteWithOctave,
} from "../../utils/midiUtils";
import { bagpipes } from "../../dataset/bagpipes";
import { NotesMap } from "../../utils/drawUtils/drawBagpipe";
import { useNotesNames } from "../../hooks/useNotesNames";
import { useDrawAll } from "../../hooks/useDrawAll";

const maxCavasWidth = 800;

type Props = {
  player: MidiPlayer | null;
  activeHole: { note: SharpNotes; octave: number } | null;
};

export default ({ player, activeHole }: Props) => {
  const {
    state: { screenSize },
  } = useContext(store);

  const canvasRef = useDrawAll(player, activeHole);

  return (
    <div>
      <CanvasComponent
        height={screenSize.height}
        width={
          screenSize.width < maxCavasWidth ? screenSize.width : maxCavasWidth
        }
        className="canvas"
        ref={canvasRef}
      />
    </div>
  );
};

const CanvasComponent = styled.canvas`
  @media (max-width: ${mediaQueries.mobile}) {
    width: 100%;
  }
`;
