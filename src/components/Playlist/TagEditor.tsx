import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button, Chip } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

interface TagEditorProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({
  tags = [],
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
          <TagContainer key={tag}>
            <Chip
              label={tag}
              onDelete={() => onRemoveTag(tag)}
              deleteIcon={tags.includes(tag) ? <Close /> : undefined}
              color={"default"}
            />
          </TagContainer>
        ))}
      </TagList>
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

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  > div {
    &:hover {
      cursor: pointer;
    }
    margin-right: 10px;
  }
`;
