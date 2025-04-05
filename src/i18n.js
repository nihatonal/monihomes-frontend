import i18n from "i18next";
import moment from "moment";
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
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Moment dil ayarlarını i18next'e göre güncelle
i18n.on('languageChanged', (lng) => {
  moment.locale(lng); // Dil değiştiğinde moment'in locale'ini güncelle
});

export default i18n;
