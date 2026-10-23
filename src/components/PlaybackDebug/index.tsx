import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getAudioInfo, isPlaybackDebug, subscribePlaybackLog } from "../../utils/playbackDebug";

// Shows the playback log on screen when the address has `debug=1`
export const PlaybackDebug = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (!isPlaybackDebug()) return;
    const unsubscribe = subscribePlaybackLog(setLines);
    const timer = setInterval(() => setInfo(getAudioInfo()), 500);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  if (!isPlaybackDebug()) return null;

  return (
    <Panel>
      <div>{info}</div>
      {lines.map((line, index) => (
        <div key={`${index}-${line}`}>{line}</div>
      ))}
    </Panel>
  );
};

const Panel = styled.pre`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 32vh;
  margin: 0;
  padding: 4px 6px;
  overflow: hidden;
  z-index: 2000;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.75);
  color: #9f9;
  font: 11px/1.25 Menlo, Consolas, monospace;
`;
