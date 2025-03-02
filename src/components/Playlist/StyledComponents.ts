import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

export const SongSelectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  margin-bottom: 20px;
  gap: 10px;
`;

export const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const SongItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ccc;
  background-color: #f9f9f9;
  margin-bottom: 5px;
`;

export const SongTitle = styled.span`
  flex-grow: 1;
`;

export const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-top: 20px;
`;

export const PlaylistListContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

export const PlaylistItem = styled.li`
  display: flex;
  justify-content: space-between;
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
