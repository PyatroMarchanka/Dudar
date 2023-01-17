import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { BagpipeTypes, SharpNotes } from "../../interfaces";
import { getBagpipeNotesFromMidi } from "../../dataset/bagpipesUtils";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { drawAll, drawStatic } from "../../utils/drawUtils/drawAll";

const maxCavasWidth = 800;

type Props = {
  player: MidiPlayer | null;
  activeHole: { note: SharpNotes; octave: number } | null;
  lowestOctave: number;
};

export default ({ player, activeHole, lowestOctave }: Props) => {
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();

  const {
    state: {
      showPianoRoll,
      isPlaying,
      activeSong,
      screenSize,
      songNotes,
      transpose,
      midiData,
    },
    setSongNotes,
  } = useContext(store);

  const canvasRef = useRef(null);

  const bagpipeType = BagpipeTypes.BelarusianNONTraditionalDuda;

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
    drawStatic(context!, bagpipeType);

    //RENDER
    const render = () => {
      drawAll(
        context!,
        bagpipeType,
        tick,
        nextNotes,
        nextToNextNotes,
        activeHole
      );
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawAll, tick, activeHole, lowestOctave, songNotes]);

  useEffect(() => {
    const bagpipeNotes = getBagpipeNotesFromMidi(midiData!, transpose);
    setSongNotes(bagpipeNotes);
  }, [midiData, transpose]);

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
