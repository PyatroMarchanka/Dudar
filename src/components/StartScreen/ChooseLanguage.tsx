import { useTranslation } from "react-i18next";
import LanguageSelector from "../Controls/LanguageSelector";
import { Step } from "./Step";

export const ChooseLanguage = () => {
  const { t } = useTranslation("translation");

  return (
    <Step title={t("onboarding.selectLanguage")}>
      <LanguageSelector />
    </Step>
  );
};
