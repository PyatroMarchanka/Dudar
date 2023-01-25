import React, { useContext } from "react";
import styled from "styled-components";
import { store } from "../../../context";
import { bagpipes } from "../../../dataset/bagpipes";
import { BagpipeTypes } from "../../../interfaces";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { mainColors } from "../../../utils/theme";
import { Icon } from "../../global/Icon";
import Transpose from "../Transpose";
import { RedRadio } from "../../global/RedRadioButton";
import { RedCheckbox } from "../../global/RedCheckbox";

type Props = {
  midiPlayer: MidiPlayer | null;
};

export const MainSettings = ({ midiPlayer }: Props) => {
  const {
    state: { bagpipeType, isPreclick },
    setBagpipeType,
    setIsPreclick,
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
          <TypeItem key={type} onClick={() => onChange(type)}>
            <RedRadio
              checked={type === bagpipeType}
              name="radio-button-demo"
              inputProps={{ "aria-label": "C" }}
            />
            <BigTitle>{bagpipes[type].name}</BigTitle>
          </TypeItem>
        ))}
      </InstrumentTypes>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Transpose</Title>
        <Transpose midiPlayer={midiPlayer} />
      </BottomLineRow>
      <BottomLineRow>
        <Icon type="duda" className="duda" />
        <Title>Preclick</Title>
        <RedCheckbox
          checked={isPreclick}
          onChange={() => setIsPreclick(!isPreclick)}
          name="checkedG"
        />
      </BottomLineRow>
    </Container>
  );
};

const Container = styled.div``;

const InstrumentTypes = styled.div`
  display: flex;
  flex-direction: column;
`;

const TypeItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  padding: 0 3%;
`;

const BigTitle = styled.h3`
  color: ${mainColors.midGrey};
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.003em;
  margin-left: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex-wrap: wrap;
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
