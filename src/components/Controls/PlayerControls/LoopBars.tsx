import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Theme,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoop } from "../../../hooks/useLoop";
import LoopIcon from "@material-ui/icons/Loop";

import { useLongPress } from "../../../hooks/useLongPress";
import { Icon } from "../../global/Icon";
import { mainColors } from "../../../utils/theme";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { store } from "../../../context";

interface Props {
  player: MidiPlayer | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    display: "flex",
    justifyContent: "center",
    userSelect: "none",
  },
  title: {
    textAlign: "center",
  },
  noSelect: {
    userSelect: "none",
  }
}));

export const LoopBars = ({ player }: Props) => {
  const {
    state: { loopBars },
    setLoopBars,
  } = useContext(store);

  const classes = useStyles();

  const { t } = useTranslation();

  const [isLoopMenuOpen, setIsLoopMenuOpen] = useState(false);
  const { onLoop, isLoop } = useLoop(player);

  const onLongPress = () => {
    if (!isLoopMenuOpen) {
      setIsLoopMenuOpen(true);
    }
  };

  const options = [1, 2, 4, 6, 8].map((num) => ({
    label: `${num} ${t("looper.bars")}`,
    value: num,
  }));

  const longPressEvent = useLongPress(onLongPress, 500);

  useEffect(() => {
    player?.setLoopBarsCount(loopBars);
  }, [loopBars, player]);

  return (
    <>
      <Dialog
        maxWidth="xs"
        className={classes.noSelect}
        open={isLoopMenuOpen}
        onClose={() => setIsLoopMenuOpen(false)}
      >
        <DialogTitle className={classes.title}>
          {t("looper.selectBarsCount")}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <Select
            id="bars-select"
            value={loopBars}
            onChange={(e) => {
              setLoopBars(e.target.value as number);
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
      </Dialog>
      <IconButton onClick={onLoop} {...longPressEvent} className="icon loop-icon">
        <Icon
          type="material"
          fill={isLoop ? mainColors.darkerGray : mainColors.lightGrey}
          Icon={LoopIcon}
          className="play-icon"
        />
      </IconButton>
    </>
  );
};
