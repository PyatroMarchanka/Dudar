import React, { useContext } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { IconButton, List, ListItem } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Icon } from "../global/Icon";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { mainColors } from "../../utils/theme";
import { store } from "../../context";
import { useTranslation } from "react-i18next";
import { gtmPush } from "../../utils/gtm";
import { bagpipes } from "../../dataset/bagpipes";

interface Props {
  setOpen: (bool: boolean) => void;
  onStop: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "90%",
      marginTop: "20px",
      marginLeft: "20px",
    },
    accordionRoot: {
      backgroundColor: mainColors.darkestRed,
      color: "white",
      fontWeight: 600,
      fontSize: "20px",
      boxShadow: "none",
    },
    summary: {
      backgroundColor: mainColors.darkestRed,
      boxShadow: "none",
      minHeight: "10px",
      marginTop: "5px",
      marginBottom: "5px",
      "&.Mui-expanded": {
        marginTop: "5px",
        minHeight: "10px",
        marginBottom: "5px",
      },
    },
    dudaRoot: {
      marginTop: "60px",
      marginLeft: "20px",
    },
    duda: {},
    heading: {
      fontWeight: "bold",
      fontSize: "20px",
    },
    activeSong: {
      backgroundColor: mainColors.darkRed,
      borderRadius: "4px",
    },
    list: {
      width: "100%",
      padding: "0px",
    },
    buttonRoot: {
      padding: "5px",
    },
    detailsRoot: { padding: "0px 16px 16px" },
  })
);

export const SongsByGenre = ({ setOpen, onStop }: Props) => {
  const { t } = useTranslation("translation");

  const {
    state: { bagpipeType, listsByBagpipe, activeSong },
    setActiveSong,
  } = useContext(store);

  const classes = useStyles();
  const genres = Object.keys(listsByBagpipe || {});

  return (
    <Content>
      <IconButton className="close" onClick={() => setOpen(false)}>
        <Icon type="material" fill="#fff" Icon={Close} />
      </IconButton>
      <div className={classes.dudaRoot}>
        <Typography className={classes.duda}>{t("songList.instrument")}</Typography>
        <Typography>{t(`dudas.${bagpipes[bagpipeType].name}`)}</Typography>
      </div>

      {genres.map((genre) => (
        <div key={genre} className={classes.root}>
          <Accordion
            classes={{
              root: classes.accordionRoot,
            }}
          >
            <AccordionSummary
              classes={{
                root: classes.summary,
                content: classes.summary,
              }}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{t(`genres.${genre}`)}</Typography>
            </AccordionSummary>

            <AccordionDetails classes={{ root: classes.detailsRoot }}>
              <List classes={{ padding: classes.list }}>
                {listsByBagpipe![genre].map((song) => (
                  <div
                    className={activeSong?.pathName === song.pathName ? classes.activeSong : ""}
                    key={song.name}
                  >
                    <IconButton
                      classes={{ root: classes.buttonRoot }}
                      className="songButton"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSong(song);
                        setOpen(false);
                        onStop();
                        gtmPush({ song_name: song.name });
                      }}
                    >
                      <Icon type={activeSong?.pathName === song.pathName ? "song-play" : "music"} />
                      <ListItem className="song-button-gtm" id={song.name}>
                        {song.name}
                      </ListItem>
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
