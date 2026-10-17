import React, { useContext, useEffect, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Check, Link as LinkIcon, Share, Telegram, WhatsApp, Facebook } from '@material-ui/icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { store } from '../../context';
import { routes } from '../../router/routes';
import { useSongTitle } from '../../hooks/useSongTitle';
import { mainColors, theme } from '../../utils/theme';
import { Icon } from '../global/Icon';

const COPIED_RESET_MS = 1500;

// Share icon for the open song: copy its link, the native share sheet or a messenger
export const ShareButton = () => {
  const { t } = useTranslation('translation');
  const {
    state: { activeSong },
  } = useContext(store);
  const songTitle = useSongTitle();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
      setAnchor(null);
    }, COPIED_RESET_MS);
    return () => clearTimeout(timeout);
  }, [copied]);

  if (!activeSong) return null;

  const url = `${window.location.origin}${routes.app}/${routes.play}/${activeSong.id}`;
  const title = songTitle ?? activeSong.name;
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const label = t('share.share');

  const close = () => setAnchor(null);

  const handleNativeShare = async () => {
    close();
    try {
      await navigator.share({ title, url });
    } catch (e) {
      // The user closed the share sheet
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const externalLinks = [
    { name: 'Telegram', Icon: Telegram, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'WhatsApp', Icon: WhatsApp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  return (
    <>
      <IconButton
        onClick={(e) => setAnchor(e.currentTarget)}
        className="icon"
        aria-label={label}
        aria-haspopup="true"
        title={label}
      >
        <Icon type="material" Icon={Share} fill={theme.colors.black} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ style: { borderRadius: 8, minWidth: 220 } }}
      >
        <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
          <MenuItem>
            <ListItemIcon>
              {copied ? <Check style={{ color: mainColors.orange }} /> : <LinkIcon />}
            </ListItemIcon>
            <ListItemText primary={t(copied ? 'share.linkCopied' : 'share.copyLink')} />
          </MenuItem>
        </CopyToClipboard>
        {canNativeShare && (
          <MenuItem onClick={handleNativeShare}>
            <ListItemIcon>
              <Share />
            </ListItemIcon>
            <ListItemText primary={t('share.shareVia')} />
          </MenuItem>
        )}
        {externalLinks.map(({ name, Icon: LinkIconComponent, href }) => (
          <MenuItem key={name} component="a" href={href} target="_blank" rel="noopener noreferrer" onClick={close}>
            <ListItemIcon>
              <LinkIconComponent />
            </ListItemIcon>
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
