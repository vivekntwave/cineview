import { reaction } from "mobx";
import i18n from "./i18n";
import { preferencesStore } from "../Preferences/core/PreferenceStore";

export function syncPreferences() {
  preferencesStore.applyThemeToDOM();
  void i18n.changeLanguage(preferencesStore.language);

  reaction(
    () => preferencesStore.language,
    (language) => {
      void i18n.changeLanguage(language);
    },
  );
}