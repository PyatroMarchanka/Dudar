import React, { useEffect } from "react";
import { useState } from "react";
import createTuner from "@pedroloch/tuner";
import styled from "styled-components";
import { Button } from "../global/Button";
import { use } from "i18next";
import { set } from "lodash";
import { Typography } from "@material-ui/core";

interface Props {}
interface Data {
  frequency: number;
  pitch: number;
  note: string;
  diff: number;
}

const tuner = createTuner();

const canvasWidth = 300;
const bufferLength = 100;

const drawRoundedRect = (
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawVerticalLines = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  const lineSpacing = canvasWidth / 10;
  ctx.strokeStyle = "#818181";
  ctx.lineWidth = 1;

  for (let i = 1; i < 10; i++) {
    const x = i * lineSpacing;
    ctx.beginPath();
    ctx.moveTo(x, 3);
    ctx.lineTo(x, 10);
    ctx.stroke();
  }
};

let lastDatas: Data[] = [];

export const Tuner = ({}: Props) => {
  const [data, setData] = useState<Data | null>(null);
  const [isTunerOn, setIsTunerOn] = useState(false);
  const [dataToShow, setDataToShow] = useState<Data | null>(null);

  const handleClick = async () => {
    if (isTunerOn && tuner.isOn) {
      tuner.stop();
      await navigator.mediaDevices.getUserMedia({ audio: false });
    } else if (!tuner.isOn) {
      tuner.start();
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    setIsTunerOn(!isTunerOn);
  };

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data) {
      lastDatas.push(data);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastDatas.length > 0) {
        const sum = lastDatas.reduce((acc, curr) => acc + curr.diff, 0);
        const avg = sum / lastDatas.length;
        const note = lastDatas.at(-1)!.note;

        setDataToShow({
          frequency: lastDatas.at(-1)!.frequency,
          note,
          diff: avg,
          pitch: lastDatas.at(-1)!.pitch,
        });

        lastDatas = [];
      }
    }, bufferLength);

    return () => {
      clearInterval(interval);
      setDataToShow(null);
      setData(null);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current && isTunerOn) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && dataToShow !== null) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "#f0f0f0";

        drawRoundedRect(
          ctx,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
          10
        );
        ctx.fill();

        const diff = dataToShow.diff;
        ctx.fillStyle = diff > -10 && diff < 10 ? "#4caf50" : "#f44336";
        const rectWidth = canvasRef.current.width / 10;

        drawRoundedRect(
          ctx,
          canvasWidth / 2 + diff - rectWidth / 2,
          3,
          rectWidth,
          10,
          5
        );
        ctx.fill();

        drawVerticalLines(
          ctx,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Note and diff text
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(dataToShow.note, canvasRef.current.width / 2, 30);
        ctx.fillText(
          (Math.round(dataToShow.diff) > 0 ? "+" : "") +
            Math.round(dataToShow.diff).toString(),
          canvasRef.current.width / 2,
          50
        );
      }
    }
  }, [dataToShow]);

  React.useEffect(() => {
    if (isTunerOn) {
      tuner.getData((data) => {
        setData(data);
      });
    }
  }, [isTunerOn]);

  return (
    <Container>
      <Button onClick={handleClick}>
        {isTunerOn ? "Disable Tuner" : "Enable Tuner"}
      </Button>

      {isTunerOn &&
        (data ? (
          <canvas ref={canvasRef} width={canvasWidth} height={60} />
        ) : (
          <Typography>Waiting for data...</Typography>
        ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
`;
