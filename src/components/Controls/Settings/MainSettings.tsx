import React from "react";
import styled from "styled-components";
import { mainColors } from "../../../utils/theme";
import { Icon } from "../../global/Icon";

type Props = {};

export const MainSettings = ({}: Props) => {
  return (
    <Container>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Instrument Type</Title>
      </BottomLineRow>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Drone</Title>
      </BottomLineRow>
    </Container>
  );
};

const Container = styled.div``;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const BottomLineRow = styled(Row)`
  border-bottom: 2px solid ${mainColors.lightGrey};
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;
