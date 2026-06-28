import { useOutletContext, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { type TVShowContextType } from "./TVShowLayout";

export function TVShowDetailPage() {
  const { t } = useTranslation(["tv", "common"]);
  const { show } = useOutletContext<TVShowContextType>();
  const activeSeasons = show.seasons.filter((s) => s.season_number > 0);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">
        {t("tv:browseSeasons")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeSeasons.map((season) => {
          const seasonPoster = season.poster_path
            ? `https://image.tmdb.org/t/p/w342${season.poster_path}`
            : null;

          return (
            <Link
              key={season.id}
              to={`season/${season.season_number}`}
              className="group flex gap-4 rounded-xl border border-zinc-200 bg-white/80 p-3 transition-all duration-200 hover:border-violet-500/40 hover:bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950/40 dark:hover:bg-zinc-900/20"
            >
              <div className="aspect-2/3 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/5">
                {seasonPoster ? (
                  <img src={seasonPoster} alt={season.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500 dark:text-zinc-600">
                    {t("common:noImage")}
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                <h3 className="truncate text-sm font-bold text-zinc-800 transition-colors group-hover:text-violet-600 dark:text-zinc-200 dark:group-hover:text-violet-400">
                  {season.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-zinc-500">
                  {t("tv:episodesPublished", { count: season.episode_count })}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600 transition-transform group-hover:translate-x-1 dark:text-violet-400">
                  {t("tv:viewEpisodes")} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
