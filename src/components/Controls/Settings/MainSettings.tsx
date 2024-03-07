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
import LanguageSelector from "../LanguageSelector";
import LanguageIcon from "@material-ui/icons/Language";
import AvTimerIcon from "@material-ui/icons/AvTimer";
import ImportExport from "@material-ui/icons/ImportExport";
import { FeedbackForm } from "../../FeedbackForm";
import { InstrumentTypes } from "./InstrumentTypes";
import { Contacts } from "../../Contacts";

type Props = {
  midiPlayer?: MidiPlayer | null;
};

export const MainSettings = ({ midiPlayer }: Props) => {
  const { t } = useTranslation("translation");

  const {
    state: { isPreclick },
    setIsPreclick,
  } = useContext(store);

  return (
    <Container>
      <Row>
        <Icon type="duda" className="duda" />
        <Title>{t("instrumentType")}</Title>
      </Row>
      <Line />
      <InstrumentTypes />
      <Line />
      {midiPlayer && (
        <Row>
          <Icon
            type="material"
            fill={mainColors.darkerGray}
            Icon={ImportExport}
          />
          <Title>{t("transposeMelody")}</Title>
          <Transpose midiPlayer={midiPlayer} />
        </Row>
      )}

      <Line />
      <Row>
        <Icon type="material" fill={mainColors.darkerGray} Icon={AvTimerIcon} />
        <Title>{t("preclick")}</Title>
        <RedCheckbox
          checked={isPreclick}
          onChange={() => setIsPreclick(!isPreclick)}
          name="checkedG"
        />
      </Row>
      <Line />
      <Row>
        <Icon
          type="material"
          fill={mainColors.darkerGray}
          Icon={LanguageIcon}
        />
        <Title>{t("languages.lang")}</Title>
        <LanguageSelector />
      </Row>
      <Line />
      <Contacts />
    </Container>
  );
};

const Container = styled.div``;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  flex-wrap: wrap;
`;

const RowCentered = styled(Row)`
  justify-content: space-between;
  flex-wrap: nowrap;
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
