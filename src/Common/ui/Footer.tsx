import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-2.5 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
          <p className="text-base font-semibold text-zinc-900 dark:text-white">{t("appName")}</p>
          <p className="text-xs text-zinc-500">{t("footerTagline")}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:gap-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            <NavLink className="transition-colors hover:text-violet-600 dark:hover:text-violet-500" to="/about">
              {t("about")}
            </NavLink>
            <NavLink className="transition-colors hover:text-violet-600 dark:hover:text-violet-500" to="/privacy">
              {t("privacy")}
            </NavLink>
            <NavLink className="transition-colors hover:text-violet-600 dark:hover:text-violet-500" to="/terms">
              {t("terms")}
            </NavLink>
            <NavLink className="transition-colors hover:text-violet-600 dark:hover:text-violet-500" to="/contact">
              {t("contact")}
            </NavLink>
          </div>

          <p className="text-[11px] whitespace-nowrap text-zinc-400">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
