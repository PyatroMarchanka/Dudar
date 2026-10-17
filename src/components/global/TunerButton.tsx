import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, makeStyles } from "@material-ui/core";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Icon } from "./Icon";
import { mainColors, theme } from "../../utils/theme";
import { Tuner, startTuner } from "../Tuner";

const useStyles = makeStyles(() => ({
  container: {
    padding: 0,
    "&:first-child": {
      paddingTop: 0,
    },
  },
}));

// Wide button in the settings drawer, styled apart from the setting rows
export const TunerButton = () => {
  const { t } = useTranslation("translation");
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  // Close the tuner rather than letting it keep running in the background
  // (e.g. tab switched away or the window loses focus).
  useEffect(() => {
    if (!open) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOpen(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [open]);

  const handleClick = async () => {
    try {
      await startTuner();
      setOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Wrapper>
        <WideButton type="button" onClick={handleClick}>
          <Icon type="tuning-fork" fill={theme.colors.white} />
          <span>{t("tuner")}</span>
        </WideButton>
      </Wrapper>
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogContent classes={{ root: classes.container }}>
          <Tuner />
        </DialogContent>
      </Dialog>
    </>
  );
};

const Wrapper = styled.div`
  padding: 12px 20px;
`;

const WideButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 28px;
  background-color: ${mainColors.darkRed};
  color: ${theme.colors.white};
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  &:hover,
  &:focus-visible {
    background-color: ${mainColors.darkestRed};
  }
`;
