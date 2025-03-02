import React, { useState } from "react";
import { SongEditor } from "./SongEditor";
import { TagEditor } from "./TagEditor";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { PlaylistCreator } from "./PlaylistCreator";
import styled, { createGlobalStyle } from "styled-components";
import { usePlaylists } from "../../hooks/usePlaylists";
import { TabPanel } from "./TabPanel";
import { Home } from "@material-ui/icons";
import { Link } from "react-router-dom";

interface Props {}

export const Playlists = (props: Props) => {
  const {
    tags,
    songs,
    editedSong,
    playlists,
    setEditedSong,
    onAddPlaylist,
    onAddTag,
    onRemoveTag,
    onAddSong,
    onUpdatedSong,
    onRemoveSong,
    onRemovePlaylist,
  } = usePlaylists();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container>
      <GlobalStyle />
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          centered
          value={activeTab}
          onChange={handleTabChange}
          aria-label="playlist tabs"
        >
          <Tab label="Playlists" {...ariaProps(0)} />
          <Tab label="Songs" {...ariaProps(1)} />
          <Tab label="Tags" {...ariaProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <PlaylistCreator
          allSongs={songs}
          onRemovePlaylist={onRemovePlaylist}
          playlists={playlists}
          onAddPlaylist={onAddPlaylist}
          tags={tags}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <SongEditor
          tags={tags}
          songs={songs}
          editingSong={editedSong}
          setEditingSong={setEditedSong}
          onAddSong={onAddSong}
          onUpdatedSong={onUpdatedSong}
          onRemoveSong={onRemoveSong}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <TagEditor tags={tags} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
      </TabPanel>
      <Link className="back" to="/">
        <Home fontSize="large" />
      </Link>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  position: relative;

  .back {
    position: fixed;
    bottom: 25px;
    left: 25px;
    z-index: 1000;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const ariaProps = (index: any) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};
