import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { songApi } from "../../api/songClient";
import { Song } from "../../dataset/songs/interfaces";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { useTranslation } from "react-i18next";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
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

const PlayCount = styled.div`
  display: flex;
  align-items: center;
  color: ${mainColors.red};
  font-weight: 600;
  margin-left: 0.5rem;
  font-size: 12px;
`;

const TopSongs: React.FC = () => {
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const history = useHistory();
  const { t } = useTranslation();
  const isCyrilicLang = useIsCyrylicLang();

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const songs = await songApi.getTopSongs(10);
        setTopSongs(songs);
      } catch (error) {
        console.error("Error fetching top songs:", error);
      }
    };

    fetchTopSongs();
  }, []);

  const handleSongClick = (song: Song) => {
    history.push(`${routes.app}/${routes.play}/${song.id}`);
  };

  return (
    <Container>
      <SongList>
        <Typography variant="h4" className="sectionSubtitle">
          {t("aboutPage.popularSongs", "Popular Songs")}
        </Typography>

        {topSongs.map((song) => (
          <SongItem key={song.id} onClick={() => handleSongClick(song)}>
            <Icon type="song-play" fill={mainColors.red} />
            <SongInfo>
              <SongName>
                {!isCyrilicLang() ? transliterate(song.name) : song.name}
              </SongName>
              <SongType>{t(`genres.${song.type}`)}</SongType>
            </SongInfo>
            <PlayCount>
              <Icon
                type="material"
                Icon={PlayArrowIcon}
                fill={mainColors.red}
              />
              {song.stats?.views || 0}
            </PlayCount>
          </SongItem>
        ))}
      </SongList>
    </Container>
  );
};

export default TopSongs;
