import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate, useLocation } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type TVShowDetail } from "../../core/tmdbSchemas";
import { WatchlistToggle } from "../../Collection/ui/WatchlistToggle";
import { AddToListPopover } from "../../Collection/ui/AddToListPopover";
import { collectionStore } from "../../Collection/core/CollectionStore";
import { preferencesStore } from "../../Preferences/core/PreferenceStore";

export interface TVShowContextType {
  show: TVShowDetail;
}

export const TVShowLayout = observer(function TVShowLayout() {
  const { t } = useTranslation(["tv", "common"]);
  const { language, region } = preferencesStore;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState<TVShowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    async function loadTVContext() {
      if (!id) return;
      setLoading(true);
      setError404(false);

      try {
        const detailsData = await tmdbService.getTVShowDetails(id);
        setShow(detailsData);
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        if (errorInstance.message === "ENTITY_NOT_FOUND") {
          setError404(true);
        } else {
          console.error("Error loading TV show:", errorInstance);
        }
      } finally {
        setLoading(false);
      }
    }
    void loadTVContext();
  }, [id, language, region]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-violet-600 dark:bg-black dark:text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  if (error404 || !show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-black dark:text-white">
        <h1 className="text-6xl font-black text-zinc-300 dark:text-zinc-800">404</h1>
        <p className="mt-2 text-lg font-bold text-zinc-700 dark:text-zinc-200">{t("tv:notFoundTitle")}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          {t("common:returnHome")}
        </button>
      </div>
    );
  }

  const isNestedSubPage = location.pathname.includes("/season/");

  const activeSeasons = show.seasons.filter((s) => s.season_number > 0);
  const showProgress = collectionStore.getShowProgress(
    show.id,
    activeSeasons.map((s) => ({ seasonNumber: s.season_number, episodeCount: s.episode_count })),
  );
  const showProgressPct =
    showProgress.total > 0 ? Math.round((showProgress.watched / showProgress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 text-zinc-900 dark:bg-black dark:text-white">
      <div className="relative h-[40vh] w-full bg-zinc-200 dark:bg-zinc-900">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

        {isNestedSubPage && (
          <button
            type="button"
            onClick={() => navigate(`/tv/${show.id}`)}
            className="absolute top-6 left-6 flex items-center gap-2 rounded-lg border border-zinc-700 bg-black/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur-md transition-colors hover:text-white sm:left-12"
          >
            ← {t("tv:backToSeasons")}
          </button>
        )}
      </div>

      <div className="relative z-10 mx-auto -mt-24 max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start gap-8 border-b border-zinc-200 pb-8 md:flex-row dark:border-zinc-900">
          <div className="mx-auto w-40 shrink-0 sm:w-50 md:mx-0">
            <div className="aspect-2/3 overflow-hidden rounded-xl bg-zinc-200 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/10">
              {show.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-500 dark:text-zinc-700">
                  ✕ {t("common:noArtwork")}
                </div>
              )}
            </div>
            <WatchlistToggle
              media={show}
              className="mt-4"
              extras={{ totalEpisodes: show.number_of_episodes }}
            />
            <AddToListPopover
              media={show}
              variant="button"
              className="mt-2"
              extras={{ totalEpisodes: show.number_of_episodes }}
            />
          </div>

          <div className="flex-1 pt-2 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{show.name}</h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 md:justify-start">
              <span className="font-bold text-amber-500 dark:text-amber-400">
                ★ {show.vote_average?.toFixed(1) ?? t("common:notRated")}
              </span>
              <span>•</span>
              <span>{show.first_air_date?.split("-")[0]}</span>
              <span>•</span>
              <span>
                {t("tv:seasonsAndEpisodes", {
                  seasons: show.number_of_seasons,
                  episodes: show.number_of_episodes,
                })}
              </span>
            </div>

            {showProgress.total > 0 && (
              <div className="mt-4 max-w-md">
                <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>{t("tv:showProgress")}</span>
                  <span>
                    {t("tv:episodeProgress", {
                      watched: showProgress.watched,
                      total: showProgress.total,
                    })}{" "}
                    ({showProgressPct}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-300"
                    style={{ width: `${showProgressPct}%` }}
                  />
                </div>
              </div>
            )}

            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{show.overview}</p>
          </div>
        </div>

        <div className="mt-10">
          <Outlet context={{ show } satisfies TVShowContextType} />
        </div>
      </div>
    </div>
  );
});
