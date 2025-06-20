// src/config/routes.js


// import Home from "@/pages/Home";
import PrivacyPolicy from "../shared/components/PrivacyPolicy";
import RoomInstructions from "../shared/components/RoomInstructions";

export const supportedLanguages = ["tr", "en", "ru"];

export const languageRoutes = [
    {
        key: "roomInstructions",
        paths: {
            tr: "/tr/oda-talimatlari",
            en: "/en/room-instructions",
            ru: "/ru/instrukcii",
        },
        element: <RoomInstructions />,
    },
    {
        key: "privacyPolicy",
        paths: {
            tr: "/tr/gizlilik-politikasi",
            en: "/en/privacy-policy",
            ru: "/ru/politika-konfidencialnosti",
        },
        element: <PrivacyPolicy />,
    },
];
