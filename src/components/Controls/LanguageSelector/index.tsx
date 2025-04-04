import { MenuItem, Select } from "@material-ui/core";
import React, { useContext } from "react";
import { store } from "../../../context";
import { useSelectStyles } from "../../global/selectStyles";
import { useChangeLanguage } from "../../../locales";
import { Languages } from "../../../interfaces";
import { useTranslation } from "react-i18next";
import { useUpdateUserSettings } from "../../../hooks/useGoogleProfile";
import { userLanguage } from "../../../constants/localStorage";

interface Props {}

const LanguageSelector = ({}: Props) => {
  const {
    state: { language },
    setLanguage,
  } = useContext(store);
  const { t } = useTranslation();
  const { updateUserSettings } = useUpdateUserSettings();

  const changeLanguage = useChangeLanguage();
  const options = Object.values(Languages).map((lang) => ({
    label: t(`languages.${lang}`),
    value: lang,
  }));
  const selectClasses = useSelectStyles();

  return (
    <Select
      id="lang-select"
      className={selectClasses.select}
      value={language}
      onChange={(e) => {
        changeLanguage(e.target.value as Languages);
        setLanguage(e.target.value as Languages);
        localStorage.setItem(userLanguage, e.target.value as string);
        updateUserSettings({ language: e.target.value as Languages });
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSelector;
