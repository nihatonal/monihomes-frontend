import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: require("./locales/en.json")
      },
      tr: {
        translation: require("./locales/tr.json")
      },
      ru: {
        translation: require("./locales/ru.json")
      }
    },
    lng: "tr", // Varsayılan dil
    fallbackLng: "tr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
