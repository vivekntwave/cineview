import { preferencesStore } from "../Preferences/core/PreferenceStore";

export function formatLocaleDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return "";

  const locale = preferencesStore.language === "es" ? "es-ES" : "en-US";
  return new Intl.DateTimeFormat(locale, options).format(value);
}