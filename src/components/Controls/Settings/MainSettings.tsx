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
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

type Props = {
  midiPlayer: MidiPlayer | null;
};

export const MainSettings = ({ midiPlayer }: Props) => {
  const { t } = useTranslation("translation");

  const {
    state: { bagpipeType, isPreclick },
    setBagpipeType,
    setIsPreclick,
  } = useContext(store);

  const bagpipeTypes = Object.values(BagpipeTypes);

  const onChange = (bagpipeType: BagpipeTypes) => {
    setBagpipeType(bagpipeType);
  };

  return (
    <Container>
      <Row>
        <Icon type="duda" className="duda" />
        <Title>{t("instrumentType")}</Title>
      </Row>
      <Line />
      <InstrumentTypes>
        {bagpipeTypes.map((type, i) => (
          <TypeItem key={type} onClick={() => onChange(type as BagpipeTypes)}>
            <RedRadio
              checked={type === bagpipeType}
              name="radio-button-demo"
              inputProps={{ "aria-label": "C" }}
            />
            <BigTitle>{t(`dudas.${bagpipes[type].name}`)}</BigTitle>
          </TypeItem>
        ))}
      </InstrumentTypes>
      <Line />
      <Row>
        <Icon type="duda" className="duda" />
        <Title>{t("transposeMelody")}</Title>
        <Transpose midiPlayer={midiPlayer} />
      </Row>
      <Line />
      <Row>
        <Icon type="duda" className="duda" />
        <Title>{t("preclick")}</Title>
        <RedCheckbox
          checked={isPreclick}
          onChange={() => setIsPreclick(!isPreclick)}
          name="checkedG"
        />
      </Row>
      <Line />
      <a
        href="https://github.com/PyatroMarchanka/Dudar"
        className="github-link"
      >
        <i className="fa fa-github fa_custom"></i>
        <Typography variant="h5">GitHub</Typography>
      </a>
    </Container>
  );
};

const Container = styled.div`
  .github-link {
    padding: 20px;
    display: flex;
    justify-content: center;
    color: ${mainColors.darkerGray};
    text-decoration: none;

    .fa_custom {
      font-size: 30px;
      margin-right: 5px;
    }
  }
`;

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

const Line = styled.div`
  border-bottom: 2px solid ${mainColors.lightGrey};
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;
