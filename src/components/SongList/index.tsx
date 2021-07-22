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
import { store } from "../../context";
import { useSongList } from "../../hooks/useSongLIst";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {},
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

export default () => {
  const {
    state: { activeSong },
    setActiveSong,
  } = useContext(store);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { songList } = useSongList();

  return (
    <>
      <Button onClick={() => setOpen(true)}>Songs</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select song</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">None</InputLabel>
              <Select
                value={activeSong}
                onChange={(e) => {
                  setActiveSong(e.target.value as string);
                  setOpen(false);
                }}
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {songList.map((filename) => (
                  <MenuItem value={filename}>
                    {filename.split(".midi").join("")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
      </Dialog>
      {/* <List>
        {songList.map((filename) => (
          <ListItem onClick={() => setActiveSong(filename)}>
            {filename.split(".midi").join("")}
          </ListItem>
        ))}
      </List> */}
    </>
  );
};

const List = styled.div`
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
`;

const ListItem = styled.h4`
  text-decoration: underline;

  &:hover {
    text-decoration-color: aliceblue;
    cursor: pointer;
  }
`;
