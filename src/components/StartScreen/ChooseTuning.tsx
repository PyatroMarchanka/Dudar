import { useTranslation } from "react-i18next";
import Transpose from "../Controls/Transpose";
import { Step } from "./Step";

export const ChooseTuning = () => {
  const { t } = useTranslation("translation");

  return (
    <Step title={t("onboarding.selectTuning")}>
      <Transpose midiPlayer={null} />
    </Step>
  );
};
