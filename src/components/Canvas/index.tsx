import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { SharpNotes } from "../../interfaces";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { drawBagpipe, drawAll } from "./drawUtils";

type Props = {
  player: MidiPlayer | null;
  activeHole: { note: SharpNotes; octave: number } | null;
  lowestOctave: number;
};

export default ({ player, activeHole, lowestOctave }: Props) => {
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();
  const {
    state: { showPianoRoll, isPlaying, activeSong, isClosedManer, screenSize },
  } = useContext(store);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (player && showPianoRoll) {
      player.handleNotesMoving = setTick;
    }
  }, [player, showPianoRoll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    if (!isPlaying) {
      context!.clearRect(0, 0, context!.canvas.width, context!.canvas.height);
    }
  }, [activeSong]);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");
    drawBagpipe(context!);

    //RENDER
    const render = () => {
      drawAll(
        context!,
        tick,
        lowestOctave,
        nextNotes,
        nextToNextNotes,
        activeHole,
        isClosedManer
      );

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawAll, tick, activeHole, lowestOctave]);

  return (
    <div>
      <CanvasComponent
        height={screenSize.height}
        width={screenSize.width}
        className="canvas"
        ref={canvasRef}
      />
    </div>
  );
};

const CanvasComponent = styled.canvas`
  margin-top: 3px;
  @media (max-width: ${mediaQueries.mobile}) {
    width: 100%;
  }
`;
