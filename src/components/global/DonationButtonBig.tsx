import React from "react";
import styled from "styled-components";

interface Props {}

export const DonationButtonBig = (props: Props) => {
  return (
    <GetStarted>
      <a
        href="https://www.buymeacoffee.com/crazyguitarist"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/images/bmc-brown.png"
          alt="Buy Me A Coffee"
          height="60px"
          width="247px"
        />
      </a>
    </GetStarted>
  );
};

const GetStarted = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
