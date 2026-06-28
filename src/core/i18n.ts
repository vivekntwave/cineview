import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, namespaces } from "../locales";

function readInitialLanguage(): string {
  try {
    const saved = localStorage.getItem("user-preferences");
    if (saved) return JSON.parse(saved).language ?? "en";
  } catch {
    // ignore
  }
  const browser = navigator.language?.split("-")[0] ?? "en";
  return browser === "es" ? "es" : "en";
}

void i18n.use(initReactI18next).init({
  resources,
  lng: readInitialLanguage(),
  fallbackLng: "en",
  ns: namespaces,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;