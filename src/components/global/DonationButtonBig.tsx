import React from "react";
import styled from "styled-components";

interface Props {}

export const DonationButtonBig = (props: Props) => {
  return (
    <GetStarted>
      <a href="https://www.buymeacoffee.com/crazyguitarist">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Beer"
          style={{ height: '50px', width: "217px !important" }}
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
