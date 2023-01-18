import React, { useContext } from "react";
import styled from "styled-components";
import { store } from "../../../context";
import { bagpipes } from "../../../dataset/bagpipes";
import { BagpipeTypes } from "../../../interfaces";
import { mainColors } from "../../../utils/theme";
import { Icon } from "../../global/Icon";

type Props = {};

export const MainSettings = ({}: Props) => {
  const {
    state: { bagpipeType },
    setBagpipeType,
  } = useContext(store);

  const bagpipeTypes = [
    BagpipeTypes.BelarusianNONTraditionalDuda,
    BagpipeTypes.BelarusianOpenDuda,
    BagpipeTypes.BelarusianTraditionalDuda,
  ];

  const onChange = (bagpipeType: BagpipeTypes) => {
    setBagpipeType(bagpipeType);
  };

  return (
    <Container>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Instrument Type</Title>
      </BottomLineRow>
      <InstrumentTypes>
        {bagpipeTypes.map((type, i) => (
          <TypeItem>
            <TypeContainer>
              <RadioButton
                onChange={() => onChange(type)}
                checked={type === bagpipeType}
                type="radio"
                name={`radio-${i}`}
              ></RadioButton>
              <BigTitle>{bagpipes[type].name}</BigTitle>
            </TypeContainer>
            {/* <SmallTitle>G maj / E min</SmallTitle> */}
          </TypeItem>
        ))}
      </InstrumentTypes>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Drones</Title>
      </BottomLineRow>
    </Container>
  );
};

const Container = styled.div``;

const RadioButton = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background-color: ${mainColors.lightestGrey};
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid ${mainColors.lightGrey};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  &::before {
    content: "";
    width: 14px;
    height: 14px;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${mainColors.darkOrange};
  }
  &:checked::before {
    transform: scale(1);
  }
`;

const InstrumentTypes = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
  align-items: center;
`;

const TypeItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  padding: 0 3%;
`;

const Dot = styled.div`
  border: 2px ${mainColors.lightGrey} solid;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: red;
`;

const BigTitle = styled.h3`
  color: ${mainColors.midGrey};
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.003em;
`;

const SmallTitle = styled.h3`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 152%;
  letter-spacing: 0.018em;

  color: #463131;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

const BottomLineRow = styled(Row)`
  border-bottom: 2px solid ${mainColors.lightGrey};
  margin: 0 6%;
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;
