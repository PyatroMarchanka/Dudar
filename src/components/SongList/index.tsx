import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { noSongsLabel, store } from "../../context";
import { useSongList } from "../../hooks/useSongLIst";
import { formatMidiFileName } from "../../utils/textUtils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: 200,
      display: "flex",
      justifyContent: "center",
    },
    content: {
      width: 300,
      display: "flex",
      margin: 0,
      justifyContent: "flex-start",
    },
    select: {
      width: "100%",
    },
    formControl: {},
  })
);

export default () => {
  const {
    state: { activeSong, genreList },
    setActiveSong,
    setGenreList,
  } = useContext(store);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { songList, allLists } = useSongList();
  const genres = Object.keys(allLists);

  return (
    <>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Songs
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.content}>
          <Select
            className={classes.select}
            value={genreList || ""}
            onChange={(e) => {
              setGenreList(e.target.value as string);
            }}
            labelId="demo-dialog-select-label"
            id="demo-dialog-select"
            input={<Input />}
          >
            <MenuItem value={noSongsLabel}>
              <em>None</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem value={genre}>{genre}</MenuItem>
            ))}
          </Select>
          {genreList && songList?.length && (
            <Select
              className={classes.select}
              value={activeSong || ""}
              onChange={(e) => {
                setActiveSong(e.target.value as string);
                setOpen(false);
              }}
              labelId="demo-dialog-select-label"
              id="demo-dialog-select"
              input={<Input />}
              defaultValue={activeSong}
            >
              <MenuItem value={noSongsLabel}>
                <em>None</em>
              </MenuItem>
              {songList?.map((filename) => (
                <MenuItem value={filename}>
                  {formatMidiFileName(filename)}
                </MenuItem>
              ))}
            </Select>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
