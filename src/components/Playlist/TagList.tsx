import { Chip } from "@material-ui/core";
import styled from "styled-components";
import { Close } from "@material-ui/icons";

interface Props {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  onTagClick?: (tag: string) => void;
  tagsFilters: string[];
}

export const TagList = ({
  onRemoveTag = () => {},
  onTagClick = () => {},
  tags,
  tagsFilters
}: Props) => {
  return (
    <TagListStyled>
      {tags.map((tag) => (
        <TagContainer key={tag}>
          <Chip
            label={tag}
            onClick={(e) => {
              e.stopPropagation();
              onTagClick(tag);
            }}
            onDelete={() => onRemoveTag(tag)}
            deleteIcon={tags.includes(tag) ? <Close /> : undefined}
            color={tagsFilters.includes(tag) ? "primary" : "default"}
          />
        </TagContainer>
      ))}
    </TagListStyled>
  );
};

const TagListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
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
