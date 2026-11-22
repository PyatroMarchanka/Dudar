import React, { useState } from 'react';
import styled from 'styled-components';
import { adminSongsApi, VersionInput } from '../../api/adminSongs';
import { describeAdminError } from '../../api/adminMelodies';
import { Song, SongVersion, TimeSignatures, versionLevels } from '../../dataset/songs/interfaces';

const TIME_SIGNATURES: TimeSignatures[] = ['3/4', '4/4', '5/4', '6/4', '6/8', '7/8', '8/8', '9/8', '10/8', '11/8'];

// The form of one version, with the tempo in real BPM
interface VersionForm {
  label: string;
  author: string;
  level: string;
  pathName: string;
  timeSignature: string;
  bpm: number;
  transcribedBy: string;
}

const formOf = (version: SongVersion | null, song: Song): VersionForm => ({
  label: version?.label ?? '',
  author: version?.author ?? '',
  level: version?.level ?? '',
  pathName: version?.source === 'melody' ? '' : (version?.pathName ?? ''),
  timeSignature: version?.timeSignature ?? song.timeSignature,
  bpm: Math.round(Number(version?.originalTempo ?? song.originalTempo ?? 240) / 2),
  transcribedBy: version?.transcribedBy ?? '',
});

const inputOf = (form: VersionForm, version: SongVersion | null): VersionInput => ({
  label: form.label.trim(),
  author: form.author.trim() || undefined,
  level: (form.level || undefined) as VersionInput['level'],
  // A version made from a user's melody keeps its notes and placeholder path
  ...(version?.source === 'melody'
    ? { pathName: version.pathName, melody: version.melody, source: 'melody' as const }
    : { pathName: form.pathName.trim(), source: 'file' as const }),
  timeSignature: form.timeSignature as TimeSignatures,
  originalTempo: Math.round(form.bpm * 2),
  transcribedBy: form.transcribedBy.trim() || undefined,
  links: version?.links ?? [],
});

interface Props {
  song: Song;
  onChange: (song: Song) => void;
}

// The other versions of a song in the admin song editor. Each change is saved at once.
export const VersionsEditor = ({ song, onChange }: Props) => {
  const [message, setMessage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const songId = song._id ?? '';

  const run = async (action: () => Promise<Song>, done: string) => {
    setBusy(true);
    setMessage(undefined);
    try {
      onChange(await action());
      setMessage(done);
    } catch (error) {
      setMessage(describeAdminError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <h2>Other versions</h2>
      <p className="hint">
        The song's own notes above are its default version, shown first. Add versions by other bagpipers or for other
        levels here.
      </p>
      {(song.versions ?? []).map((version) => (
        <VersionCard
          key={`${version._id}:${version.updatedAt ?? ''}`}
          song={song}
          version={version}
          busy={busy}
          onSave={(form) =>
            run(() => adminSongsApi.updateVersion(songId, version._id, inputOf(form, version)), 'Version saved')
          }
          onDelete={() => {
            if (!window.confirm(`Delete the version "${version.label}"?`)) return;
            run(() => adminSongsApi.removeVersion(songId, version._id), 'Version deleted');
          }}
          onMakeDefault={() =>
            run(() => adminSongsApi.makeDefaultVersion(songId, version._id), 'This version is now shown first')
          }
        />
      ))}
      <VersionCard
        key={`new:${song.versions?.length ?? 0}`}
        song={song}
        version={null}
        busy={busy}
        onSave={(form) => run(() => adminSongsApi.addVersion(songId, inputOf(form, null)), 'Version added')}
      />
      {message && <p className="message">{message}</p>}
    </Box>
  );
};

interface CardProps {
  song: Song;
  version: SongVersion | null;
  busy: boolean;
  onSave: (form: VersionForm) => void;
  onDelete?: () => void;
  onMakeDefault?: () => void;
}

const VersionCard = ({ song, version, busy, onSave, onDelete, onMakeDefault }: CardProps) => {
  const [form, setForm] = useState<VersionForm>(() => formOf(version, song));
  const set = <K extends keyof VersionForm>(key: K, value: VersionForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const isMelody = version?.source === 'melody';
  const canSave = form.label.trim() && (isMelody || form.pathName.trim()) && form.bpm > 0;

  return (
    <Card>
      <h3>{version ? version.label : 'Add a version'}</h3>
      <label>
        <span>Version name</span>
        <input value={form.label} maxLength={100} onChange={(e) => set('label', e.target.value)} />
      </label>
      <label>
        <span>Author (bagpiper)</span>
        <input value={form.author} maxLength={200} onChange={(e) => set('author', e.target.value)} />
      </label>
      <label>
        <span>Level</span>
        <select value={form.level} onChange={(e) => set('level', e.target.value)}>
          <option value="">Not set</option>
          {versionLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      {isMelody ? (
        <p className="hint">Notes from a user's melody (edit them from the review page).</p>
      ) : (
        <label>
          <span>.mid path (in public/midi)</span>
          <input
            value={form.pathName}
            maxLength={300}
            placeholder="belarusian/..."
            onChange={(e) => set('pathName', e.target.value)}
          />
        </label>
      )}
      <label>
        <span>Time signature</span>
        <select value={form.timeSignature} onChange={(e) => set('timeSignature', e.target.value)}>
          {Array.from(new Set([form.timeSignature, ...TIME_SIGNATURES])).map((meter) => (
            <option key={meter} value={meter}>
              {meter}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Tempo (BPM)</span>
        <input type="number" min={10} max={400} value={form.bpm} onChange={(e) => set('bpm', Number(e.target.value))} />
      </label>
      <label>
        <span>Transcribed by</span>
        <input value={form.transcribedBy} maxLength={200} onChange={(e) => set('transcribedBy', e.target.value)} />
      </label>
      <div className="row">
        <button disabled={busy || !canSave} onClick={() => onSave(form)}>
          {version ? 'Save version' : 'Add version'}
        </button>
        {onMakeDefault && (
          <button disabled={busy} onClick={onMakeDefault}>
            Show first
          </button>
        )}
        {onDelete && (
          <button className="danger" disabled={busy} onClick={onDelete}>
            Delete
          </button>
        )}
        {version && song.id && (
          <a
            href={`/app/play/${song.id}?v=${encodeURIComponent(version._id)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶ Play
          </a>
        )}
      </div>
    </Card>
  );
};

const Box = styled.section`
  width: 100%;
  max-width: 480px;
  margin: 24px 0;

  h2 {
    font-size: 20px;
    margin: 0 0 4px;
  }

  .hint {
    color: #666;
    font-size: 14px;
    margin: 0 0 12px;
  }

  .message {
    font-weight: 600;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;

  h3 {
    font-size: 16px;
    margin: 0;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 14px;
    color: #666;
  }

  input,
  select {
    padding: 6px 8px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  button {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #999;
    background: #f3f3f3;
    cursor: pointer;
  }

  button.danger {
    border-color: #b00020;
    color: #b00020;
  }
`;
