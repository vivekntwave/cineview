import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  preferencesStore,
  SUPPORTED_LANGUAGES,
  SUPPORTED_REGIONS,
  type Theme,
} from "../core/PreferenceStore";
import { logout } from "../../Auth/data/authService";

export const PreferencesPage = observer(function PreferencesPage() {
  const { t } = useTranslation(["settings", "common"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900 dark:bg-black dark:text-white sm:px-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight">{t("settings:title")}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("settings:subtitle")}</p>

        <div className="mt-8 space-y-6">
          {/* Language */}
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <label htmlFor="language" className="text-sm font-bold">
              {t("settings:language")}
            </label>
            <p className="mt-1 text-xs text-zinc-500">{t("settings:languageHelp")}</p>
            <select
              id="language"
              value={preferencesStore.language}
              onChange={(e) => preferencesStore.setLanguage(e.target.value)}
              className="mt-3 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </section>

          {/* Region */}
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <label htmlFor="region" className="text-sm font-bold">
              {t("settings:region")}
            </label>
            <p className="mt-1 text-xs text-zinc-500">{t("settings:regionHelp")}</p>
            <select
              id="region"
              value={preferencesStore.region}
              onChange={(e) => preferencesStore.setRegion(e.target.value)}
              className="mt-3 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {SUPPORTED_REGIONS.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.label}
                </option>
              ))}
            </select>
          </section>

          {/* Theme */}
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-bold">{t("settings:theme")}</p>
            <p className="mt-1 text-xs text-zinc-500">{t("settings:themeHelp")}</p>
            <div className="mt-3 flex gap-2">
              {(["light", "dark"] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => preferencesStore.setTheme(theme)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    preferencesStore.theme === theme
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {t(`settings:${theme}`)}
                </button>
              ))}
            </div>
          </section>

          {/* Logout */}
          <section className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{t("settings:logout")}</p>
            <p className="mt-1 text-xs text-red-600/80 dark:text-red-400">{t("settings:logoutHelp")}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              {t("settings:logout")}
            </button>
          </section>

          <p className="text-xs text-zinc-500">{t("settings:saved")}</p>
        </div>
      </div>
    </div>
  );
});