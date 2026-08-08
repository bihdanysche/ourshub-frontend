import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enPayload from "./locales/en.json";
import ukPayload from "./locales/uk.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: enPayload },
			uk: { translation: ukPayload },
		},
		fallbackLng: "uk",
		supportedLngs: ["en", "uk"],

		detection: {
			order: ["cookie", "localStorage", "navigator"],
			lookupCookie: "NEXT_LOCALE",
			lookupLocalStorage: "i18nextLng",
			caches: ["cookie", "localStorage"],
		},
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
