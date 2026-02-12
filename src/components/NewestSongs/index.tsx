import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { songApi } from "../../api/songClient";
import { Song } from "../../dataset/songs/interfaces";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { useTranslation } from "react-i18next";
import { transliterate, useIsCyrylicLang } from "../../locales";
import { Typography } from "@material-ui/core";

const Container = styled.div`
  padding: 1rem;
  background-color: ${mainColors.lightestGrey};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SongItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(5px);
    background-color: ${mainColors.lightGrey};
  }
`;

const SongInfo = styled.div`
  flex: 1;
  margin-left: 0.5rem;
`;

const SongName = styled.h3`
  color: ${mainColors.darkerGray};
  font-size: 14px;
  margin: 0;
  font-family: "Roboto", sans-serif;
`;

const SongType = styled.span`
  color: ${mainColors.midGrey};
  font-size: 12px;
  font-family: "Roboto", sans-serif;
`;

const AddedDate = styled.div`
  display: flex;
  align-items: center;
  color: ${mainColors.midGrey};
  font-size: 12px;
  margin-left: 0.5rem;
`;

const NewestSongs: React.FC = () => {
  const [newestSongs, setNewestSongs] = useState<Song[]>([]);
  const history = useHistory();
  const { t } = useTranslation();
  const isCyrilicLang = useIsCyrylicLang();

  useEffect(() => {
    const fetchNewestSongs = async () => {
      try {
        const songs = await songApi.getNewSongs(10);
        setNewestSongs(songs);
      } catch (error) {
        console.error("Error fetching newest songs:", error);
      }
    };

    fetchNewestSongs();
  }, []);

  const handleSongClick = (song: Song) => {
    history.push(`${routes.app}/${routes.play}/${song.id}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Container>
  <Typography variant="h4" className="sectionSubtitle">
          {t("aboutPage.newestSongs")}
        </Typography>
      <SongList>
        {newestSongs.map((song) => (
          <SongItem key={song.id} onClick={() => handleSongClick(song)}>
            <Icon type="song-play" fill={mainColors.red} />
            <SongInfo>
              <SongName>
                {!isCyrilicLang() ? transliterate(song.name) : song.name}
              </SongName>
              <SongType>{t(`genres.${song.type}`)}</SongType>
            </SongInfo>
            {song.createdAt && (
              <AddedDate>{formatDate(song.createdAt.toString())}</AddedDate>
            )}
          </SongItem>
        ))}
      </SongList>
    </Container>
  );
};

export default NewestSongs;
