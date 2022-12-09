import React, { useContext } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { formatMidiFileName } from "../../utils/textUtils";
import { capitalize, IconButton, List, ListItem } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Icon } from "../global/Icon";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { mainColors } from "../../utils/theme";
import { store } from "../../context";

interface Props {
  genreName: string;
  songsNames: string[];
  setOpen: (bool: boolean) => void;
  onStop: () => void;
  allLists: {
    [key: string]: string[];
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },

    accordionRoot: {
      backgroundColor: mainColors.darkestRed,
      color: "white",
      fontWeight: 600,
      fontSize: "20px",
      boxShadow: "none",
    },
    expanded: {
      marginTop: "10px",
      marginBottom: "10px",
      minHeight: "30px",
    },
    summary: {
      backgroundColor: mainColors.darkestRed,
      boxShadow: "none",
      minHeight: "30px",
      marginTop: "10px",
      marginBottom: "10px",
    },
    heading: {
      fontWeight: "bold",
      fontSize: "20px",
    },
    activeSong: {
      backgroundColor: mainColors.darkRed,
    },
  })
);

export const SongsByGenre = ({
  genreName,
  songsNames,
  allLists,
  setOpen,
  onStop,
}: Props) => {
  const classes = useStyles();
  const genres = Object.keys(allLists);

  const {
    setActiveSong,
    state: { activeSong },
  } = useContext(store);

  return (
    <Content>
      <IconButton className="close" onClick={() => setOpen(false)}>
        <Icon type="material" fill="#fff" Icon={Close} />
      </IconButton>

      {genres.map((genre) => (
        <div className={classes.root}>
          <Accordion
            classes={{
              root: classes.accordionRoot,
            }}
          >
            <AccordionSummary
              classes={{
                root: classes.summary,
                expanded: classes.expanded,
                content: classes.summary,
              }}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {capitalize(genre)}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <List>
                {allLists[genre].map((song) => (
                  <div
                    className={
                      activeSong === `${genre}/${song}`
                        ? classes.activeSong
                        : ""
                    }
                    key={song}
                  >
                    <IconButton
                      className="songButton"
                      onClick={() => {
                        setActiveSong(`${genre}/${song}`);
                        onStop();
                      }}
                    >
                      <Icon
                        type={
                          activeSong === `${genre}/${song}`
                            ? "song-play"
                            : "music"
                        }
                      />
                      <ListItem>{formatMidiFileName(song)}</ListItem>
                    </IconButton>
                  </div>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </Content>
  );
};

const Content = styled.div`
  @media (max-width: ${mediaQueries.mobile}) {
    width: 100vw;
  }

  width: 300px;
  z-index: 10;
  .close {
    position: absolute;
    right: 10px;
    margin-top: 10px;
    z-index: 100;
  }

  .songButton {
    color: white;
    font-size: 16px;
  }
`;
