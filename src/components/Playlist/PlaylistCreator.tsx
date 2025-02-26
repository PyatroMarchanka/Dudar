import React, { useState } from "react";
import styled from "styled-components";
import {
  Close,
  ExpandMore,
  ExpandLess,
  CloseRounded,
  AddBoxOutlined,
} from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlaylistSong } from "../../dataset/songs/interfaces";
import { IconButton, Typography, Button, TextField } from "@material-ui/core";
import { Icon } from "../global/Icon";
import { TagList } from "./TagList";

interface PlaylistCreatorProps {
  allSongs: PlaylistSong[];
  playlists: { title: string; songs: PlaylistSong[] }[];
  onAddPlaylist: (playlist: { title: string; songs: PlaylistSong[] }) => void;
  tags: string[];
}

export const PlaylistCreator: React.FC<PlaylistCreatorProps> = ({
  allSongs,
  playlists,
  onAddPlaylist,
  tags,
}) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isSongsInPlaylistOpen, setIsSongsInPlaylistOpen] = useState(false);
  const [tagsFilters, setTagsFilters] = useState<string[]>([]);

  const handleAddSong = (song: PlaylistSong) => {
    if (!songs.find((s) => s.name === song.name)) {
      setSongs([...songs, song]);
    }
  };

  const goBack = () => {
    setIsAddPlaylistOpen(false);
    setIsSongsInPlaylistOpen(false);
    setSelectedPlaylist(null);
    setSongs([]);
    setPlaylistTitle("");
  };

  const handleRemoveSong = (id: string) => {
    setSongs(songs.filter((song) => song.name !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedSongs = Array.from(songs);
    const [movedSong] = reorderedSongs.splice(result.source.index, 1);
    reorderedSongs.splice(result.destination.index, 0, movedSong);
    setSongs(reorderedSongs);
  };

  const handlePlaylistClick = (index: number) => {
    setSelectedPlaylist(index);
    setSongs(playlists[index].songs);
    setPlaylistTitle(playlists[index].title);
    setIsAddPlaylistOpen(true);
  };

  const filteredSongs = allSongs.filter((song) => {
    if (!tagsFilters.length) return true;
    return tagsFilters.every((tag) => song.tags.includes(tag));
  });

  return (
    <Container>
      <Row>
        {isAddPlaylistOpen ? (
          <>
            <TextField
              label="Playlist Title"
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAddPlaylist({ title: playlistTitle, songs })}
            >
              {selectedPlaylist !== null ? "Save" : "Create"}
            </Button>
            {
              <Button variant="contained" color="secondary" onClick={goBack}>
                Back
              </Button>
            }
          </>
        ) : (
          <Row>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => {
                if (isAddPlaylistOpen && selectedPlaylist !== null) {
                  setIsAddPlaylistOpen(!isAddPlaylistOpen);
                  setIsSongsInPlaylistOpen(!isSongsInPlaylistOpen);
                  setSelectedPlaylist(null);
                  setSongs([]);
                  setPlaylistTitle("");
                } else {
                  setIsAddPlaylistOpen(!isAddPlaylistOpen);
                }
              }}
            >
              <Typography variant="h6">Create Playlist</Typography>
              <Icon
                fill="white"
                type="material"
                Icon={isAddPlaylistOpen ? CloseRounded : AddBoxOutlined}
              />
            </Button>
          </Row>
        )}
      </Row>
      {!isAddPlaylistOpen && (
        <PlaylistList>
          {playlists.map((playlist, index) => (
            <PlaylistItem
              key={playlist.title}
              onClick={() => handlePlaylistClick(index)}
            >
              <Typography variant="h6">{playlist.title}</Typography>
            </PlaylistItem>
          ))}
        </PlaylistList>
      )}
      {!songs.length && selectedPlaylist !== null && (
        <Typography>No songs in playlist</Typography>
      )}
      {selectedPlaylist !== null ? (
        <>
          <PlaylistHeader
            onClick={() => {
              setIsSongsInPlaylistOpen(!isSongsInPlaylistOpen);
            }}
          >
            <Typography variant="h6">Edit songs</Typography>
            <IconButton>
              {isSongsInPlaylistOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </PlaylistHeader>
          {isSongsInPlaylistOpen && (
            <>
              <TagList
                tags={tags}
                tagsFilters={tagsFilters}
                onTagClick={(tag) => {
                  if (tagsFilters.includes(tag)) return;
                  setTagsFilters((prev) => [...prev, tag]);
                }}
                onRemoveTag={(tag) => {
                  setTagsFilters((prev) => prev.filter((t) => t !== tag));
                }}
              />
              <SongSelectionContainer>
                {filteredSongs.map((song) => (
                  <Button key={song.name} onClick={() => handleAddSong(song)}>
                    {song.name}
                  </Button>
                ))}
              </SongSelectionContainer>
            </>
          )}
        </>
      ) : null}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="songs">
          {(provided: any) => (
            <SongList {...provided.droppableProps} ref={provided.innerRef}>
              {songs.map((song, index) => (
                <Draggable
                  key={song.name}
                  draggableId={song.name}
                  index={index}
                >
                  {(provided: any) => (
                    <SongItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SongTitle>
                        <Typography variant="body1">
                          {index + 1}. {song.name}
                        </Typography>
                      </SongTitle>
                      <IconButton onClick={() => handleRemoveSong(song.name)}>
                        <Close />
                      </IconButton>
                    </SongItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </SongList>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const SongSelectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-bottom: 20px;
  gap: 10px;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ccc;
  background-color: #f9f9f9;
  margin-bottom: 5px;
`;

const SongTitle = styled.span`
  flex-grow: 1;
`;

const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-top: 20px;
`;

const PlaylistList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const PlaylistItem = styled.li`
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  background-color: #f0f0f0;
  border-radius: 10px;
  &:hover {
    background-color: rgba(9, 6, 6, 0.2);
  }

  transition: background-color 0.3s ease-in-out;
`;
