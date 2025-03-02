import React, { useState } from "react";
import {
  ExpandMore,
  ExpandLess,
  CloseRounded,
  AddBoxOutlined,
} from "@material-ui/icons";
import { IPlaylist, PlaylistSong } from "../../dataset/songs/interfaces";
import { IconButton, Typography, Button } from "@material-ui/core";
import { Icon } from "../global/Icon";
import { TagList } from "./TagList";
import { PlaylistForm } from "./PlaylistForm";
import { PlaylistList } from "./PlaylistList";
import { SongSelection } from "./SongSelection";
import { DraggableSongList } from "./DraggableSongList";
import { Container, Row, PlaylistHeader } from "./StyledComponents";

interface PlaylistCreatorProps {
  allSongs: PlaylistSong[];
  playlists: IPlaylist[];
  onAddPlaylist: (playlist: IPlaylist) => void;
  onRemovePlaylist: (_id: string) => void;
  tags: string[];
}

export const PlaylistCreator: React.FC<PlaylistCreatorProps> = ({
  allSongs,
  playlists,
  onAddPlaylist,
  onRemovePlaylist,
  tags,
}) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [isSongsInPlaylistOpen, setIsSongsInPlaylistOpen] = useState(false);
  const [tagsFilters, setTagsFilters] = useState<string[]>([]);

  const handleAddSong = (song: PlaylistSong) => {
    if (!songs?.find((s) => s._id === song._id)) {
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

    const songs = playlists[index].songsIds
      .map((id) => allSongs.find((song) => song._id === id))
      .filter(Boolean) as PlaylistSong[];
    setSongs(songs);

    setPlaylistTitle(playlists[index].name);
    setIsAddPlaylistOpen(true);
  };

  const onDeleteClick = (_id: string) => {
    onRemovePlaylist(_id);
  };

  const filteredSongs = allSongs.filter((song) => {
    if (!tagsFilters?.length) return true;
    return tagsFilters.every((tag) => song.tags.includes(tag));
  });

  return (
    <Container>
      <Row>
        {isAddPlaylistOpen ? (
          <PlaylistForm
            playlistTitle={playlistTitle}
            setPlaylistTitle={setPlaylistTitle}
            onSave={() => {
              onAddPlaylist({
                ...playlists[selectedPlaylist!],
                name: playlistTitle,
                songsIds: songs.map((song) => song._id!),
              });
              goBack();
            }}
            onCancel={goBack}
            isEditing={selectedPlaylist !== null}
          />
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
        <PlaylistList
          onDeleteClick={onDeleteClick}
          playlists={playlists}
          onPlaylistClick={handlePlaylistClick}
        />
      )}
      {!songs?.length && selectedPlaylist !== null && (
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
              <SongSelection
              addedSongs={songs}
                filteredSongs={filteredSongs}
                handleAddSong={handleAddSong}
              />
            </>
          )}
        </>
      ) : null}
      <DraggableSongList
        songs={songs}
        onDragEnd={handleDragEnd}
        onRemoveSong={handleRemoveSong}
      />
    </Container>
  );
};
