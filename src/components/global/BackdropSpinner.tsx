import { mainColors } from "../../utils/theme";
import { RotateSpinner } from "react-spinners-kit";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
}

export const BackdropSpinner = ({ isOpen }: Props) => {
  if (!isOpen) return null;
  
  return (
    <StyledBackdrop>
      <RotateSpinner color={mainColors.darkestRed} size={150} />
    </StyledBackdrop>
  );
};

const StyledBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;
