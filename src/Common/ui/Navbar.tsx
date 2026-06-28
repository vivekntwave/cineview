import { NavLink, useNavigate } from "react-router";
import { useState, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { watchlistStore } from "../../Collection/core/WatchlistStore";

export const Navbar = observer(function Navbar() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const goToSearch = (query?: string) => {
    const trimmed = query?.trim() ?? "";
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-xl font-bold text-violet-600 dark:text-violet-300">
            {t("appName")}
          </NavLink>
          <div className="flex items-center gap-4">
            <NavLink to="/" end className={navClass}>{t("nav.home")}</NavLink>
            <NavLink to="/watchlist" className={navClass}>
              {t("nav.watchlist")}
              {watchlistStore.totalCount > 0 && (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {watchlistStore.totalCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/collections" className={navClass}>{t("nav.collections")}</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form
            onSubmit={(e: SubmitEvent) => { e.preventDefault(); goToSearch(searchQuery); }}
            className="flex items-center gap-2"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-64 rounded-full border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-violet-500 dark:hover:text-violet-300"
            >
              {t("nav.search")}
            </button>
          </form>
          <NavLink
            to="/preferences"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-violet-500 dark:hover:text-violet-300"
          >
            {t("nav.settings")}
          </NavLink>
        </div>
      </nav>
    </header>
  );
});

function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-violet-600 underline underline-offset-8 decoration-2 font-medium dark:text-violet-300"
    : "text-zinc-700 hover:text-violet-600 dark:text-white dark:hover:text-violet-300";
}