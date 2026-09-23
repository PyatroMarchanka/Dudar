import React, { useEffect } from "react";
import { useState } from "react";
import createTuner from "../../vendor/tuner";
import styled from "styled-components";
import { CircularProgress, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { mainColors } from "../../utils/theme";

interface Props {}
interface Data {
  frequency: number;
  pitch: number;
  note: string;
  diff: number;
}

type Status = "inTune" | "close" | "off";

const statusColors: Record<Status, string> = {
  inTune: "#4caf50",
  close: mainColors.orange,
  off: mainColors.red,
};

const tuner = createTuner();
const tunerWidth = 300;

const bufferLength = 500;

let lastDatas: Data[] = [];

let stream: MediaStream | undefined;

// Requests mic access and starts the pitch detector. Called from the header's
// tuning-fork button so the permission prompt fires on that click, before the
// popup showing the Tuner even opens.
export const startTuner = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  await tuner.start();
};

export const stopTuner = () => {
  tuner.stop();
  stream?.getTracks().forEach((track) => track.stop());
  stream = undefined;
};

export const Tuner = ({}: Props) => {
  const [data, setData] = useState<Data | null>(null);
  const [dataToShow, setDataToShow] = useState<Data | null>(null);
  const { t } = useTranslation("translation");

  useEffect(() => {
    if (data) {
      lastDatas.push(data);
    }
  }, [data]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTuner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
      stopTuner();
    };
  }, []);

  useEffect(() => {
    tuner.getData((data) => {
      setData(data);
    });
  }, []);

  const tickCount = tunerWidth / 10;

  const getStatus = (diff: number): Status => {
    const abs = Math.abs(diff);
    if (abs <= 10) return "inTune";
    if (abs <= 30) return "close";
    return "off";
  };

  const status: Status = dataToShow ? getStatus(dataToShow.diff) : "off";
  const needleX = dataToShow
    ? Math.max(-1, Math.min(1, dataToShow.diff / 100)) * (tunerWidth / 2)
    : 0;

  return (
    <Container>
      <Wrapper>
        {dataToShow ? (
          <Panel status={status}>
            <NoteRow>
              <NoteName status={status}>{dataToShow.note}</NoteName>
              <CentsBadge status={status}>
                {dataToShow.diff > 0 ? `+${dataToShow.diff}` : dataToShow.diff}
              </CentsBadge>
            </NoteRow>

            <MeterOuter>
              <MeterGradient />
              <TicksRow>
                {Array.from({ length: tickCount + 1 }).map((_, i) => (
                  <Tick key={i} isCenter={i === tickCount / 2} />
                ))}
              </TicksRow>
              <Needle status={status} translateX={needleX} />
            </MeterOuter>

            <FrequencyRow>
              <Typography variant="caption" style={{ color: mainColors.midGrey }}>
                {t("frequency")}
              </Typography>
              <FrequencyValue>
                {dataToShow.frequency.toFixed(1)}
                <Unit>Hz</Unit>
              </FrequencyValue>
              <TargetFrequency>
                {t("tunerTarget")} &asymp; {dataToShow.pitch.toFixed(1)} Hz
              </TargetFrequency>
            </FrequencyRow>
          </Panel>
        ) : (
          <LoaderContainer>
            <CircularProgress size="2.5rem" style={{ color: mainColors.darkerGray }} />
          </LoaderContainer>
        )}
      </Wrapper>
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

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${tunerWidth}px;
  height: 110px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Panel = styled.div<{ status: Status }>`
  position: relative;
  width: ${tunerWidth}px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 16px;
  margin: 16px 0;
  border-radius: 16px;
  background: ${mainColors.lightestGrey};
  border: 2px solid ${({ status }) => statusColors[status]};
  box-shadow: 0 4px 14px rgba(109, 83, 83, 0.12);
  transition: border-color 0.3s ease;
`;

const NoteRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const NoteName = styled.div<{ status: Status }>`
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  color: ${({ status }) => statusColors[status]};
  transition: color 0.3s ease;
`;

const CentsBadge = styled.div<{ status: Status }>`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  color: ${mainColors.lightestGrey};
  background: ${({ status }) => statusColors[status]};
  transition: background-color 0.3s ease;
`;

const MeterOuter = styled.div`
  position: relative;
  width: ${tunerWidth}px;
  height: 40px;
  margin-top: 16px;
`;

const MeterGradient = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 17px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    ${mainColors.red} 0%,
    ${mainColors.orange} 20%,
    #4caf50 42%,
    #4caf50 58%,
    ${mainColors.orange} 80%,
    ${mainColors.red} 100%
  );
  opacity: 0.5;
`;

const TicksRow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  display: flex;
  justify-content: space-between;
`;

const Tick = styled.div<{ isCenter: boolean }>`
  width: 1px;
  height: ${({ isCenter }) => (isCenter ? "24px" : "10px")};
  background: ${({ isCenter }) => (isCenter ? mainColors.darkerGray : mainColors.midGrey)};
`;

const Needle = styled.div<{ translateX: number; status: Status }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 32px;
  border-radius: 2px;
  background: ${({ status }) => statusColors[status]};
  box-shadow: 0 0 8px ${({ status }) => statusColors[status]}99;
  transform: translateX(${({ translateX }) => translateX - 1.5}px);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.3s ease;
`;

const FrequencyRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 14px;
`;

const FrequencyValue = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: ${mainColors.darkerGray};
`;

const Unit = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
  color: ${mainColors.midGrey};
`;

const TargetFrequency = styled.div`
  font-size: 12px;
  color: ${mainColors.midGrey};
  margin-top: 2px;
`;
