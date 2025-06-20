import { useTranslation } from "react-i18next";
import { languageRoutes } from "../../config/routes";

export const useTranslatedPath = (key) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "tr";
  const route = languageRoutes.find((r) => r.key === key);
  return route?.paths[lang] || "/";
};
