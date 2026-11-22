import React, { useContext, useState } from 'react';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Check, ExpandMore } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { store } from '../../context';
import { getVersionOptions, hasVersions, VersionOption, versionParam } from '../../dataset/songs/versions';
import { mainColors } from '../../utils/theme';
import { mediaQueries } from '../../constants/style';

// The name a version is shown with: its label, or "Basic" for the default version without one
export const useVersionName = () => {
  const { t } = useTranslation('translation');
  return (option: Pick<VersionOption, 'id' | 'label'>) => option.label || String(t('versions.basic'));
};

// Under the song title: the version being played, which opens the list of the
// song's other versions (the default one first). Hidden for songs with one version.
export const SongVersions = () => {
  const { t } = useTranslation('translation');
  const versionName = useVersionName();
  const history = useHistory();
  const location = useLocation();
  const {
    state: { activeSong },
  } = useContext(store);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if (!activeSong || !hasVersions(activeSong)) return null;

  const options = getVersionOptions(activeSong);
  const activeId = activeSong.activeVersionId ?? '';
  const active = options.find((option) => option.id === activeId) ?? options[0];

  const choose = (id: string) => {
    setAnchor(null);
    if (id === activeId) return;
    const search = new URLSearchParams(location.search);
    if (id) search.set(versionParam, id);
    else search.delete(versionParam);
    const query = search.toString();
    history.replace({ pathname: location.pathname, search: query ? `?${query}` : '' });
  };

  const details = (option: VersionOption) =>
    [option.author, option.level && t(`versions.levels.${option.level}`)].filter(Boolean).join(' · ');

  return (
    <>
      <Toggle
        type="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="true"
        aria-expanded={Boolean(anchor)}
        title={String(t('versions.choose'))}
      >
        <span className="name">{versionName(active)}</span>
        <span className="count">{t('versions.count', { count: options.length })}</span>
        <ExpandMore className={anchor ? 'arrow open' : 'arrow'} fontSize="small" />
      </Toggle>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ style: { borderRadius: 8, minWidth: 240, maxWidth: 340 } }}
      >
        <MenuHeader>{t('versions.title')}</MenuHeader>
        {options.map((option) => (
          <MenuItem key={option.id || 'default'} selected={option.id === activeId} onClick={() => choose(option.id)}>
            <ListItemIcon style={{ minWidth: 32 }}>
              {option.id === activeId ? <Check style={{ color: mainColors.orange }} fontSize="small" /> : <span />}
            </ListItemIcon>
            <ListItemText primary={versionName(option)} secondary={details(option) || undefined} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  margin-top: 2px;
  padding: 2px 6px 2px 10px;
  border: 1px solid rgba(43, 35, 33, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #2b2321;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Arial,
    sans-serif;
  font-size: 13px;
  line-height: 1.4;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: ${mainColors.orange};
  }

  .name {
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .count {
    color: #6b605c;
    white-space: nowrap;
  }

  .arrow {
    transition: transform 0.15s ease;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  @media (max-width: ${mediaQueries.mobile}) {
    font-size: 12px;
  }
`;

const MenuHeader = styled.li`
  padding: 6px 16px 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b605c;
  list-style: none;
`;
