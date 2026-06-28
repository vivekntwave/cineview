import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { type MediaItem } from "../../core/tmdbSchemas";
import { WatchlistToggle } from "../../Collection/ui/WatchlistToggle";

interface MovieCardProps {
  media: MediaItem;
}

export const MovieCard = observer(function MovieCard({ media }: MovieCardProps) {
  const { t } = useTranslation("common");

  const calculatedTitle = media.title || media.name || t("untitled");
  const calculatedDate = media.release_date || media.first_air_date || "";
  const displayYear = calculatedDate ? calculatedDate.split("-")[0] : t("notAvailable");

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  const routeTarget = media.title || media.release_date ? `/movie/${media.id}` : `/tv/${media.id}`;

  return (
    <Link
      to={routeTarget}
      className="group relative flex w-40 shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-zinc-200 transition-all duration-300 hover:scale-[1.02] hover:ring-violet-500/50 sm:w-50 dark:bg-zinc-950 dark:ring-white/5"
    >
      <div className="relative flex aspect-2/3 w-full items-center justify-center overflow-hidden bg-zinc-200 dark:bg-zinc-900">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={calculatedTitle}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <svg className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017 0z" />
            </svg>
            <span className="line-clamp-2 text-xs font-medium text-zinc-500">{calculatedTitle}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex items-center gap-1 rounded border border-white/5 bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-md">
          ★ {media.vote_average !== undefined && media.vote_average > 0 ? media.vote_average.toFixed(1) : t("notRated")}
        </div>

        <WatchlistToggle media={media} variant="icon" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3">
        <h3 className="truncate text-sm font-bold text-zinc-800 transition-colors group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
          {calculatedTitle}
        </h3>
        <p className="mt-0.5 text-xs font-medium text-zinc-500">{displayYear}</p>
      </div>
    </Link>
  );
});
