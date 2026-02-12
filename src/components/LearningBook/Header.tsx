import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IconButton, Drawer, List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { mediaQueries } from "../../constants/style";
import { mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { Close } from "@material-ui/icons";

import { Modal } from "./Modal";
import { ArticlePreviewList } from "./ArticlePreviewList";
import { LogoLink } from "../global/Navbar";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";
import { TranslatedCategoryTree } from "../../interfaces/category";
import { store } from "../../context";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";

interface MenuPosition {
    left: number;
    top: number;
}

interface HeaderProps {
    categoriesTree: TranslatedCategoryTree;
}

export const LearningBookHeader: React.FC<HeaderProps> = ({ categoriesTree }: HeaderProps) => {
    const { state: { userData } } = useContext(store);
    const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<{ [key: string]: boolean }>({});
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
    
    useGoogleProfile();

    const clearCloseTimeout = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleMenuItemEnter = (categoryId: string) => {
        // Clear any pending close timeout
        clearCloseTimeout();

        // Get button position and show modal
        const button = buttonRefs.current[categoryId];
        if (button) {
            const rect = button.getBoundingClientRect();
            setHoveredCategoryId(categoryId);
            setMenuPosition({
                left: rect.left,
                top: rect.bottom,
            });
        }
    };

    const handleMenuItemLeave = () => {
        // Start a 200ms timeout before closing
        closeTimeoutRef.current = setTimeout(() => {
            setHoveredCategoryId(null);
            setMenuPosition(null);
            closeTimeoutRef.current = null;
        }, 200);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleMobileCategoryToggle = (categoryId: string) => {
        setMobileExpanded((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            clearCloseTimeout();
        };
    }, []);

    return (
        <>
            <MenuContainer>
                {/* Desktop Horizontal Menu */}
                <DesktopMenu>
                    <LogoLink to={routes.main}>
                        <Logo variant="big" width={150} height={55} />
                    </LogoLink>
                    {categoriesTree.map((category) => (
                        <MenuCategoryItemWrapper
                            key={category.category}
                            onMouseEnter={() => handleMenuItemEnter(category.category)}
                            onMouseLeave={handleMenuItemLeave}
                        >
                            <CategoryButton
                                ref={(el) => (buttonRefs.current[category.category] = el)}
                            >
                                {category.category}
                                <ExpandMoreIcon style={{ marginLeft: "4px", fontSize: "18px" }} />
                            </CategoryButton>

                            {/* Modal for Article Previews */}
                            {hoveredCategoryId === category.category && menuPosition && (
                                <Modal
                                    isOpen={true}
                                    position={menuPosition}
                                >
                                    <ArticlePreviewList
                                        articles={category.articles}
                                        categoryTitle={category.category}
                                    />
                                </Modal>
                            )}
                        </MenuCategoryItemWrapper>
                    ))}
                    <AdminLinkWrapper>
                        {userData?.isAdmin && <StyledLink to={routes.articleAdminList}><CategoryButton>Для Адмінаў</CategoryButton></StyledLink>}
                    </AdminLinkWrapper>
                </DesktopMenu>

                {/* Mobile Hamburger Menu */}
                <MobileMenuButton>
                    <LogoLink to={routes.main}>
                        <Logo variant="big" width={150} height={55} />
                    </LogoLink>
                    <IconButton
                        onClick={handleMobileMenuToggle}
                        aria-label="menu"
                        style={{ color: mainColors.orange }}
                    >
                        <MenuIcon />
                    </IconButton>
                </MobileMenuButton>

                <MobileDrawer
                    anchor="right"
                    open={mobileMenuOpen}
                    onClose={handleMobileMenuToggle}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleMobileMenuToggle}>
                            <Icon type="material" fill={mainColors.darkerGray} Icon={Close} />
                        </IconButton>
                    </DrawerHeader>
                    <DrawerContent>
                        {categoriesTree.map((category) => (
                            <MobileCategoryItem key={category.category}>
                                <MobileCategoryHeader
                                    button
                                    onClick={() => handleMobileCategoryToggle(category.category)}
                                >
                                    <ListItemText primary={category.category} />
                                    {mobileExpanded[category.category] ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </MobileCategoryHeader>
                                <Collapse
                                    in={mobileExpanded[category.category]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {category.articles.map((article) => (
                                            <ListItem
                                                key={article._id}
                                                button
                                                onClick={handleMobileMenuToggle}
                                                style={{
                                                    paddingLeft: "2rem",
                                                    paddingTop: "0.75rem",
                                                    paddingBottom: "0.75rem",
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "rgba(223, 120, 97, 0.1)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "transparent";
                                                }}
                                            >
                                                <StyledLink to={article.slug}>
                                                    <ListItemText
                                                        primary={article.title}
                                                        primaryTypographyProps={{
                                                            style: {
                                                                fontSize: "14px",
                                                                color: mainColors.darkerGray,
                                                                fontFamily: '"Roboto", sans-serif',
                                                            },
                                                        }}
                                                    />
                                                </StyledLink>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </MobileCategoryItem>
                        ))}
                    </DrawerContent>
                </MobileDrawer>
            </MenuContainer>
        </>
    );
};

const MenuContainer = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 999;
`;

const DesktopMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* max-width: ${mediaQueries.tabletLandscape}; */
  margin: 0 auto;
  padding: 0 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: ${mediaQueries.tabletMiddle}) {
    display: none;
  }
`;

const MobileMenuButton = styled.div`
  display: none;
  padding: 0.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${mediaQueries.tabletMiddle}) {
    display: flex;
    justify-content: flex-end;
  }
`;

const MenuCategoryItemWrapper = styled.div`
    position: relative;
    display: inline-block;
    
    /* Ensure modal is properly positioned relative to this container */
    &:hover {
        /* No special hover style needed, handled by wrapper onMouseLeave/Enter */
    }
`;

const AdminLinkWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: ${mainColors.darkerGray};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: "Roboto", sans-serif;

  &:hover {
    color: ${mainColors.orange};
    background: rgba(223, 120, 97, 0.1);
    border-radius: 4px;
  }

  &:focus {
    outline: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
  display: block;
`;


const MobileDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 280px;
    max-width: 85vw;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: ${mainColors.lightestGrey};
`;

const DrawerTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600; 
  color: ${mainColors.darkerGray};
  font-family: "Roboto", sans-serif;
`;

const DrawerContent = styled.div`
  padding: 0.5rem 0;
`;

const MobileCategoryItem = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MobileCategoryHeader = styled(ListItem)`
  && {
    padding: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(223, 120, 97, 0.1);
    }

    .MuiListItemText-primary {
      font-weight: 500;
      font-size: 15px;
      color: ${mainColors.darkerGray};
      font-family: "Roboto", sans-serif;
    }
  }
`;


