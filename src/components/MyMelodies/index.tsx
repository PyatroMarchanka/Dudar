import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button as MuiButton, CircularProgress, TextField, Typography } from '@material-ui/core';
import { Navbar } from '../global/Navbar';
import { Icon } from '../global/Icon';
import { ShareButton } from '../ShareButton';
import { Button } from '../global/Button';
import { store } from '../../context';
import { routes } from '../../router/routes';
import { mainColors } from '../../utils/theme';
import { mediaQueries } from '../../constants/style';
import { abcToMidi } from '../../utils/midiUtils';
import { getMelodyError, melodiesApi, UserMelody } from '../../api/melodies';

const EXAMPLE_ABC = `X:1
T:My first tune
M:3/4
L:1/8
Q:1/4=100
K:Am
E2 A2 B2 | c4 B2 | A2 G2 F2 | E6 |
E2 A2 B2 | c4 d2 | e2 d2 c2 | B6 |
c2 B2 A2 | G4 F2 | E2 F2 G2 | A6 |]`;

const MAX_TITLE_LENGTH = 200;

type Parsed = { title: string; error?: undefined } | { error: string; title?: undefined };

// Runs the same conversion the player uses, so a melody that saves also plays
const parseAbc = (abc: string): Parsed | null => {
  if (!abc.trim()) return null;
  try {
    return { title: abcToMidi(abc).song.name };
  } catch (error: any) {
    return { error: error?.message || 'Invalid ABC notation' };
  }
};

export const MyMelodies = () => {
  const { t } = useTranslation('translation');
  const history = useHistory();
  const {
    state: { userData },
  } = useContext(store);
  const isLoggedIn = !!userData?._id;

  const [melodies, setMelodies] = useState<UserMelody[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [abc, setAbc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    melodiesApi
      .getMyMelodies()
      .then(setMelodies)
      .catch((error) => {
        console.log(error);
        setLoadError(true);
      });
  }, [isLoggedIn]);

  const parsed = useMemo(() => parseAbc(abc), [abc]);
  const finalTitle = (title.trim() || parsed?.title || '').slice(0, MAX_TITLE_LENGTH);
  const canSave = !!parsed?.title && !!finalTitle && !isSaving;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAbc('');
    setSaveError(undefined);
  };

  const onSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setSaveError(undefined);
    try {
      const input = { title: finalTitle, abc };
      if (editingId) {
        const updated = await melodiesApi.updateMelody(editingId, input);
        setMelodies((list) => (list ?? []).map((melody) => (melody.id === updated.id ? updated : melody)));
      } else {
        const added = await melodiesApi.addMelody(input);
        setMelodies((list) => [added, ...(list ?? [])]);
      }
      resetForm();
    } catch (error) {
      console.log(error);
      setSaveError(getMelodyError(error) || t('melodies.saveError') || undefined);
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (melody: UserMelody) => {
    setEditingId(melody.id);
    setTitle(melody.title);
    setAbc(melody.abc);
    setSaveError(undefined);
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onDelete = async (melody: UserMelody) => {
    if (!window.confirm(t('melodies.confirmDelete', { title: melody.title }) ?? '')) return;
    try {
      await melodiesApi.removeMelody(melody.id);
      setMelodies((list) => (list ?? []).filter((item) => item.id !== melody.id));
      if (editingId === melody.id) resetForm();
    } catch (error) {
      console.log(error);
      window.alert(t('melodies.deleteError') ?? '');
    }
  };

  const onPaste = async () => {
    setSaveError(undefined);
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setSaveError(t('melodies.clipboardEmpty') || undefined);
        return;
      }
      setAbc(text);
    } catch (error) {
      console.log(error);
      setSaveError(t('melodies.pasteError') || undefined);
    }
  };

  const onTry = () => {
    if (parsed?.title) {
      // Close the phone keyboard first, otherwise the player measures the shrunken window and cuts the bagpipe.
      (document.activeElement as HTMLElement | null)?.blur?.();
      history.push(`${routes.app}/${routes.abc}?abc=${encodeURIComponent(abc)}`);
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Title variant="h4">{t('melodies.title')}</Title>
        <Subtitle>
          {t('melodies.subtitle')}{' '}
          <a href="https://abcnotation.com/learn" target="_blank" rel="noreferrer">
            {t('melodies.learnAbc')}
          </a>
        </Subtitle>

        {!isLoggedIn ? (
          <Card>
            <Typography>{t('melodies.loginRequired')}</Typography>
            <Actions>
              <Button type="big" onClick={() => history.push(routes.login)}>
                {t('login.login')}
              </Button>
            </Actions>
          </Card>
        ) : (
          <>
            <SavedContainer>
              <SectionTitle variant="h4" className="sectionSubtitle">
                {t('melodies.saved')}
              </SectionTitle>
              {loadError ? (
                <ErrorText>{t('melodies.loadError')}</ErrorText>
              ) : !melodies ? (
                <CircularProgress />
              ) : !melodies.length ? (
                <Typography>{t('melodies.noMelodies')}</Typography>
              ) : (
                <List>
                  {melodies.map((melody) => (
                    <Item key={melody.id}>
                      <PlayIcon>
                        <Icon type="song-play" fill={mainColors.red} />
                      </PlayIcon>
                      <ItemTitle to={`${routes.app}/${routes.melody}/${melody.id}`}>{melody.title}</ItemTitle>
                      <ItemDate>{new Date(melody.updatedAt).toLocaleDateString()}</ItemDate>
                      <ItemActions>
                        <ShareButton
                          url={`${window.location.origin}${routes.app}/${routes.melody}/${melody.id}`}
                          title={melody.title}
                        />
                        <MuiButton
                          component={Link}
                          to={`${routes.app}/${routes.melody}/${melody.id}`}
                          color="primary"
                          size="small"
                        >
                          {t('melodies.play')}
                        </MuiButton>
                        <MuiButton size="small" onClick={() => onEdit(melody)}>
                          {t('melodies.edit')}
                        </MuiButton>
                        <MuiButton size="small" onClick={() => onDelete(melody)}>
                          {t('melodies.delete')}
                        </MuiButton>
                      </ItemActions>
                    </Item>
                  ))}
                </List>
              )}
            </SavedContainer>

            <Card ref={editorRef}>
              <TextField
                label={t('melodies.nameLabel')}
                value={title}
                placeholder={parsed?.title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: MAX_TITLE_LENGTH }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
              <AbcField
                label={t('melodies.abcLabel')}
                value={abc}
                onChange={(e) => setAbc(e.target.value)}
                placeholder={EXAMPLE_ABC}
                multiline
                minRows={10}
                maxRows={24}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                error={!!parsed?.error}
                helperText={
                  parsed?.error
                    ? `${t('melodies.invalid')}: ${parsed.error}`
                    : parsed?.title
                      ? t('melodies.valid')
                      : t('melodies.empty')
                }
              />
              {saveError && <ErrorText>{saveError}</ErrorText>}
              <Actions>
                <Button onClick={onSave} disabled={!canSave}>
                  {isSaving ? <CircularProgress size={16} /> : editingId ? t('melodies.update') : t('melodies.save')}
                </Button>
                {!!navigator.clipboard?.readText && (
                  <MuiButton variant="outlined" onClick={onPaste}>
                    {t('melodies.paste')}
                  </MuiButton>
                )}
                <MuiButton variant="outlined" onClick={onTry} disabled={!parsed?.title}>
                  {t('melodies.tryIt')}
                </MuiButton>
                {editingId ? (
                  <MuiButton onClick={resetForm}>{t('melodies.cancelEdit')}</MuiButton>
                ) : (
                  !abc && <MuiButton onClick={() => setAbc(EXAMPLE_ABC)}>{t('melodies.example')}</MuiButton>
                )}
              </Actions>
              <Hint>{t('melodies.privacy')}</Hint>
            </Card>
          </>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  padding-top: 70px;
  background-color: ${mainColors.lightestGrey};
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 1rem;
  }
`;

const Title = styled(Typography)`
  color: ${mainColors.darkerGray};
  font-weight: 700 !important;
`;

const Subtitle = styled(Typography)`
  color: ${mainColors.darkerGray};
  margin: 0.5rem 0 1.5rem !important;

  a {
    color: ${mainColors.orange};
  }
`;

const Card = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 1rem 1.5rem 1.5rem;

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 0.5rem 1rem 1rem;
  }
`;

const AbcField = styled(TextField)`
  textarea {
    font-family: 'Roboto Mono', Menlo, Consolas, monospace;
    /* iOS Safari zooms the page into any input under 16px and keeps the zoom on later screens */
    font-size: 16px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Hint = styled(Typography).attrs({ variant: 'body2' })`
  color: ${mainColors.darkerGray};
  margin-top: 1rem !important;
`;

const ErrorText = styled(Typography)`
  color: #c62828;
  margin-top: 0.5rem !important;
`;

const SavedContainer = styled.div`
  padding: 1rem;
  background-color: ${mainColors.lightestGrey};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled(Typography)`
  color: ${mainColors.darkerGray};
  margin-bottom: 1rem !important;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Item = styled.li`
  font-family: 'Roboto', sans-serif;
  background: white;
  border-radius: 6px;
  padding: 0.5rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'icon title actions'
    'icon date actions';
  align-items: center;
  column-gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background-color: ${mainColors.lightGrey};
  }

  @media (max-width: ${mediaQueries.mobile}) {
    grid-template-columns: auto 1fr;
    grid-template-areas: 'icon title' 'icon date' 'actions actions';
  }
`;

const PlayIcon = styled.span`
  grid-area: icon;
  display: flex;
`;

const ItemTitle = styled(Link)`
  grid-area: title;
  color: ${mainColors.darkerGray};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover {
    color: ${mainColors.orange};
  }
`;

const ItemDate = styled.span`
  grid-area: date;
  font-size: 12px;
  color: ${mainColors.midGrey};
`;

const ItemActions = styled.div`
  grid-area: actions;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: -8px;
`;
