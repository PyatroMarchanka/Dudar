import { Link, useLocation } from "react-router-dom";
import { Menu, MenuItem } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { routes } from "../../router/routes";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  mobileMenuAnchor: HTMLElement | null;
  onClose: () => void;
  songId: string;
  isAdmin?: boolean;
}

export const MobileMenu = ({
  mobileMenuAnchor,
  onClose,
  songId,
  isAdmin,
}: MobileMenuProps) => {
  const location = useLocation();
  const { t } = useTranslation("translation");

  return (
    <Menu
      anchorEl={mobileMenuAnchor}
      keepMounted
      open={Boolean(mobileMenuAnchor)}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "100%",
          marginTop: "8px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
      MenuListProps={{
        style: {
          padding: "8px 0",
        },
      }}
    >
      <MenuItem
        component={Link}
        to={`${routes.app}/${routes.play}/${songId}`}
        onClick={onClose}
        selected={location.pathname === routes.app}
        style={{
          padding: "12px 24px",
          color:
            location.pathname === routes.app ? mainColors.orange : "inherit",
        }}
      >
        {t("navbar.learn")}
      </MenuItem>
      <MenuItem
        component={Link}
        to={routes.playlists}
        onClick={onClose}
        selected={location.pathname === routes.playlists}
        style={{
          padding: "12px 24px",
          color:
            location.pathname === routes.playlists
              ? mainColors.orange
              : "inherit",
        }}
      >
        {t("navbar.playlists")}
      </MenuItem>
      <MenuItem
        component={Link}
        to={routes.blog}
        onClick={onClose}
        selected={location.pathname === routes.blog}
        style={{
          padding: "12px 24px",
          color:
            location.pathname === routes.blog ? mainColors.orange : "inherit",
        }}
      >
        {t("navbar.blog")}
      </MenuItem>
      <MenuItem
        component={Link}
        to={routes.contacts}
        onClick={onClose}
        selected={location.pathname === routes.contacts}
        style={{
          padding: "12px 24px",
          color:
            location.pathname === routes.contacts
              ? mainColors.orange
              : "inherit",
        }}
      >
        {t("navbar.contacts")}
      </MenuItem>
      {isAdmin && (
        <MenuItem
          component={Link}
          to={routes.admin}
          onClick={onClose}
          selected={location.pathname === routes.admin}
          style={{
          padding: "12px 24px",
          color:
            location.pathname === routes.admin ? mainColors.orange : "inherit",
        }}
        >
          {t("navbar.admin")}
        </MenuItem>
      )}
    </Menu>
  );
};
