import { useTranslation } from "react-i18next";
import { InstrumentTypes } from "../Controls/Settings/InstrumentTypes";
import { Step } from "./Step";

export const ChooseBagpipe = () => {
  const { t } = useTranslation("translation");

  return (
    <Step title={t("onboarding.selectInstrument")}>
      <InstrumentTypes />
    </Step>
  );
};
