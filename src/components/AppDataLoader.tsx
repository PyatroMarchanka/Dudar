import { ReactNode, useEffect, useState } from 'react';
import { loadSongList } from '../api/appData';
import { useGoogleProfile } from '../hooks/useGoogleProfile';
import { routes } from '../router/routes';
import { BackdropSpinner } from './global/BackdropSpinner';

// The ABC player is embedded in other sites and works without the catalog
export const isEmbeddablePage = () => window.location.pathname.startsWith(`${routes.app}/${routes.abc}`);

// The spinner never holds the app for longer than this, whatever the server does
const MAX_SPINNER_MS = 6000;

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
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsTimedOut(true), MAX_SPINNER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSongListLoading) return;
    loadSongList()
      .catch(() => {})
      .finally(() => setIsSongListLoading(false));
  }, []);

  return (
    <>
      {children}
      <BackdropSpinner isOpen={!isEmbedded && !isTimedOut && (isProfileLoading || isSongListLoading)} />
    </>
  );
};
