import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationBE from "./locales/be/translation.json";
import { Languages } from "./interfaces";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  be: {
    translation: translationBE,
  },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: Languages.English,
    fallbackLng: Languages.English,
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
