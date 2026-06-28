import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-black dark:text-white">
      <h1 className="text-3xl font-black">{t("notFoundTitle")}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t("notFoundBody")}</p>
      <NavLink
        to="/"
        className="mt-6 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
      >
        {t("returnHome")}
      </NavLink>
    </div>
  );
}
