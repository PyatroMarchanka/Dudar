import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { Icon } from "../../global/Icon";
import Transpose from "../Transpose";
import { RedCheckbox } from "../../global/RedCheckbox";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";
import LanguageIcon from "@material-ui/icons/Language";
import AvTimerIcon from "@material-ui/icons/AvTimer";
import ImportExport from "@material-ui/icons/ImportExport";
import VolumeOff from "@material-ui/icons/VolumeOff";
import BluetoothAudio from "@material-ui/icons/BluetoothAudio";
import { InstrumentTypes } from "./InstrumentTypes";
import { OfflineSave } from "./OfflineSave";
import { Contacts } from "../../Contacts";
import { DonationButtonBig } from "../../global/DonationButtonBig";
import { TunerButton } from "../../global/TunerButton";
import { useUpdateUserSettings } from "../../../hooks/useGoogleProfile";
import { MenuItem, Select } from "@material-ui/core";
import { MusicNote, Home } from "@material-ui/icons";
import { Views } from "../../../interfaces/user";
import { routes } from "../../../router/routes";
import { SongPageModal } from "../../global/SongPageModal";
import { isFluteInstrument } from "../../../brand";
import { useSelectStyles } from "../../global/selectStyles";
import {
  getAutoLatencyMs,
  getSyncOffsetMs,
  noDelayOffsetMs,
  setSyncOffsetMs,
  syncOffsetOptionsMs,
} from "../../../utils/audioSync";
import { Control, Label, Row, RowTitle, Section, SectionTitle, settingsColors } from "./styles";

type Props = {
  midiPlayer?: MidiPlayer | null;
  showSongInfo?: boolean;
};

export const MainSettings = ({ midiPlayer, showSongInfo = true }: Props) => {
  const { t } = useTranslation("translation");

  const {
    state: { isPreclick, isSilentMode, bagpipeType, isMusicSheets },
    setIsPreclick,
    setIsSilentMode,
    setIsMusicSheet,
  } = useContext(store);
  const { updateUserSettings } = useUpdateUserSettings();
  const selectClasses = useSelectStyles();
  const [syncOffset, setSyncOffset] = useState(getSyncOffsetMs());

  useEffect(() => {
    midiPlayer?.setIsSilentMode(!!isSilentMode);
  }, [isSilentMode]);

  useEffect(() => {
    midiPlayer?.setBagpipeType(bagpipeType);
  }, [bagpipeType]);

  return (
    <Container>
      <TunerButton />
      <HomeLink href={routes.main}>
        <Icon type="material" fill={settingsColors.accent} Icon={Home} />
        <span>{t("login.mainPage")}</span>
      </HomeLink>
      {showSongInfo && <SongPageModal />}

      <Section>
        <SectionTitle>{t("settingsSections.instrument")}</SectionTitle>
        <InstrumentTypes />
        {midiPlayer && (
          <Row>
            <Label>
              <Icon type="material" fill={settingsColors.ink} Icon={ImportExport} />
              <RowTitle>{t(isFluteInstrument(bagpipeType) ? "whistleTonality" : "transposeMelody")}</RowTitle>
            </Label>
            <Control>
              <Transpose midiPlayer={midiPlayer} />
            </Control>
          </Row>
        )}
      </Section>

      <Section>
        <SectionTitle>{t("settingsSections.playback")}</SectionTitle>
        <Row>
          <Label>
            <Icon type="material" fill={settingsColors.ink} Icon={AvTimerIcon} />
            <RowTitle>{t("preclick")}</RowTitle>
          </Label>
          <RedCheckbox
            checked={isPreclick}
            onChange={() => {
              setIsPreclick(!isPreclick);
              updateUserSettings({ isPreclick: !isPreclick });
            }}
            name="checkedG"
          />
        </Row>
        <Row>
          <Label>
            <Icon type="material" fill={settingsColors.ink} Icon={MusicNote} />
            <RowTitle>{t("musicSheetsSettings")}</RowTitle>
          </Label>
          <RedCheckbox
            checked={isMusicSheets}
            onChange={() => {
              updateUserSettings({
                view: !isMusicSheets ? Views.MusicSheets : Views.Bagpipe,
              });
              setIsMusicSheet(!isMusicSheets);
            }}
            name="checkedG"
          />
        </Row>
        <Row>
          <Label>
            <Icon type="material" fill={settingsColors.ink} Icon={VolumeOff} />
            <RowTitle>{t("silentMode")}</RowTitle>
          </Label>
          <RedCheckbox
            checked={isSilentMode}
            onChange={() => {
              setIsSilentMode(!isSilentMode);
              updateUserSettings({ isPreclick: !isSilentMode });
            }}
            name="checkedG"
          />
        </Row>
        <Row>
          <Label>
            <Icon type="material" fill={settingsColors.ink} Icon={BluetoothAudio} />
            <RowTitle>{t("soundSync")}</RowTitle>
          </Label>
          <Control>
            <Select
              className={selectClasses.select}
              value={syncOffset}
              onChange={(e) => {
                const ms = Number(e.target.value);
                setSyncOffsetMs(ms);
                setSyncOffset(ms);
              }}
            >
              {syncOffsetOptionsMs.map((ms) => (
                <MenuItem key={ms} value={ms}>
                  <b>
                    {ms === noDelayOffsetMs
                      ? t("soundSyncOff")
                      : ms === 0
                      ? `${t("soundSyncAuto")} (${getAutoLatencyMs()} ms)`
                      : `${ms > 0 ? "+" : ""}${ms} ms`}
                  </b>
                </MenuItem>
              ))}
            </Select>
          </Control>
        </Row>
      </Section>

      <Section>
        <SectionTitle>{t("settingsSections.app")}</SectionTitle>
        <OfflineSave midiPlayer={midiPlayer} />
        <Row>
          <Label>
            <Icon type="material" fill={settingsColors.ink} Icon={LanguageIcon} />
            <RowTitle>{t("languages.lang")}</RowTitle>
          </Label>
          <Control>
            <LanguageSelector />
          </Control>
        </Row>
      </Section>

      <Footer>
        <Contacts color={settingsColors.accent} />
        <DonationButtonBig />
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: 16px;
`;

// Styled as an outlined twin of the tuner button so it reads as navigation, not a setting
const HomeLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 20px 8px;
  padding: 8px 16px;
  border: 2px solid ${settingsColors.accent};
  border-radius: 28px;
  color: ${settingsColors.accent};
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background-color: rgba(169, 20, 47, 0.08);
  }
`;

const Footer = styled(Section)`
  padding-top: 8px;
`;
