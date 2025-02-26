import React, { useContext, useState } from "react";
import { SongEditor } from "./SongEditor";
import { store } from "../../context";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { TagEditor } from "./TagEditor";
import { AppBar, Tabs, Tab, Box } from "@material-ui/core";
import { PlaylistCreator } from "./PlaylistCreator";
import { createGlobalStyle } from "styled-components";

interface Props {}

const sortSongs = (songs: { name: string; tags: string[] }[]) => {
  return songs.sort((a, b) => a.name.localeCompare(b.name));
};

export const Playlists = (props: Props) => {
  const {
    state: { userData },
  } = useContext(store);

  useGoogleProfile();

  const initialSongs = [
    { name: "Greensleeves", tags: ["medieval", "dance"] },
    { name: "Saltarello", tags: ["medieval", "dance"] },
    { name: "Douce Dame Jolie", tags: ["medieval", "ballad"] },
    { name: "La Rotta", tags: ["medieval", "dance"] },
    { name: "Lamento di Tristano", tags: ["medieval", "instrumental"] },
    { name: "Estampie", tags: ["medieval", "dance"] },
    { name: "Cantiga 166", tags: ["medieval", "instrumental"] },
    { name: "Palästinalied", tags: ["medieval", "ballad"] },
    { name: "Trotto", tags: ["medieval", "dance"] },
    { name: "Ecco la Primavera", tags: ["medieval", "ballad"] },
  ];

  const uniqueTags = Array.from(
    new Set(initialSongs.flatMap((song) => song.tags))
  );

  const [tags, setTags] = useState(uniqueTags);
  const [songs, setSongs] = useState(sortSongs(initialSongs));
  const [editedSong, setEditedSong] = useState<string | null>(null);

  const [playlists, setPlaylists] = useState([
    {
      title: "My first playlist",
      songs: [{ name: "Bohemian Rhapsody", tags: ["rock", "classic"] }],
    },
  ]);

  const onAddPlaylist = (playlist: {
    title: string;
    songs: { name: string; tags: string[] }[];
  }) => {
    setPlaylists([
      ...playlists.filter((p) => p.title !== playlist.title),
      playlist,
    ]);
  };

  const onAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const onRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onAddSong = (song: { name: string; tags: string[] }) => {
    const updatedSongs = [...songs.filter((s) => s.name !== song.name), song];
    const orderedSongs = sortSongs(updatedSongs);

    setSongs(orderedSongs);
  };

  const onUpdatedSong = (song: { name: string; tags: string[] }) => {
    const updatedSongs = songs.map((s) => (s.name === song.name ? song : s));
    const orderedSongs = sortSongs(updatedSongs);
    setSongs(orderedSongs);
  };

  const onRemoveSong = (songName: string) => {
    setSongs(songs.filter((song) => song.name !== songName));
  };

  const TabPanel = (props: {
    children?: React.ReactNode;
    index: any;
    value: any;
  }) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box p={0}>{children}</Box>}
      </div>
    );
  };

  const ariaProps = (index: any) => {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <GlobalStyle />
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          centered
          value={value}
          onChange={handleChange}
          aria-label="playlist tabs"
        >
          <Tab label="Playlists" {...ariaProps(0)} />
          <Tab label="Songs" {...ariaProps(1)} />
          <Tab label="Tags" {...ariaProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <PlaylistCreator
          allSongs={songs}
          playlists={playlists}
          onAddPlaylist={onAddPlaylist}
          tags={tags}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      <TabPanel value={value} index={2}>
        <TagEditor tags={tags} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
      </TabPanel>
    </div>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;
