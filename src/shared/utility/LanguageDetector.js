// src/utils/LanguageDetector.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../../config/routes";

const LanguageDetector = () => {
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        const currentLang = location.pathname.split("/")[1]; // "tr", "en", "ru"
        if (supportedLanguages.includes(currentLang)) {
            i18n.changeLanguage(currentLang);
        }
    }, [location, i18n]);

    return null;
};

export default LanguageDetector;
