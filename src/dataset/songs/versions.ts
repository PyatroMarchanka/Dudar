import { Song, SongVersion, VersionLevel } from './interfaces';

// The URL query parameter that picks a version: /app/play/<id>?v=<version _id>
export const versionParam = 'v';

export interface VersionOption {
  // '' for the song's default version
  id: string;
  // Absent on the default version without a label: shown as "Basic"
  label?: string;
  author?: string;
  level?: VersionLevel;
}

export const hasVersions = (song: Song | null | undefined) => !!song?.versions?.length;

// Every version of a song, the default one first
export const getVersionOptions = (song: Song): VersionOption[] => [
  { id: '', label: song.versionLabel, author: song.versionAuthor, level: song.versionLevel },
  ...(song.versions ?? []).map((version) => ({
    id: version._id,
    label: version.label,
    author: version.author,
    level: version.level,
  })),
];

export const findVersion = (song: Song, versionId: string | null | undefined): SongVersion | undefined =>
  versionId ? song.versions?.find((version) => version._id === versionId) : undefined;

// The song as it plays in one of its versions: the version's notes, tempo and
// time signature over the song's shared fields. The default version (or an
// unknown id) gives back the song itself, so nothing changes for songs without versions.
export const songWithVersion = (song: Song, versionId: string | null | undefined): Song => {
  const version = findVersion(song, versionId);
  if (!version) return song.activeVersionId ? { ...song, activeVersionId: undefined } : song;

  return {
    ...song,
    pathName: version.pathName,
    source: version.source,
    sourceMelodyId: version.sourceMelodyId,
    melody: version.melody,
    timeSignature: version.timeSignature,
    originalTempo: version.originalTempo,
    transcribedBy: version.transcribedBy,
    activeVersionId: version._id,
  };
};

export const readVersionParam = (search: string) => new URLSearchParams(search).get(versionParam) || undefined;

// The search part of a URL that plays `versionId` ('' or undefined: the default version)
export const versionSearch = (versionId?: string) =>
  versionId ? `?${versionParam}=${encodeURIComponent(versionId)}` : '';
