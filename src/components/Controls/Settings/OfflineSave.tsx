import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress } from "@material-ui/core";
import OfflinePin from "@material-ui/icons/OfflinePin";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { mainColors } from "../../../utils/theme";
import { Icon } from "../../global/Icon";
import { isOfflineSaveSupported, isSavedForOffline, OfflineProgress, saveForOffline } from "../../../utils/offline";

type Props = {
  midiPlayer?: MidiPlayer | null;
};

type Status = "idle" | "saving" | "saved" | "partly" | "error";

// Saves the chosen bagpipe's sounds and all songs, so lessons work without
// a connection.
export const OfflineSave = ({ midiPlayer }: Props) => {
  const { t } = useTranslation("translation");
  const {
    state: { bagpipeType },
  } = useContext(store);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<OfflineProgress>({ done: 0, total: 0 });

  useEffect(() => {
    let isCurrent = true;
    isSavedForOffline(bagpipeType).then((saved) => {
      if (isCurrent) {
        setStatus((current) => (current === "saving" ? current : saved ? "saved" : "idle"));
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [bagpipeType]);

  if (!isOfflineSaveSupported()) {
    return null;
  }

  const onSave = async () => {
    setStatus("saving");
    try {
      const { failed } = await saveForOffline(bagpipeType, midiPlayer?.getClickSoundUrls() || [], setProgress);
      setStatus(failed ? "partly" : "saved");
    } catch (error) {
      console.log(error);
      setStatus("error");
    }
  };

  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <Container>
      <Row>
        <Icon type="material" fill={mainColors.darkerGray} Icon={OfflinePin} />
        <Title>{t("offline.title")}</Title>
        {status === "saving" ? (
          <Saving>
            <CircularProgress size={20} variant={progress.total ? "determinate" : "indeterminate"} value={percent} />
            <span>{percent}%</span>
          </Saving>
        ) : (
          <Button onClick={onSave} className="save-button">
            {t(status === "saved" ? "offline.update" : "offline.save")}
          </Button>
        )}
      </Row>
      <Hint isError={status === "error" || status === "partly"}>
        {t(
          status === "saved"
            ? "offline.saved"
            : status === "partly"
            ? "offline.partly"
            : status === "error"
            ? "offline.error"
            : "offline.hint"
        )}
      </Hint>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 20px 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  .save-button {
    margin-left: auto;
    color: ${mainColors.darkRed};
    font-weight: 600;
    white-space: nowrap;
  }
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;

const Saving = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${mainColors.midGrey};
  font-family: Arial, Helvetica, sans-serif;

  .MuiCircularProgress-root {
    color: ${mainColors.darkRed};
  }
`;

const Hint = styled.div<{ isError: boolean }>`
  margin-top: -8px;
  font-size: 13px;
  font-family: Arial, Helvetica, sans-serif;
  color: ${({ isError }: { isError: boolean }) => (isError ? mainColors.darkRed : mainColors.midGrey)};
`;
