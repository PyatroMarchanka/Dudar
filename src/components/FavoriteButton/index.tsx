import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { store } from '../../context';
import { useFavoriteSongs } from '../../hooks/useFavoriteSongs';
import { mainColors, theme } from '../../utils/theme';
import { Icon } from '../global/Icon';

// Heart toggle for the open song; hidden for logged-out users
export const FavoriteButton = () => {
  const { t } = useTranslation('translation');
  const {
    state: { activeSong },
  } = useContext(store);
  const { isLoggedIn, isFavorite, toggleFavorite } = useFavoriteSongs();

  if (!isLoggedIn || !activeSong) return null;

  const favorite = isFavorite(activeSong.id);
  const label = t(favorite ? 'songList.removeFromFavorites' : 'songList.addToFavorites');

  return (
    <IconButton
      onClick={() => toggleFavorite(activeSong.id)}
      className="icon"
      aria-label={label}
      aria-pressed={favorite}
      title={label}
    >
      <Icon
        type="material"
        Icon={favorite ? Favorite : FavoriteBorder}
        fill={favorite ? mainColors.orange : theme.colors.black}
      />
    </IconButton>
  );
};
