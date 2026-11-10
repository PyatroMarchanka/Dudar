import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from '../../context';
import { getTranslationKeyByBagpipeType } from '../../interfaces/enumUtils';
import { routes } from '../../router/routes';
import { MetaTags } from './MetaTags';
import { StructuredData } from './StructuredData';

interface Props {
  songId: string;
  // The visible song title (transliterated for non-Cyrillic languages).
  title?: string;
}

const DESCRIPTION_LIMIT = 155;

const truncate = (text: string, limit: number) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 0 ? cut.lastIndexOf(' ') : cut.length)}…`;
};

export const songPagePath = (songId: string) => `${routes.app}/${routes.play}/${encodeURIComponent(songId)}`;

// Per-song title, description, canonical, Open Graph and JSON-LD for the player page.
export const SongSeo = ({ songId, title }: Props) => {
  const { t, i18n } = useTranslation('translation');
  const {
    state: { activeSong },
  } = useContext(store);

  if (!activeSong || activeSong.id !== songId) return null;

  const songTitle = title || activeSong.name;
  const songType = activeSong.type ? t(`genres.${activeSong.type}`) : '';
  const bagpipeNames =
    activeSong.bagpipesToPlay
      ?.filter((bagpipe) => (bagpipe as any) !== 'gd')
      .map((bagpipe) => t(`dudas.${getTranslationKeyByBagpipeType(bagpipe)}`)) || [];

  const metaTitle = `${songTitle}${songType ? ` - ${songType}` : ''} | Duda Hero`;
  const fallbackDescription = `Learn to play ${songTitle} on bagpipes with Duda Hero: fingering animation and sheet music${
    bagpipeNames.length ? ` for ${bagpipeNames.join(', ')}` : ''
  }.`;
  const metaDescription = truncate(activeSong.about || fallbackDescription, DESCRIPTION_LIMIT);
  const path = songPagePath(songId);

  return (
    <>
      <MetaTags
        title={metaTitle}
        description={metaDescription}
        language={i18n.language}
        canonicalPath={path}
        type="music.song"
      />
      <StructuredData
        songData={{
          name: activeSong.name,
          genre: songType || 'Traditional',
          description: activeSong.about,
          lyrics: activeSong.lyrycs,
          url: path,
        }}
        breadcrumbs={[
          { name: 'Home', url: routes.main },
          { name: 'Songs', url: routes.playlists },
          { name: songTitle, url: path },
        ]}
      />
    </>
  );
};
