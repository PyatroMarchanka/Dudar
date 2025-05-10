import React from "react";
import styled from "styled-components";
import { routes } from "../../router/routes";
import { mediaQueries } from "../../constants/style";

type LogoProps = {
  width?: number;
  height?: number;
  white?: boolean;
};

type Props = LogoProps & {
  variant: "small" | "big";
};

export const Logo = ({
  width = 200,
  height = 100,
  variant,
  white = false,
}: Props) => {
  return (
    <a href={routes.main}>
      {variant === "big" ? (
        <LogoImg
          width={width}
          height={height}
          src={white ? "/images/logo_white.svg" : "/images/logo.svg"}
        />
      ) : (
        <LogoImg
          width={width}
          height={height}
          src={
            white ? "/images/logo_small_white.svg" : "/images/logo_small.svg"
          }
        />
      )}
    </a>
  );
};

const LogoImg = styled.img<{ width: number; height: number }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};

  @media (max-width: ${mediaQueries.mobile}) {
    width: ${({ width }) => `${width * 0.75}px`};
    height: ${({ height }) => `${height * 0.75}px`};
  }
`;
