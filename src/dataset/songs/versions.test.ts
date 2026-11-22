import { Song } from './interfaces';
import { getVersionOptions, readVersionParam, songWithVersion, versionSearch } from './versions';

const song = {
  _id: 's1',
  id: 'belarusian_Test',
  name: 'Test',
  type: 'belarusian',
  bagpipesToPlay: [],
  timeSignature: '2/4',
  pathName: 'belarusian/test.mid',
  labels: [],
  links: [],
  originalTempo: 200,
  transcribedBy: 'A',
  stats: { views: 0, likes: 0, lastViewed: new Date(0) },
  versions: [
    {
      _id: 'v1',
      label: 'Ornamented',
      author: 'Piper',
      level: 'advanced',
      pathName: 'melody/s1/v1',
      source: 'melody',
      timeSignature: '6/8',
      originalTempo: 300,
    },
  ],
} as unknown as Song;

describe('song versions', () => {
  it('keeps the song as it is for the default version or an unknown id', () => {
    expect(songWithVersion(song, undefined)).toBe(song);
    expect(songWithVersion(song, 'nope')).toBe(song);
  });

  it('plays a version with its own notes over the shared fields', () => {
    const played = songWithVersion(song, 'v1');
    expect(played).toMatchObject({
      _id: 's1',
      name: 'Test',
      pathName: 'melody/s1/v1',
      source: 'melody',
      timeSignature: '6/8',
      originalTempo: 300,
      transcribedBy: undefined,
      activeVersionId: 'v1',
    });
    expect(songWithVersion(played, undefined).activeVersionId).toBeUndefined();
  });

  it('lists the default version first', () => {
    expect(getVersionOptions(song).map((option) => option.id)).toEqual(['', 'v1']);
  });

  it('reads and writes the URL parameter', () => {
    expect(readVersionParam('?v=v1')).toBe('v1');
    expect(readVersionParam('')).toBeUndefined();
    expect(versionSearch('v1')).toBe('?v=v1');
    expect(versionSearch(undefined)).toBe('');
  });
});
