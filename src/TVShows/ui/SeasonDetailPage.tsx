import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type SeasonDetail } from "../../core/tmdbSchemas";
import { type TVShowContextType } from "./TVShowLayout";
import { formatLocaleDate } from "../../core/formatDate";
import { preferencesStore } from "../../Preferences/core/PreferenceStore";

export const SeasonDetailPage = observer(function SeasonDetailPage() {
  const { t } = useTranslation(["tv", "common"]);
  const { language, region } = preferencesStore;
  const { seasonNumber } = useParams<{ seasonNumber: string }>();
  const { show } = useOutletContext<TVShowContextType>();

  const [season, setSeason] = useState<SeasonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeasonRoster() {
      if (!seasonNumber) return;
      setLoading(true);
      try {
        const details = await tmdbService.getTVSeasonDetails(show.id, seasonNumber);
        setSeason(details);
      } catch (err) {
        console.error("Error loading season:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadSeasonRoster();
  }, [seasonNumber, show.id, language, region]);

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-violet-600 dark:text-violet-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (!season || season.episodes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-100/50 py-12 text-center text-sm text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950/20">
        {t("tv:noEpisodes")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4 dark:border-zinc-900">
        <h2 className="text-xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">{season.name}</h2>
        {season.overview && (
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{season.overview}</p>
        )}
      </div>

      <div className="space-y-4">
        {season.episodes.map((episode) => {
          const thumbnail = episode.still_path
            ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
            : null;

          return (
            <div
              key={episode.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white/60 p-4 transition-colors hover:bg-zinc-50 sm:flex-row dark:border-zinc-900/60 dark:bg-zinc-950/30 dark:hover:bg-zinc-950/60"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200 sm:w-40 dark:bg-zinc-900 dark:ring-white/5">
                {thumbnail ? (
                  <img src={thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500 dark:text-zinc-700">
                    {t("common:noPreview")}
                  </div>
                )}
                <div className="absolute bottom-1 left-1 rounded border border-white/5 bg-black/80 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-zinc-400">
                  EP {episode.episode_number}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="truncate text-sm font-bold text-zinc-800 dark:text-zinc-100">{episode.name}</h3>
                    <label className="flex cursor-pointer select-none items-center gap-1.5 text-[10px] font-bold tracking-wide text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400">
                      <input
                        type="checkbox"
                        readOnly
                        checked={false}
                        className="pointer-events-none h-3.5 w-3.5 rounded border-zinc-300 bg-zinc-100 accent-violet-600 focus:ring-0 focus:ring-offset-0 dark:border-zinc-800 dark:bg-zinc-900"
                      />
                      <span>{t("tv:watched")}</span>
                    </label>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 sm:line-clamp-3 dark:text-zinc-400">
                    {episode.overview || t("tv:noEpisodeOverview")}
                  </p>
                </div>

                {episode.air_date && (
                  <p className="mt-2 text-[10px] font-semibold text-zinc-500">
                    {t("tv:airDate", { date: formatLocaleDate(episode.air_date) })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
