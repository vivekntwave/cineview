import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { collectionStore } from "../core/CollectionStore";
import { type WatchlistFilter, type WatchlistSort } from "../core/collectionSchema";
import { WatchlistEntryCard } from "./WatchlistEntryCard";

const FILTERS: WatchlistFilter[] = ["all", "want_to_watch", "watching", "completed"];
const SORT_OPTIONS: WatchlistSort[] = ["dateAdded", "rating", "title"];

export const WatchlistPage = observer(function WatchlistPage() {
  const { t } = useTranslation("collection");
  const [filter, setFilter] = useState<WatchlistFilter>("all");
  const [sortBy, setSortBy] = useState<WatchlistSort>("dateAdded");

  const entries = collectionStore.getEntries(filter, sortBy);

  const filterLabel = (f: WatchlistFilter) => {
    const labels: Record<WatchlistFilter, string> = {
      all: t("filterAll"),
      want_to_watch: t("filterWantToWatch"),
      watching: t("filterWatching"),
      completed: t("filterCompleted"),
    };
    return labels[f];
  };

  const filterCount = (f: WatchlistFilter) => {
    if (f === "all") return collectionStore.totalCount;
    return collectionStore.countByStatus(f);
  };

  const sortLabel = (s: WatchlistSort) => {
    const labels: Record<WatchlistSort, string> = {
      dateAdded: t("sortDateAdded"),
      rating: t("sortRating"),
      title: t("sortTitle"),
    };
    return labels[s];
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 sm:p-8 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">{t("watchlistTitle")}</h1>

        {collectionStore.totalCount === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-4xl">🎬</p>
            <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {t("emptyWatchlistTitle")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              {t("emptyWatchlistBody")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === f
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {filterLabel(f)} ({filterCount(f)})
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <label htmlFor="watchlist-sort" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {t("sortLabel")}
              </label>
              <select
                id="watchlist-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as WatchlistSort)}
                className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {sortLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            {entries.length === 0 ? (
              <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t("emptyFilter")}
              </p>
            ) : (
              <div className="mt-6 flex flex-col gap-4">
                {entries.map((entry) => (
                  <WatchlistEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
