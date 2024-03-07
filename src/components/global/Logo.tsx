import React from "react";
import styled from "styled-components";
import { routes } from "../../router/routes";

type LogoProps = {
  width?: number;
  height?: number;
};

type Props = LogoProps & {
  variant: "small" | "big";
};

export const Logo = ({ width = 200, height = 100, variant }: Props) => {
  return (
    <a href={routes.main}>
      {variant === "big" ? (
        <LogoImg width={width} height={height} src="/images/logo.svg" />
      ) : (
        <LogoImg width={width} height={height} src="/images/logo_small.svg" />
      )}
    </a>
  );
};

const LogoImg = styled.img<LogoProps>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;
