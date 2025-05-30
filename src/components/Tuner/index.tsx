import React, { useEffect } from "react";
import { useState } from "react";
import createTuner from "@pedroloch/tuner";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";

interface Props {}
interface Data {
  frequency: number;
  pitch: number;
  note: string;
  diff: number;
}

const tuner = createTuner();
const tunerWidth = 300;

const bufferLength = 100;

let lastDatas: Data[] = [];

let stream: MediaStream;

export const Tuner = ({}: Props) => {
  const [data, setData] = useState<Data | null>(null);
  const [isTunerOn, setIsTunerOn] = useState(false);
  const [dataToShow, setDataToShow] = useState<Data | null>(null);
  const { t } = useTranslation("translation");

  const handleClick = async () => {
    if (isTunerOn) {
      tuner.stop();
      stream?.getTracks().forEach((track) => track.stop());
    } else if (!tuner.isOn) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await tuner.start();
    }

    setIsTunerOn(!isTunerOn);
  };

  useEffect(() => {
    if (data) {
      lastDatas.push(data);
    }
  }, [data]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && isTunerOn) {
        tuner.stop();
        setIsTunerOn(false);
        stream?.getTracks().forEach((track) => track.stop());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isTunerOn]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastDatas.length > 0) {
        const sum = lastDatas.reduce((acc, curr) => acc + curr.diff, 0);
        const avg = sum / lastDatas.length;
        const note = lastDatas.at(-1)!.note;

        setDataToShow({
          frequency: lastDatas.at(-1)!.frequency,
          note,
          diff: Math.round(avg),
          pitch: lastDatas.at(-1)!.pitch,
        });

        lastDatas = [];
      }
    }, bufferLength);

    return () => {
      clearInterval(interval);
      setDataToShow(null);
      setData(null);
      if (tuner.isOn) {
        tuner.stop();
      }
      setIsTunerOn(false);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  React.useEffect(() => {
    if (isTunerOn) {
      tuner.getData((data) => {
        setData(data);
      });
    }
  }, [isTunerOn]);

  const verticalLines = (number: number, margin: number) => {
    const lines = [];
    for (let i = 0; i < number; i++) {
      lines.push(
        <div
          key={i}
          style={{
            borderLeft: "1px solid #333",
            height: "10px",
            position: "absolute",
            left: `${margin + i * 10}px`,
          }}
        ></div>
      );
    }
    return lines;
  };

  const isGreen = dataToShow
    ? dataToShow?.diff > -10 && dataToShow?.diff < 10
    : false;

  return (
    <Container>
      <Row>
        <Icon
          fill={mainColors.darkerGray}
          type="tuning-fork"
          className="duda"
        />
        <Title onClick={handleClick}>
          {isTunerOn ? t("disableTuner") : t("enableTuner")}
        </Title>
      </Row>
      {isTunerOn && dataToShow && (
        <Wrapper>
          <TunerContainer isGreen={isGreen}>
            <MovingBarContainer>
              <MovingBar
                isGreen={isGreen}
                translateX={(tunerWidth / 2) * (dataToShow.diff / 100) || 0}
                width={20}
              />
              {verticalLines(tunerWidth / 10, 10)}
            </MovingBarContainer>
            <Typography variant="h4">{dataToShow?.note}</Typography>
            <Typography variant="h5">{dataToShow?.diff}</Typography>
          </TunerContainer>
        </Wrapper>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TunerContainer = styled.div<{ isGreen: boolean }>`
  position: relative;
  width: ${tunerWidth}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ isGreen }) => (isGreen ? "#4caf50" : "#f44336")};
  margin-top: 20px;
  margin-bottom: 20px;
`;

const MovingBar = styled.div<{
  translateX: number;
  isGreen: boolean;
  width: number;
}>`
  position: absolute;
  width: ${({ width }) => width}px;
  height: 10px;
  background-color: ${({ isGreen }) => (isGreen ? "#4caf50" : "#f44336")};
  transform: translateX(${(props) => props.translateX - props.width / 2}px);
  transition: transform 0.5s;
  border-radius: 5px;
`;

const MovingBarContainer = styled.div`
  height: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`;
