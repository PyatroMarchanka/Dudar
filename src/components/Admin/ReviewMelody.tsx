import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { adminMelodiesApi, AdminMelody, CatalogFields } from '../../api/adminMelodies';
import { getMelodyError, reviewStatusOf } from '../../api/melodies';
import { songApi } from '../../api/songClient';
import { Song, SongTags, SongTypes, TimeSignatures } from '../../dataset/songs/interfaces';
import { getTranslationKeyByBagpipeType } from '../../interfaces/enumUtils';
import { routes } from '../../router/routes';
import { abcToMidi } from '../../utils/midiUtils';
import { findBagpipesForMelody } from '../../utils/midiUtils/catalogMelody';
import { ReviewBadge } from '../MyMelodies/ReviewBadge';
import { REVIEW_CHANGED_EVENT } from './AdminMenu';

const TIME_SIGNATURES: TimeSignatures[] = ['3/4', '4/4', '5/4', '6/4', '6/8', '7/8', '8/8', '9/8', '10/8', '11/8'];
const DEFAULT_BPM = 100;

// The approve form, in real BPM; sent as the catalog's double tempo
// Bagpipes aren't in it: they are found from the melody's notes
type CatalogForm = Omit<CatalogFields, 'originalTempo' | 'bagpipesToPlay'> & { bpm: number };

const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : '');

// What the melody itself says about its meter and tempo
const readMelody = (melody: AdminMelody): { timeSignature: string; bpm: number } => {
  if (melody.format === 'roll' && melody.roll) {
    return { timeSignature: melody.roll.timeSignature, bpm: melody.roll.bpm };
  }
  try {
    const { song } = abcToMidi(melody.abc ?? '');
    return {
      timeSignature: song.timeSignature,
      bpm: song.originalTempo ? Math.round(song.originalTempo / 2) : DEFAULT_BPM,
    };
  } catch (error) {
    return { timeSignature: '4/4', bpm: DEFAULT_BPM };
  }
};

// Prefilled from the catalog song of an earlier approval, otherwise from the melody
const initialForm = (melody: AdminMelody, song: Song | null): CatalogForm => {
  if (song) {
    return {
      name: song.name,
      type: song.type,
      timeSignature: song.timeSignature,
      bpm: song.originalTempo ? Math.round(Number(song.originalTempo) / 2) : DEFAULT_BPM,
      labels: song.labels ?? [],
      about: song.about ?? '',
      transcribedBy: song.transcribedBy ?? melody.ownerName ?? '',
    };
  }
  const { timeSignature, bpm } = readMelody(melody);
  return {
    name: melody.title,
    type: SongTypes.Other,
    timeSignature,
    bpm,
    labels: [],
    about: '',
    transcribedBy: melody.ownerName ?? '',
  };
};

// One melody a user sent in (/admin/melody/:id): who added it, play, edit, approve into the catalog or reject
export const ReviewMelody = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { t } = useTranslation('translation');

  const [melody, setMelody] = useState<AdminMelody | null>(null);
  const [loadError, setLoadError] = useState<string>();
  const [form, setForm] = useState<CatalogForm | null>(null);
  const [comment, setComment] = useState('');
  const [removeFromCatalog, setRemoveFromCatalog] = useState(false);
  const [abcTitle, setAbcTitle] = useState('');
  const [abcText, setAbcText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const load = async () => {
    try {
      const loaded = await adminMelodiesApi.get(id);
      let song: Song | null = null;
      if (loaded.catalogSongId) {
        song = await songApi.getSongData(loaded.catalogSongId).catch(() => null);
      }
      setMelody(loaded);
      setForm(initialForm(loaded, song));
      setComment(loaded.reviewComment ?? '');
      setAbcTitle(loaded.title);
      setAbcText(loaded.abc ?? '');
    } catch (error: any) {
      console.log(error);
      setLoadError(error?.response?.data?.error || 'Could not load the melody');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const abcCheck = useMemo(() => {
    if (melody?.format === 'roll') return null;
    try {
      abcToMidi(abcText);
      return null;
    } catch (error: any) {
      return error?.message || 'Cannot read this ABC';
    }
  }, [abcText, melody?.format]);

  // The bagpipes that can play the saved melody, from its notes
  const bagpipesToPlay = useMemo(
    () =>
      melody ? findBagpipesForMelody({ format: melody.format, abc: melody.abc, roll: melody.roll }, melody.title) : [],
    [melody]
  );

  if (loadError) return <p>{loadError}</p>;
  if (!melody || !form) return <p>Loading...</p>;

  const status = reviewStatusOf(melody);
  const abcChanged = melody.format !== 'roll' && (abcTitle.trim() !== melody.title || abcText !== (melody.abc ?? ''));

  const run = async (action: () => Promise<void>, done: string) => {
    setBusy(true);
    setMessage(undefined);
    try {
      await action();
      setMessage(done);
    } catch (error) {
      console.log(error);
      setMessage(getMelodyError(error) || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const onSaveAbc = () =>
    run(async () => {
      setMelody(await adminMelodiesApi.update(melody.id, { title: abcTitle.trim(), format: 'abc', abc: abcText }));
    }, 'Melody saved');

  const onApprove = () => {
    if (!bagpipesToPlay.length) {
      setMessage('No bagpipe can play all the notes of this melody');
      return;
    }
    run(
      async () => {
        const { bpm, ...fields } = form;
        const { melody: approved } = await adminMelodiesApi.approve(melody.id, {
          ...fields,
          bagpipesToPlay,
          originalTempo: Math.round(bpm * 2),
          comment: comment.trim() || undefined,
        });
        setMelody(approved);
        window.dispatchEvent(new Event(REVIEW_CHANGED_EVENT));
      },
      melody.catalogSongId ? 'Catalog song updated' : 'Approved and added to the catalog'
    );
  };

  const onReject = () => {
    if (removeFromCatalog && !window.confirm('Remove this song from the catalog?')) return;
    run(async () => {
      const { melody: rejected } = await adminMelodiesApi.reject(melody.id, {
        comment: comment.trim() || undefined,
        removeFromCatalog,
      });
      setMelody(rejected);
      window.dispatchEvent(new Event(REVIEW_CHANGED_EVENT));
      setRemoveFromCatalog(false);
    }, 'Rejected');
  };

  const setField = <K extends keyof CatalogForm>(key: K, value: CatalogForm[K]) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  return (
    <Page>
      <BackLink
        to={status === 'approved' || status === 'rejected' ? `${routes.adminReview}/${status}` : routes.adminReview}
      >
        ← Back to the list
      </BackLink>
      <h1>
        {melody.title} <ReviewBadge status={status} />
      </h1>

      <Section>
        <Owner>
          {melody.ownerPicture && <Avatar src={melody.ownerPicture} alt="" referrerPolicy="no-referrer" />}
          <div>
            <strong>Added by {melody.ownerName ?? 'unknown user'}</strong>
            {melody.ownerEmail && <Muted>{melody.ownerEmail}</Muted>}
          </div>
        </Owner>
        <Facts>
          <li>Format: {melody.format === 'roll' ? 'drawn in the editor' : 'ABC notation'}</li>
          <li>Created: {formatDate(melody.createdAt)}</li>
          {melody.submittedAt && <li>Sent for review: {formatDate(melody.submittedAt)}</li>}
          {melody.reviewedAt && (
            <li>
              {status === 'approved' ? 'Approved' : 'Reviewed'}: {formatDate(melody.reviewedAt)}
              {melody.reviewedByName && ` by ${melody.reviewedByName}`}
            </li>
          )}
          {melody.lastEditedBy && melody.lastEditedBy !== melody.ownerId && (
            <li>Last edited by {melody.lastEditedByName ?? 'an admin'}</li>
          )}
          {melody.catalogSongId && (
            <li>
              In the catalog: <Link to={`${routes.adminSong}/${melody.catalogSongId}`}>edit catalog song</Link>
            </li>
          )}
        </Facts>
        <Row>
          <a href={`${routes.app}/${routes.melody}/${melody.id}`} target="_blank" rel="noopener noreferrer">
            ▶ Play
          </a>
          {melody.format === 'roll' && (
            <button onClick={() => history.push(`${routes.melodyEditor}/${melody.id}?admin=1`)}>
              Edit in the editor
            </button>
          )}
        </Row>
      </Section>

      {melody.format !== 'roll' && (
        <Section>
          <h2>Edit</h2>
          <Field>
            <span>Title</span>
            <input value={abcTitle} maxLength={200} onChange={(e) => setAbcTitle(e.target.value)} />
          </Field>
          <Field>
            <span>ABC notation</span>
            <textarea rows={10} value={abcText} onChange={(e) => setAbcText(e.target.value)} />
          </Field>
          {abcCheck && <ErrorText>{abcCheck}</ErrorText>}
          <button disabled={busy || !abcChanged || !!abcCheck || !abcTitle.trim()} onClick={onSaveAbc}>
            Save melody
          </button>
        </Section>
      )}

      <Section>
        <h2>{melody.catalogSongId ? 'Catalog song' : 'Add to the catalog'}</h2>
        <Field>
          <span>Name</span>
          <input value={form.name} maxLength={200} onChange={(e) => setField('name', e.target.value)} />
        </Field>
        <Field>
          <span>Type</span>
          <select value={form.type} onChange={(e) => setField('type', e.target.value)}>
            {Object.values(SongTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <span>Bagpipes to play (found from the notes)</span>
          {bagpipesToPlay.length ? (
            <BagpipeList>
              {bagpipesToPlay.map((type) => (
                <li key={type}>{t(`dudas.${getTranslationKeyByBagpipeType(type)}`)}</li>
              ))}
            </BagpipeList>
          ) : (
            <ErrorText>No bagpipe can play all the notes of this melody.</ErrorText>
          )}
        </Field>
        <Field>
          <span>Time signature</span>
          <select value={form.timeSignature} onChange={(e) => setField('timeSignature', e.target.value)}>
            {Array.from(new Set([form.timeSignature, ...TIME_SIGNATURES])).map((meter) => (
              <option key={meter} value={meter}>
                {meter}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <span>Tempo (BPM)</span>
          <input
            type="number"
            min={20}
            max={400}
            value={form.bpm}
            onChange={(e) => setField('bpm', Number(e.target.value))}
          />
        </Field>
        <Field>
          <span>Labels</span>
          <Checks>
            {Object.values(SongTags).map((label) => (
              <label key={label}>
                <input
                  type="checkbox"
                  checked={form.labels.includes(label)}
                  onChange={() => setField('labels', toggle(form.labels, label))}
                />
                {label}
              </label>
            ))}
          </Checks>
        </Field>
        <Field>
          <span>Transcribed by</span>
          <input
            value={form.transcribedBy}
            maxLength={200}
            onChange={(e) => setField('transcribedBy', e.target.value)}
          />
        </Field>
        <Field>
          <span>About</span>
          <textarea rows={3} value={form.about} onChange={(e) => setField('about', e.target.value)} />
        </Field>
      </Section>

      <Section>
        <h2>Decision</h2>
        <Field>
          <span>Comment to the author (optional)</span>
          <textarea rows={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} />
        </Field>
        {melody.catalogSongId && (
          <label>
            <input
              type="checkbox"
              checked={removeFromCatalog}
              onChange={(e) => setRemoveFromCatalog(e.target.checked)}
            />{' '}
            When rejecting, also remove the song from the catalog
          </label>
        )}
        {status === 'draft' && <ErrorText>The author took this melody back, so it can't be reviewed now.</ErrorText>}
        <Row>
          <ApproveButton disabled={busy || status === 'draft' || abcChanged} onClick={onApprove}>
            {melody.catalogSongId ? 'Approve and update the catalog song' : 'Approve and add to the catalog'}
          </ApproveButton>
          <RejectButton disabled={busy || status === 'draft'} onClick={onReject}>
            Reject
          </RejectButton>
        </Row>
        {abcChanged && <Muted>Save your edits to the melody first.</Muted>}
        {message && <Message>{message}</Message>}
      </Section>
    </Page>
  );
};

const Page = styled.div`
  width: 100%;
  max-width: 720px;
  margin-bottom: 40px;

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 18px;
    margin: 0 0 12px;
  }
`;

const BackLink = styled(Link)`
  color: #009879;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 16px;
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Muted = styled.small`
  display: block;
  color: #777;
`;

const Facts = styled.ul`
  margin: 12px 0;
  padding-left: 18px;
  line-height: 1.6;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  > span {
    font-size: 13px;
    color: #666;
  }

  input:not([type='checkbox']),
  select,
  textarea {
    font-size: 16px;
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  textarea {
    font-family: 'Roboto Mono', Menlo, Consolas, monospace;
  }
`;

const Checks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;

  label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const ErrorText = styled.p`
  color: #c62828;
`;

const Message = styled.p`
  font-weight: bold;
`;

const ApproveButton = styled.button`
  padding: 8px 14px;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #bbb;
    cursor: default;
  }
`;

const RejectButton = styled(ApproveButton)`
  background: #c62828;
`;

const BagpipeList = styled.ul`
  margin: 0;
  padding-left: 18px;
`;
