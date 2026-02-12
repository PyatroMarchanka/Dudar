import { Link, useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../router/routes";
import { mainColors } from "../../utils/theme";
import { mediaQueries } from "../../constants/style";
import { Logo } from "./Logo";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { getFirstSongFromList } from "../../dataset/songs/utils";
import { useSongListShort } from "../../hooks/useSongLIst";
import { useContext, useState } from "react";
import { store } from "../../context";
import { IconButton, Typography } from "@material-ui/core";
import { Icon } from "../global/Icon";
import LanguageIcon from "@material-ui/icons/Language";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import { ModalButton } from "../global/ModalButton";
import LanguageSelector from "../Controls/LanguageSelector";
import { useTranslation } from "react-i18next";
import { links } from "../../api/links";
import { Button } from "../global/Button";
import { MobileMenu } from "./MobileMenu";

export const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation("translation");
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const {
    state: { activeSong, listsByBagpipe, userLastSongUrl, userData },
  } = useContext(store);
  useSongListShort();
  const songId =
    userLastSongUrl ||
    activeSong?.id ||
    (listsByBagpipe && getFirstSongFromList(listsByBagpipe).id) ||
    "";

  useGoogleProfile();

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <NavContainer>
      <NavContent>
        <LogoLink to={routes.main}>
          <Logo variant="big" width={150} height={55} />
        </LogoLink>
        <DesktopNavList>
          <NavItem>
            <StyledLink
              to={`${routes.app}/${routes.play}/${songId}`}
              className={location.pathname === routes.app ? "active" : ""}
            >
              {t("navbar.learn")}
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink
              to={routes.playlists}
              className={location.pathname === routes.playlists ? "active" : ""}
            >
              {t("navbar.playlists")}
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink
              to={routes.learningBook}
              className={location.pathname === routes.learningBook ? "active" : ""}
            >
              {t("navbar.blog")}
            </StyledLink>
          </NavItem>
          <NavItem>
            <StyledLink
              to={routes.contacts}
              className={location.pathname === routes.contacts ? "active" : ""}
            >
              {t("navbar.contacts")}
            </StyledLink>
          </NavItem>
          {userData?.isAdmin && (
            <NavItem>
              <StyledLink
                to={routes.admin}
                className={location.pathname === routes.admin ? "active" : ""}
              >
                {t("navbar.admin")}
              </StyledLink>
            </NavItem>
          )}
        </DesktopNavList>
        <NavControls>
          <ModalButton
            icon={<Icon type="material" fill={"black"} Icon={LanguageIcon} />}
            dialogContent={
              <div>
                <ModalTitle>
                  <Typography>{t("languages.lang")}</Typography>
                </ModalTitle>
                <LanguageSelector />
              </div>
            }
          />
          {userData?.picture ? (
            <ModalButton
              icon={<UserImage src={userData?.picture} />}
              dialogContent={
                <div>
                  <ModalTitle>
                    <a href={links.logout}>
                      <Button className="getStarted" type="big">
                        {t("login.logout")}
                      </Button>
                    </a>
                  </ModalTitle>
                </div>
              }
            />
          ) : (
            <IconButton
              className="iconButton"
              onClick={() => history.push(routes.login)}
            >
              <Icon type="material" fill={"black"} Icon={AccountCircleIcon} />
            </IconButton>
          )}
          <IconButton
            className="mobileMenuButton"
            aria-label="show menu"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </NavControls>
      </NavContent>
      <MobileMenu
        mobileMenuAnchor={mobileMenuAnchor}
        onClose={handleMobileMenuClose}
        songId={songId}
        isAdmin={userData?.isAdmin}
      />
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .mobileMenuButton {
    display: none;
    @media (max-width: ${mediaQueries.tabletMiddle}) {
      display: block;
    }
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (max-width: ${mediaQueries.mobile}) {
    height: auto;
    padding: 0.5rem 1rem;
    flex-wrap: wrap;
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .iconButton {
    padding: 0;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    margin-left: auto;
  }
`;

const UserImage = styled.img`
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${mainColors.orange};
  width: 30px;
  height: 30px;
  &:hover {
    cursor: pointer;
    border: 2px solid ${mainColors.darkOrange};
  }
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

export const LogoLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;

  @media (max-width: ${mediaQueries.mobile}) {
    margin-right: auto;
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;

  @media (max-width: ${mediaQueries.mobile}) {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
    width: 100%;
  }
`;

const NavItem = styled.li`
  margin: 0;
  position: relative;
  font-family: "Roboto", sans-serif;

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(
      135deg,
      ${mainColors.orange} 0%,
      ${mainColors.darkOrange} 100%
    );
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const StyledLink = styled(Link)`
  color: ${mainColors.darkerGray};
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: ${mainColors.orange};
    background-color: rgba(255, 165, 0, 0.05);
  }

  &.active {
    color: ${mainColors.orange};
    font-weight: 600;

    &:after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        135deg,
        ${mainColors.orange} 0%,
        ${mainColors.darkOrange} 100%
      );
    }
  }

  @media (max-width: ${mediaQueries.mobile}) {
    display: block;
    text-align: center;
    width: 100%;
    padding: 0.75rem;
  }
`;

const DesktopNavList = styled(NavList)`
  @media (max-width: ${mediaQueries.tabletMiddle}) {
    display: none;
  }
`;
