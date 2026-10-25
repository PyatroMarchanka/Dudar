import { ReactNode, useEffect, useState } from 'react';
import { loadSongList } from '../api/appData';
import { useGoogleProfile } from '../hooks/useGoogleProfile';
import { routes } from '../router/routes';
import { BackdropSpinner } from './global/BackdropSpinner';

// The ABC player is embedded in other sites and works without the catalog
export const isEmbeddablePage = () => window.location.pathname.startsWith(`${routes.app}/${routes.abc}`);

interface Props {
  children: ReactNode;
}

// Applies the user's settings and waits for the song catalog once, when the
// app opens, showing a spinner until both are in. The screens render under the
// spinner, so their own requests start at the same time.
export const AppDataLoader = ({ children }: Props) => {
  const [isEmbedded] = useState(isEmbeddablePage);
  const { loading: isProfileLoading } = useGoogleProfile();
  const [isSongListLoading, setIsSongListLoading] = useState(!isEmbedded);

  useEffect(() => {
    if (!isSongListLoading) return;
    loadSongList()
      .catch(() => {})
      .finally(() => setIsSongListLoading(false));
  }, []);

  return (
    <>
      {children}
      <BackdropSpinner isOpen={!isEmbedded && (isProfileLoading || isSongListLoading)} />
    </>
  );
};
