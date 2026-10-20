import styled from "styled-components";
import { mainColors } from "../../../utils/theme";

// The settings drawer uses two colors: ink for text and icons, accent for
// everything you can press or switch on. The tuner keeps its own button style.
export const settingsColors = {
  ink: mainColors.darkerGray,
  accent: mainColors.darkRed,
};

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 12px;
  min-height: 52px;
  padding: 4px 20px;
  color: ${settingsColors.ink};
  text-decoration: none;
`;

// Icon and title; the control moves under it when both don't fit on one line
export const Label = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 55%;
  min-width: 0;
`;

// Right-aligned control; drops under the title when the row is too narrow
export const Control = styled.div`
  margin-left: auto;
  max-width: 100%;
  color: ${settingsColors.ink};

  .MuiInputBase-root {
    padding: 0;
    color: ${settingsColors.ink};
    font-weight: 600;
  }
  .MuiSelect-icon {
    color: ${settingsColors.ink};
  }
`;

export const RowTitle = styled.h3`
  flex: 1 1 auto;
  min-width: 0;
  margin: 8px 0 8px 16px;
  color: ${settingsColors.ink};
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 600;
  overflow-wrap: break-word;
`;

export const Section = styled.section`
  margin-top: 8px;
  padding: 4px 0 8px;
  border-top: 1px solid ${mainColors.lightGrey};
`;

export const SectionTitle = styled.h4`
  margin: 12px 20px 4px;
  color: ${settingsColors.accent};
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Hint = styled.div`
  padding: 0 20px 8px 60px;
  color: ${settingsColors.ink};
  opacity: 0.8;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 1.35;
`;
