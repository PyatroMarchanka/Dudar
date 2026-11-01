import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { songApi } from '../../api/songClient';
import { adminSongsApi } from '../../api/adminSongs';
import { routes } from '../../router/routes';
import { Song, SongTypes } from '../../dataset/songs/interfaces';

// All catalog songs (/admin)
export const SongList = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Song }>({
    key: 'name',
  });

  // What to remove by hand after deleting a song that has a .mid file
  const [leftover, setLeftover] = useState<Song | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    adminSongsApi
      .list()
      .then(setSongs)
      .catch(() => songApi.getSongList().then(setSongs));
  }, []);

  const onDelete = async (song: Song) => {
    const fileNote =
      song.source === 'melody'
        ? ''
        : '\n\nThe .mid file stays in the repository until it is deleted in a deploy; only the list entry is removed now.';
    if (!song._id || !window.confirm(`Delete "${song.name}" from the song list for all users?${fileNote}`)) return;
    setError(undefined);
    try {
      await adminSongsApi.remove(song._id);
      setSongs((list) => list.filter((item) => item._id !== song._id));
      setLeftover(song.source === 'melody' ? null : song);
    } catch (err: any) {
      console.log(err);
      setError(err?.response?.data?.error || 'Could not delete the song');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(event.target.value);
  };

  const filteredSongs = songs
    .filter((song) => song.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((song) => (typeFilter ? song.type === typeFilter : true))
    .sort((a, b) => ((a[sortConfig.key] as any) > (b[sortConfig.key] as any) ? 1 : -1));

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
    <>
      <h1>Song List</h1>
      {error && <Notice className="error">{error}</Notice>}
      {leftover && (
        <Notice>
          "{leftover.name}" is removed from the list. To remove its file for good, delete{' '}
          <code>{leftover.pathName}</code> from <code>public/midi</code> and the entry with id{' '}
          <code>{leftover.id}</code> from <code>list.json</code> in dudahero-midi, then deploy. Until then the file is
          just unused. <button onClick={() => setLeftover(null)}>OK</button>
        </Notice>
      )}
      <TypeFilter />
      <SearchInput type="text" placeholder="Search songs..." value={searchTerm} onChange={handleSearchChange} />
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>№</th>
              <th onClick={() => setSortConfig({ key: 'name' })}>Name</th>
              <th>Dudahero link</th>
              <th onClick={() => setSortConfig({ key: 'type' })}>Type</th>
              <th>Path Name</th>
              <th>About</th>
              <th>Original Tempo</th>
              <th>Labels</th>
              <th>Time Signature</th>
              <th>Transcribed By</th>
              <th>Links</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredSongs.map((song, id) => (
              <tr key={song._id}>
                <td>{id}</td>
                <td>
                  <Link to={`/admin/song/${song._id}`}>{song.name}</Link>
                  {song.source === 'melody' && (
                    <UserTuneMark title="Approved from a user's melody">user tune</UserTuneMark>
                  )}
                </td>
                <td>
                  <a href={`/app/play/${song.id}`} target="_blank" rel="noopener noreferrer">
                    open
                  </a>
                </td>
                <td>{song.type}</td>
                <td>{song.pathName ? 'X' : ''}</td>
                <td>{song.about ? 'X' : ''}</td>
                <td>{song.originalTempo ? 'X' : ''}</td>
                <td>{song.labels ? 'X' : ''}</td>
                <td>{song.timeSignature ? 'X' : ''}</td>
                <td>{song.transcribedBy ? 'X' : ''}</td>
                <td>{song.links?.length ? 'X' : ''}</td>
                <td>
                  <Link to={`${routes.adminSongNotes}/${song._id}`}>Edit notes</Link>
                </td>
                <td>
                  <DeleteButton onClick={() => onDelete(song)}>Delete</DeleteButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </>
  );
};

export const SearchInput = styled.input`
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

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
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

const UserTuneMark = styled.span`
  margin-left: 6px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
  background: #e8f5e9;
  color: #2e7d32;
  white-space: nowrap;
`;

const Notice = styled.p`
  max-width: 800px;
  padding: 10px 14px;
  border-radius: 6px;
  background: #fff8e1;
  line-height: 1.5;

  &.error {
    background: #ffebee;
    color: #c62828;
  }
`;

const DeleteButton = styled.button`
  color: #c62828;
  background: none;
  border: 1px solid #c62828;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
`;
