import { type MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { type MediaItem } from "../../core/tmdbSchemas";
import { watchlistStore } from "../core/WatchlistStore";

interface WatchlistToggleProps {
  media: MediaItem;
  variant?: "icon" | "button";
  className?: string;
}

function getMediaType(media: MediaItem): "movie" | "tv" {
  return media.title || media.release_date ? "movie" : "tv";
}

export const WatchlistToggle = observer(function WatchlistToggle({
  media,
  variant = "button",
  className = "",
}: WatchlistToggleProps) {
  const { t } = useTranslation(["movie", "collection"]);
  const mediaType = getMediaType(media);
  const inWatchlist = watchlistStore.isInWatchlist(media.id, mediaType);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    watchlistStore.toggle(media);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-label={inWatchlist ? t("movie:removeFromWatchlist") : t("movie:addToWatchlist")}
        onClick={handleClick}
        className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/70 text-sm backdrop-blur-md transition-colors hover:bg-violet-600 ${inWatchlist ? "text-violet-400" : "text-zinc-300 hover:text-white"} ${className}`}
      >
        {inWatchlist ? "✓" : "+"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-xs font-semibold tracking-wide transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white ${inWatchlist ? "text-violet-600 dark:text-violet-400" : "text-zinc-700"} ${className}`}
    >
      {inWatchlist ? `✓ ${t("movie:inWatchlist")}` : `➕ ${t("movie:addToWatchlist")}`}
    </button>
  );
});
