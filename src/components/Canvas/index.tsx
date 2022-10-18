import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { Notes } from "../../interfaces";
import { MidiPlayer } from "../../utils/MidiPlayer";

type Props = {
  player: MidiPlayer | null;
};

export default ({ player }: Props) => {
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();
  const {
    state: { showPianoRoll, isPlaying },
  } = useContext(store);

  const canvasRef = useRef(null);

  const getYposByNote = (note: Notes) => {
    const allNotes = ["G", "A", "B", "C", "D", "E", "F", "G", "A"];
    const yPoses = [388, 326, 274, 229, 177, 132, 91, 58, 20];
    return yPoses[allNotes.indexOf(note[0])];
  };

  const drawNote = (
    ctx: CanvasRenderingContext2D,
    note: Notes,
    dur: number,
    start: number,
    tick: number
  ) => {
    const y = getYposByNote(note);
    const coefficient = 0.5;
    const brickhHeight = 23;

    const startPos = start * coefficient - tick * coefficient;
    if (startPos < 0) {
      ctx.fillStyle = "#b8440a";
    } else {
      ctx.fillStyle = "#b8720a";
    }
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillRect(startPos, y, dur * coefficient, brickhHeight);

    ctx.strokeRect(startPos, y, dur * coefficient, brickhHeight);
  };

  const draw = (ctx: CanvasRenderingContext2D, tick: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    nextNotes?.forEach((note) => {
      drawNote(ctx, note.pitch as Notes, note.durationTicks, note.ticks, tick);
    });

    nextToNextNotes?.forEach((note) => {
      drawNote(ctx, note.pitch as Notes, note.durationTicks, note.ticks, tick);
    });

    ctx.fill();
  };

  const drawBagpipe = (ctx: CanvasRenderingContext2D) => {
    const image = new Image();
    image.src = "/images/bagpipe-9-holes.png";
    ctx.drawImage(image, -30, 8, 136, 500);
  };

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
      draw(context as any, tick);
      drawBagpipe(context!);

      animationFrameId = window.requestAnimationFrame(render);
    };

    if (isPlaying) {
      render();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, tick]);

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
