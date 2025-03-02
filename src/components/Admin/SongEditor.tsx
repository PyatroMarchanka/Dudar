import React, { useState, useEffect } from "react";
import { songApi } from "../../api/songClient";
import { Song, SongLink, SongTypes } from "../../dataset/songs/interfaces";

import styled from "styled-components";
import { useParams } from "react-router-dom";
import { LinksEditor } from "./LinksEditor";
import { Button } from "../global/Button";
import { IconButton, Input, Typography } from "@material-ui/core";
import { Icon } from "../global/Icon";
import { useTranslation } from "react-i18next";
import { getTranslationKeyByBagpipeType } from "../../interfaces/enumUtils";

export const SongEditor: React.FC = () => {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialSong, setInitialSong] = useState<Song>();
  const params: any = useParams();
  const { t } = useTranslation("translation");

  const isSaveDisabled = () => {
    if (!song || !initialSong) return true;
    const keys = Object.keys(song) as (keyof Song)[];

    return keys.some((key) => song[key] !== initialSong[key]);
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const song = await songApi.getSongData(params.id);
        setSong(song);
        setInitialSong(song);
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [params.id]);

  const handleChange = ({ name, value }: { name: string; value: any }) => {
    setSong((prevSong) => (prevSong ? { ...prevSong, [name]: value } : null));
  };

  const handleSave = async () => {
    if (song) {
      try {
        await songApi.updateSong(song);
        alert("Song updated successfully!");
      } catch (error) {
        console.error("Error updating song:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!song) {
    return <div>No song found</div>;
  }

  const fieldsInOrder = [
    "name",
    "pathName",
    "about",
    "lyrycs",
    "originalTempo",
    "labels",
    "timeSignature",
    "transcribedBy",
  ];

  const multiLineFields = ["about", "lyrycs"];

  const typeSwitchInput = () => {
    return (
      <>
        <Label>Type</Label>
        <TypeSelect
          name="type"
          value={song.type}
          onChange={(e) =>
            handleChange({
              name: e.target.name,
              value: e.target.value as unknown as SongTypes,
            })
          }
        >
          {Object.keys(SongTypes).map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </TypeSelect>
      </>
    );
  };

  return (
    <Container>
      <IconButton className="back" onClick={() => window.history.back()}>
        <Icon type="back" />
      </IconButton>
      <Title>Edit Song</Title>
      {typeSwitchInput()}
      <LinksEditor
        links={song.links}
        updateLinks={(links: SongLink[]) =>
          handleChange({ name: "links", value: links })
        }
      />
      {fieldsInOrder.map((key) => (
        <FormGroup key={key}>
          <Label key={key}>{key}:</Label>
          <Input
            multiline={multiLineFields.includes(key)}
            type="text"
            className="input"
            name={key}
            value={(song as any)[key as keyof Song]}
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
          />
        </FormGroup>
      ))}
      <FormGroup>
        <Label>Bagpipes to Play:</Label>
        {song.bagpipesToPlay.map((type) => (
          <Typography key={type} variant="body1">
            {t(`dudas.${getTranslationKeyByBagpipeType(type)}`)}
          </Typography>
        ))}
      </FormGroup>
      <Button disabled={!isSaveDisabled()} onClick={handleSave}>
        Save
      </Button>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;

  .back {
    align-self: flex-start;
  }
`;

const TypeSelect = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .input {
    width: 100%;
    max-width: 400px;
    margin-bottom: 40px;
  }
  /* max-width: 400px; */
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;
