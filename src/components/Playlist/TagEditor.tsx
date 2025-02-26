import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, TextField, Button, Typography } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import { Icon } from "../global/Icon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

interface TagEditorProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState<string>("");

  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    onAddTag(newTag);
    setNewTag("");
  };

  return (
    <Container>
      <>
        <InputContainer>
          <TextField
            label="New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            variant="outlined"
          />
          <Button onClick={handleAddTag} variant="contained" color="primary">
            Add Tag
          </Button>
        </InputContainer>
        <TagList>
          {tags.map((tag) => (
            <Tag key={tag}>
              <TagText>{tag}</TagText>
              <IconButton onClick={() => onRemoveTag(tag)}>
                <Icon type="material" Icon={Close} />
              </IconButton>
            </Tag>
          ))}
        </TagList>
      </>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const Tag = styled.div`
  background-color: #e0e0e0;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TagText = styled.span`
  margin-right: 5px;
`;
