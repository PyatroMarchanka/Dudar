import React, { useContext } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { Button, IconButton, List, ListItem } from "@material-ui/core";
import { Close, Videocam } from "@material-ui/icons";
import { Icon } from "../global/Icon";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { mainColors } from "../../utils/theme";
import { store } from "../../context";
import { useTranslation } from "react-i18next";
import { bagpipes } from "../../dataset/bagpipes";
import { SongTagsWrapper } from "./SongTagsWrapper";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { LinkTypes, Song } from "../../dataset/songs/interfaces";
import { useUserLastSong } from "../../hooks/useUserLastSong";

interface Props {
  setOpen: (bool: boolean) => void;
  onStop: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "90%",
      marginTop: "20px",
      marginLeft: "5px",
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
    duda: {},
    heading: {
      fontWeight: "bold",
      fontSize: "20px",
    },
    activeSong: {
      backgroundColor: mainColors.darkRed,
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    list: {
      width: "100%",
      padding: "0px",
    },
    buttonRoot: {
      padding: "5px 0px 5px 5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textTransform: "none",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "16px",
      color: "white",
      "&.songButton": {
        display: "flex",
        textTransform: "none",
        alignItems: "center",
        justifyContent: "flex-start",
      },
    },
    ".MuiButton-label": {
      textTransform: "none",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    listItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      // width: "100%",
    },
    playsCount: {
      paddingRight: "10px",
    },
    detailsRoot: { padding: "0px 0px 16px 5px" },
  })
);

export const SongsByGenre = ({ setOpen, onStop }: Props) => {
  const { t } = useTranslation("translation");
  const {
    state: { bagpipeType, listsByBagpipe, activeSong },
  } = useContext(store);
  const history = useHistory();

  const { updateUserLastSong } = useUserLastSong();

  const classes = useStyles();
  const genres = Object.keys(listsByBagpipe || {});

  const onSongClick = (e: any, song: Song) => {
    e.stopPropagation();
    history.push(`${routes.app}/${routes.play}/${song.id}`);
    updateUserLastSong(song.id);
    setOpen(false);
    onStop();
  };

  if (!bagpipeType) return null;

  return (
    <Content>
      <div className="row">
        <IconButton onClick={() => setOpen(false)}>
          <Icon type="material" fill="#fff" Icon={Close} />
        </IconButton>
        <div>
          <Typography className={classes.duda}>
            {t("songList.instrument")}
          </Typography>
          <Typography>{t(`dudas.${bagpipes[bagpipeType].name}`)}</Typography>
        </div>
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
              <Typography className={classes.heading}>
                {t(`genres.${genre}`)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.detailsRoot }}>
              <List classes={{ padding: classes.list }}>
                {listsByBagpipe![genre].map((song) => (
                  <div
                    className={
                      activeSong?.pathName === song.pathName
                        ? classes.activeSong
                        : classes.listItem
                    }
                    key={song.name}
                  >
                    {song.stats?.views > 0 && (
                      <Typography
                        variant="subtitle1"
                        className={classes.playsCount}
                      >
                        {song.stats.views}
                      </Typography>
                    )}
                    <button
                      className={classes.buttonRoot}
                      onClick={(e) => onSongClick(e, song)}
                    >
                      <Icon type="song-play" />
                      <ListItem className="song-button-gtm" id={song.name}>
                        {song.name}
                      </ListItem>
                      {song.links.some(
                        (link) => link.type === LinkTypes.Video
                      ) && (
                        <Icon
                          className="videoIcon"
                          fill={mainColors.lightestGrey}
                          type="material"
                          Icon={Videocam}
                        />
                      )}
                      {song.lyrycs && (
                        <Icon
                          className="video-icon"
                          type="lyrycs"
                          fill={mainColors.lightestGrey}
                        />
                      )}
                    </button>
                  </div>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
      <SongTagsWrapper />
    </Content>
  );
};

const Content = styled.div`
  @media (max-width: ${mediaQueries.mobile}) {
    width: 100vw;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
  }

  width: 350px;
  z-index: 10;

  .songButton {
    color: white;
    font-size: 16px;
    width: 100%;
  }

  .video-icon {
    align-self: self-start;
    width: 35px;
    height: 35px;
  }
`;
