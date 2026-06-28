import { makeAutoObservable, reaction } from "mobx";

export type Theme = "light" | "dark";

const STORAGE_KEY = "user-preferences";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
] as const;

export const SUPPORTED_REGIONS = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "ES", label: "Spain" },
  { code: "MX", label: "Mexico" },
  { code: "IN", label: "India" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
] as const;

export class PreferencesStore {
  theme: Theme = "dark";
  language = "en";
  region = "US";

  constructor() {
    makeAutoObservable(this);
    this.initializeSettings();
    this.applyThemeToDOM();

    reaction(
      () => ({ theme: this.theme, language: this.language, region: this.region }),
      (settings) => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)),
    );
  }

  private initializeSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<{
          theme: Theme;
          language: string;
          region: string;
        }>;
        this.theme = parsed.theme ?? this.resolveSystemTheme();
        this.language = parsed.language ?? this.resolveBrowserLanguage();
        this.region = parsed.region ?? "US";
        return;
      } catch {
        // fall through
      }
    }

    this.theme = this.resolveSystemTheme();
    this.language = this.resolveBrowserLanguage();
    this.region = "US";
  }

  private resolveSystemTheme(): Theme {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  private resolveBrowserLanguage(): string {
    const browserLang = navigator.language?.split("-")[0] ?? "en";
    return SUPPORTED_LANGUAGES.some((l) => l.code === browserLang) ? browserLang : "en";
  }

  get tmdbLanguage(): string {
    const map: Record<string, string> = { en: "en-US", es: "es-ES" };
    return map[this.language] ?? "en-US";
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    this.applyThemeToDOM();
  }

  toggleTheme() {
    this.setTheme(this.theme === "dark" ? "light" : "dark");
  }

  setLanguage(language: string) {
    this.language = language;
  }

  setRegion(region: string) {
    this.region = region;
  }

  applyThemeToDOM() {
    document.documentElement.classList.toggle("dark", this.theme === "dark");
  }
}

export const preferencesStore = new PreferencesStore();