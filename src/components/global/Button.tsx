import React from "react";
import styled, { css } from "styled-components";
import { useLongPress } from "../../hooks/useLongPress";
import { Color, mainColors, theme } from "../../utils/theme";

interface Props {
  color?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLongPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: any;
  type?: "primary" | "big";
  id?: string;
  className?: string;
  disabled?: boolean;
  ref?: any;
  backgroundColor?: string;
}

export function Button({
  color = mainColors.orange,
  onClick = () => {},
  onLongPress = () => {},
  children,
  type = "primary",
  id,
  className,
  disabled = false,
  ref = null,
}: Props) {
  const Component = getButtonByType(type);

  const longPressEvent = useLongPress(onLongPress, 500);

  return (
    <Component
      ref={ref}
      disabled={disabled}
      className={className}
      id={id}
      {...longPressEvent}
      onClick={onClick}
      color={color}
    >
      {children}
    </Component>
  );
}

interface StyledProps {
  color: string;
}
export const PrimaryButtonStyles = css`
  padding: 10px;
  margin: 10px;
  background-color: ${({ color }: StyledProps) => color};
  border: 0;
  border-radius: 8px;

  /* border-radius: 7px; */
  min-width: 100px;
  color: ${theme.colors.grey[50]};
  font-family: ${theme.fonts.primary};
  font-size: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;

  @media ${theme.breakpoints.belowTablet} {
    font-size: 13px;
    min-width: 60px;
    margin: 5px;
    padding: 10px 5px;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &:active {
    border: 0;
  }

  &:disabled {
    /* background-color: ${({ color }: StyledProps) => color[200]}; */
    opacity: 0.2;
    &:hover {
      cursor: unset;
    }
  }
`;

const PrimaryButton = styled.button`
  ${PrimaryButtonStyles}
`;

const BigButton = styled(PrimaryButton)`
  padding: 20px;
  margin: 0;
  font-size: 25px;
  font-weight: 500;
`;

function getButtonByType(type: Props["type"]) {
  switch (type) {
    case "primary":
      return PrimaryButton;

    case "big":
      return BigButton;

    default:
      return PrimaryButton;
  }
}
