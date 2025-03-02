import React, { useContext } from "react";
import { store } from "../../context";
import styled from "styled-components";
import { mainColors } from "../../utils/theme";
import { SongTags } from "../../dataset/songs/interfaces";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

interface Props {}

export const SongTagsWrapper = (props: Props) => {
  const {
    state: { songTags },
  } = useContext(store);

  return (
    <div>
      {songTags.map((tag) => (
        <TagComponent key={tag} tag={tag} />
      ))}
    </div>
  );
};

const TagComponent = ({ tag }: { tag: SongTags }) => {
  const {
    setActiveSongTags,
    state: { activeSongTags },
  } = useContext(store);
  const { t } = useTranslation("translation");
  const isActive = activeSongTags.includes(tag);

  const onClick = () => {
    if (isActive) {
      setActiveSongTags(activeSongTags.filter((songTag) => songTag !== tag));
    } else {
      setActiveSongTags([...activeSongTags, tag]);
    }
  };

  return (
    <Tag active={isActive} onClick={onClick}>
      <Typography variant="body2">{t(`tags.${tag}`)}</Typography>
    </Tag>
  );
};

const Tag = styled.div`
  background-color: ${({ active }: { active: boolean }) =>
    active ? mainColors.red : mainColors.lightGrey};
  display: inline-flex;
  border-radius: 20px;
  color: ${({ active }: { active: boolean }) => (active ? "white" : "black")};
  padding: 5px;
  margin: 5px;
`;
