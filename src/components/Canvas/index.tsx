import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { Notes } from "../../interfaces";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { draw as drawNotes, drawBagpipe } from "./drawUtils";

type Props = {
  player: MidiPlayer | null;
};

export default ({ player }: Props) => {
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();
  const {
    state: { showPianoRoll, isPlaying },
  } = useContext(store);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (player && showPianoRoll) {
      player.handleNotesMoving = setTick;
    }
  }, [player, showPianoRoll]);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context = canvas && (canvas as HTMLCanvasElement)!.getContext("2d");
    drawBagpipe(context!);

    //RENDER
    const render = () => {
      drawNotes(context as any, tick, nextNotes, nextToNextNotes);
      drawBagpipe(context!);

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawNotes, drawBagpipe, tick]);

  return (
    <div>
      <CanvasComponent
        height={800}
        width={500}
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
