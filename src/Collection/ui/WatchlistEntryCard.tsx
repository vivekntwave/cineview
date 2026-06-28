import { useState } from "react";
import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { watchlistStore } from "../core/WatchlistStore";
import { type WatchlistEntry, type WatchlistStatus } from "../core/watchlistSchema";

interface WatchlistEntryCardProps {
  entry: WatchlistEntry;
}

const STATUS_OPTIONS: WatchlistStatus[] = ["want_to_watch", "watching", "completed"];

export const WatchlistEntryCard = observer(function WatchlistEntryCard({
  entry,
}: WatchlistEntryCardProps) {
  const { t } = useTranslation(["collection", "common"]);
  const [note, setNote] = useState(entry.note ?? "");

  const detailPath = entry.mediaType === "movie" ? `/movie/${entry.mediaId}` : `/tv/${entry.mediaId}`;
  const posterUrl = entry.snapshot.posterPath
    ? `https://image.tmdb.org/t/p/w500${entry.snapshot.posterPath}`
    : null;

  const statusLabel = (status: WatchlistStatus) => {
    const map: Record<WatchlistStatus, string> = {
      want_to_watch: t("collection:statusWantToWatch"),
      watching: t("collection:statusWatching"),
      completed: t("collection:statusCompleted"),
    };
    return map[status];
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row dark:border-zinc-800 dark:bg-zinc-950">
      <Link to={detailPath} className="mx-auto shrink-0 sm:mx-0">
        <div className="aspect-2/3 w-28 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-900">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={entry.snapshot.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-xs text-zinc-500">
              {entry.snapshot.title}
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={detailPath}
            className="truncate text-lg font-bold text-zinc-900 hover:text-violet-600 dark:text-zinc-100 dark:hover:text-violet-400"
          >
            {entry.snapshot.title}
          </Link>
          <button
            type="button"
            onClick={() => watchlistStore.remove(entry.mediaId, entry.mediaType)}
            className="shrink-0 rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-400 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-500 dark:hover:text-red-400"
          >
            {t("collection:remove")}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {t("collection:statusLabel")}
            <select
              value={entry.status}
              onChange={(e) =>
                watchlistStore.updateStatus(entry.id, e.target.value as WatchlistStatus)
              }
              className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>

          {entry.snapshot.voteAverage !== undefined && entry.snapshot.voteAverage > 0 && (
            <span className="text-xs font-bold text-amber-500">
              ★ {entry.snapshot.voteAverage.toFixed(1)}
            </span>
          )}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => watchlistStore.updateNote(entry.id, note)}
          placeholder={t("collection:notePlaceholder")}
          maxLength={300}
          rows={2}
          className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500"
        />
        <p className="text-right text-[10px] text-zinc-400">{note.length}/300</p>
      </div>
    </div>
  );
});
