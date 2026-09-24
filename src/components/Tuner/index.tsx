import React, { useEffect, useRef } from "react";
import { useState } from "react";
import createTuner from "../../vendor/tuner";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
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

// How much each new reading pulls the displayed value toward it (0-1).
// Higher = reacts faster but jitters more, lower = smoother but laggier.
// Readings now arrive ~30/sec (see vendor/tuner), so this can be fairly
// low and still keep the needle moving in real time.
const smoothing = 0.25;

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
  const smoothedDiffRef = useRef<number | null>(null);
  const { t } = useTranslation("translation");

  useEffect(() => {
    if (!data || !Number.isFinite(data.diff)) return;

    const prevDiff = smoothedDiffRef.current;
    // Guard against a stale non-finite value (e.g. from a bad reading) so it
    // can't permanently poison every future reading via NaN propagation.
    const smoothedDiff =
      prevDiff === null || !Number.isFinite(prevDiff) ? data.diff : prevDiff + smoothing * (data.diff - prevDiff);
    smoothedDiffRef.current = smoothedDiff;

    setDataToShow({ ...data, diff: Math.round(smoothedDiff) });
  }, [data]);

  useEffect(() => {
    return () => {
      smoothedDiffRef.current = null;
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
  // Percentage offset from center, so the needle tracks correctly whatever
  // width the meter actually renders at (it's responsive, not fixed pixels).
  const needleOffsetPercent = dataToShow ? Math.max(-1, Math.min(1, dataToShow.diff / 100)) * 50 : 0;

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
              <Needle status={status} offsetPercent={needleOffsetPercent} />
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
          <WaitingContainer>
            <MicNoneOutlinedIcon style={{ fontSize: "2.5rem", color: mainColors.midGrey }} />
            <Typography variant="body2" style={{ color: mainColors.midGrey }}>
              {t("tunerWaitingForSound")}
            </Typography>
          </WaitingContainer>
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

const WaitingContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: ${tunerWidth}px;
  max-width: 100%;
  height: 110px;
  text-align: center;
`;

const Panel = styled.div<{ status: Status }>`
  box-sizing: border-box;
  position: relative;
  width: ${tunerWidth}px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 16px;
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
  max-width: 100%;
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

const Needle = styled.div<{ offsetPercent: number; status: Status }>`
  position: absolute;
  top: 0;
  left: calc(50% + ${({ offsetPercent }) => offsetPercent}%);
  width: 3px;
  height: 32px;
  border-radius: 2px;
  background: ${({ status }) => statusColors[status]};
  box-shadow: 0 0 8px ${({ status }) => statusColors[status]}99;
  transform: translateX(-50%);
  transition: left 0.12s linear, background-color 0.3s ease;
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
