import React from "react";
import styled from "styled-components";

interface Props {
  setActiveSong: (fileName: string) => void;
  list: string[];
}

export default ({ setActiveSong, list }: Props) => {
  return (
    <List>
      {list.map((filename) => (
        <ListItem onClick={() => setActiveSong(filename)}>
          {filename.split(".midi").join("")}
        </ListItem>
      ))}
    </List>
  );
};

const List = styled.div`
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
`;

const ListItem = styled.h4`
  text-decoration: underline;

  &:hover {
    text-decoration-color: aliceblue;
    cursor: pointer;
  }
`;
