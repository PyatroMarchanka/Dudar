import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress } from "@material-ui/core";
import OfflinePin from "@material-ui/icons/OfflinePin";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { Icon } from "../../global/Icon";
import { Control, Hint, Label, Row, RowTitle, settingsColors } from "./styles";
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
    <>
      <Row>
        <Label>
          <Icon type="material" fill={settingsColors.ink} Icon={OfflinePin} />
          <RowTitle>{t("offline.title")}</RowTitle>
        </Label>
        <Control>
          {status === "saving" ? (
            <Saving>
              <CircularProgress size={20} variant={progress.total ? "determinate" : "indeterminate"} value={percent} />
              <span>{percent}%</span>
            </Saving>
          ) : (
            <SaveButton onClick={onSave} variant="outlined">
              {t(status === "saved" ? "offline.update" : "offline.save")}
            </SaveButton>
          )}
        </Control>
      </Row>
      <StatusHint isError={status === "error" || status === "partly"}>
        {t(
          status === "saved"
            ? "offline.saved"
            : status === "partly"
            ? "offline.partly"
            : status === "error"
            ? "offline.error"
            : "offline.hint"
        )}
      </StatusHint>
    </>
  );
};

const SaveButton = styled(Button)`
  && {
    border-color: ${settingsColors.accent};
    border-radius: 28px;
    color: ${settingsColors.accent};
    font-weight: 600;
    white-space: nowrap;
  }
`;

const Saving = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${settingsColors.ink};
  font-family: Arial, Helvetica, sans-serif;

  .MuiCircularProgress-root {
    color: ${settingsColors.accent};
  }
`;

const StatusHint = styled(Hint)<{ isError: boolean }>`
  color: ${({ isError }: { isError: boolean }) => (isError ? settingsColors.accent : settingsColors.ink)};
`;
