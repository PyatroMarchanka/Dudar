import React, { useEffect, useState } from "react";
import { Song } from "../../dataset/songs/interfaces";
import { songApi } from "../../api/songClient";
import { keys } from "lodash";
import styled from "styled-components";
import { Button } from "../global/Button";

const Input = ({
  initialValue,
  handleEdit,
  onBlur,
}: {
  initialValue: string;
  handleEdit: (value: string) => void;
  onBlur: (value: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  const finishEdit = () => {
    onBlur(value);
  };
  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handleEdit(e.target.value);
      }}
      onBlur={finishEdit}
    />
  );
};

export const Admin: React.FC = () => {
  const [list, setList] = useState<Song[]>([]);
  const [updatedSongs, setUpdatedSongs] = useState<Song[]>([]);
  const [editableField, setEditableField] = useState<{ [key: string]: string }>(
    {}
  );
  const handleEdit = (id: string, key: string, value: string) => {
    setUpdatedSongs((prev) => list.filter((song) => song.id === id));
  };

  const getList = async () => {
    const songList = await songApi.getSongList();
    const sortedList = songList.sort((a, b) => a.name.localeCompare(b.name));
    setList(sortedList);
  };

  useEffect(() => {
    getList();
  }, []);

  const headers = list[0] ? Object.keys(list[0]) : [];

  const stringifyField = (field: any) => {
    if (Array.isArray(field)) {
      return field.join(", ");
    }
    return field;
  };

  useEffect(() => {
    const table = document.querySelector("ul");
    if (!table) return;

    let isResizing = false;
    let currentTh: HTMLElement | null = null;
    let startOffset = 0;

    const handleMouseDown = (e: MouseEvent) => {
      currentTh = (e.target as HTMLElement).closest("span");
      if (!currentTh) return;

      isResizing = true;
      startOffset = e.pageX - currentTh.offsetWidth;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !currentTh) return;

      const newWidth = e.pageX - startOffset;
      currentTh.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      isResizing = false;
      currentTh = null;
    };

    table.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      table.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const onBlur = (value: string, key: keyof Song, songId: string) => {
    const newList = list.filter((song) => song.id !== songId);
    const newSong: Song | undefined = list.find((song) => song.id === songId);
    if (!newSong) return;

    (newSong as any)[key] = value;
    newList.push(newSong);
    setList(newList.sort((a, b) => a.name.localeCompare(b.name)));
    setEditableField({});
  };

  const handleSave = async () => {
    try {
      await Promise.all(updatedSongs.map((song) => songApi.updateSong(song)));
      alert("Songs updated successfully!");
      setUpdatedSongs([]);
    } catch (error: any) {
      console.error("Failed to update songs", error);
      alert(`Failed to update songs ${error.message}`);
    }
  };

  return (
    <Wrapper headers={headers}>
      <h1>Admin Panel</h1>
      <Button
        className="save"
        disabled={updatedSongs.length === 0}
        onClick={handleSave}
      >
        Save
      </Button>
      <ul>
        <li>
          {headers.map((header) => (
            <span key={header}>{header}</span>
          ))}
        </li>
        {list.map((song) => (
          <li key={song.id}>
            {keys(song).map((key: any) => (
              <span
                key={key}
                onClick={() => setEditableField({ id: song.id, key })}
              >
                {editableField.id === song.id && editableField.key === key ? (
                  <Input
                    initialValue={stringifyField(song as any)[key]}
                    handleEdit={(value) => handleEdit(song.id, key, value)}
                    onBlur={(value: string) => onBlur(value, key, song.id)}
                  />
                ) : (
                  stringifyField((song as any)[key])
                )}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
const Wrapper = styled.div<{ headers: string[] }>`
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  ul {
    display: grid;
    grid-template-columns: repeat(${({ headers }) => headers.length}, 1fr);
    gap: 10px;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: contents;
  }

  span {
    font-weight: bold;
    font-family: "Roboto", sans-serif;
  }

  span,
  input {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
    background-color: #fff;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  span:hover,
  input:focus {
    background-color: #f0f0f0;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }

  .save {
    width: 100px;
    position: fixed;
    top: 20px;
    right: 20px;
  }
`;
