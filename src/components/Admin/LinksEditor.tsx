import React, { useState } from "react";
import styled from "styled-components";
import { LinkTypes, SongLink } from "../../dataset/songs/interfaces";
import { Button } from "../global/Button";
import { Typography } from "@material-ui/core";

interface LinksEditorProps {
  links: SongLink[];
  updateLinks: (links: SongLink[]) => void;
}

export const LinksEditor: React.FC<LinksEditorProps> = ({
  links,
  updateLinks,
}) => {
  const [localLinks, setLocalLinks] = useState<SongLink[]>(links);

  const handleLinkChange = (
    index: number,
    field: keyof SongLink,
    value: any
  ) => {
    const updatedLinks = [...localLinks];
    updatedLinks[index][field] = value;
    setLocalLinks(updatedLinks);
    updateLinks(updatedLinks);
  };

  const addNewLink = () => {
    setLocalLinks([
      ...localLinks,
      { url: "", type: LinkTypes.Video, name: "" },
    ]);
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...localLinks];
    updatedLinks.splice(index, 1);
    setLocalLinks(updatedLinks);
    updateLinks(updatedLinks);
  };

  const typeSwitchInput = (
    value: LinkTypes,
    handleLinkChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ) => {
    return (
      <TypeSelect name="type" value={value} onChange={handleLinkChange}>
        {Object.keys(LinkTypes).map((type) => {
          return (
            <option key={type} value={type}>
              {type}
            </option>
          );
        })}
      </TypeSelect>
    );
  };

  return (
    <Container>
      <Typography variant="h6">Links</Typography>
      {localLinks.map((link, index) => (
        <LinkContainer key={index}>
          <Label>
            URL:
            <Input
              type="text"
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
            />
          </Label>
          {typeSwitchInput(
            link.type,
            (e: React.ChangeEvent<HTMLSelectElement>) =>
              handleLinkChange(index, "type", e.target.value)
          )}
          <Label>
            Name:
            <Input
              type="text"
              value={link.name}
              onChange={(e) => handleLinkChange(index, "name", e.target.value)}
            />
          </Label>
          <Button onClick={() => removeLink(index)}>Remove</Button>
        </LinkContainer>
      ))}
      <AddButton onClick={addNewLink}>Add New Link</AddButton>
    </Container>
  );
};

const TypeSelect = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
  margin-top: 40px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
