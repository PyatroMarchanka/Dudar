import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IconButton, Typography } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { PlaylistSong } from "../../dataset/songs/interfaces";
import { SongList, SongItem, SongTitle } from "./StyledComponents";

interface DraggableSongListProps {
  songs: PlaylistSong[];
  onDragEnd: (result: any) => void;
  onRemoveSong: (id: string) => void;
}

export const DraggableSongList: React.FC<DraggableSongListProps> = ({
  songs,
  onDragEnd,
  onRemoveSong,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="songs">
        {(provided: any) => (
          <SongList {...provided.droppableProps} ref={provided.innerRef}>
            {songs?.map((song, index) => (
              <Draggable key={song.name} draggableId={song.name} index={index}>
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
                    <IconButton onClick={() => onRemoveSong(song.name)}>
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
  );
};