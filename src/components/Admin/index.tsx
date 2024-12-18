import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import styled from "styled-components";
import { SongEditor } from "./SongEditor";
import { songApi } from "../../api/songClient";
import { Song, SongTypes } from "../../dataset/songs/interfaces";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Admin = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Song }>({
    key: "name",
  });

  useEffect(() => {
    songApi.getSongList().then(setSongs);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTypeFilter(event.target.value);
  };

  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((song) => (typeFilter ? song.type === typeFilter : true))
    .sort((a, b) =>
      (a[sortConfig.key] as any) > (b[sortConfig.key] as any) ? 1 : -1
    );

  const TypeFilter = () => (
    <select value={typeFilter} onChange={handleTypeFilterChange}>
      <option value="">All Types</option>
      {Object.values(SongTypes).map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );

  return (
    <Router>
      <Container>
        <Switch>
          <Route exact path="/admin">
            <Link to="/">To Main Page</Link>
            <h1>Song List</h1>
            <TypeFilter />
            <SearchInput
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Table>
              <thead>
                <tr>
                  <th>№</th>
                  <th onClick={() => setSortConfig({ key: "name" })}>Name</th>
                  <th onClick={() => setSortConfig({ key: "type" })}>Type</th>
                  <th>Path Name</th>
                  <th>About</th>
                  <th>Original Tempo</th>
                  <th>Labels</th>
                  <th>Time Signature</th>
                  <th>Transcribed By</th>
                  <th>Links</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.map((song, id) => (
                  <tr key={song._id}>
                    <td>{id}</td>
                    <td>
                      <Link to={`/admin/song/${song._id}`}>{song.name}</Link>
                    </td>
                    <td>{song.type}</td>
                    <td>{song.pathName ? "X" : ""}</td>
                    <td>{song.about ? "X" : ""}</td>
                    <td>{song.originalTempo ? "X" : ""}</td>
                    <td>{song.labels ? "X" : ""}</td>
                    <td>{song.timeSignature ? "X" : ""}</td>
                    <td>{song.transcribedBy ? "X" : ""}</td>
                    <td>{song.links?.length ? "X" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Route>
          <Route exact path="/admin/song/:id">
            <SongEditor />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default Admin;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  box-sizing: border-box;
  border: 2px solid #009879;
  border-radius: 4px;
  font-size: 1em;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #005f56;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1em;
  font-family: Arial, sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);

  thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
    position: sticky;
    top: 0;
  }

  th,
  td {
    padding: 12px 15px;
    border: 1px solid #dddddd;
  }

  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;
