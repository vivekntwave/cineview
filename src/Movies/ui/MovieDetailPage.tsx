import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type MovieDetail, type MediaItem, type CastMember } from "../../core/tmdbSchemas";
import { MovieCard, TrailerModal } from "../../Common/index.ts";
import { WatchlistToggle } from "../../Collection/ui/WatchlistToggle";
import { AddToListPopover } from "../../Collection/ui/AddToListPopover";
import { preferencesStore } from "../../Preferences/core/PreferenceStore";

export const MovieDetailPage = observer(function MovieDetailPage() {
  const { t } = useTranslation(["movie", "common"]);
  const { language, region } = preferencesStore;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    async function loadMovieContext() {
      if (!id) return;
      setLoading(true);
      setError404(false);

      try {
        const [detailsData, creditsData, recsData] = await Promise.all([
          tmdbService.getMovieDetails(id),
          tmdbService.getMovieCredits(id),
          tmdbService.getMovieRecommendations(id),
        ]);

        setMovie(detailsData);
        setCast(creditsData.cast.slice(0, 12));
        setRecommendations(recsData.results.slice(0, 8));
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        if (errorInstance.message === "ENTITY_NOT_FOUND") {
          setError404(true);
        } else {
          console.error("Error loading movie:", errorInstance);
        }
      } finally {
        setLoading(false);
      }
    }
    void loadMovieContext();
  }, [id, language, region]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-violet-600 dark:bg-black dark:text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  if (error404 || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-black dark:text-white">
        <h1 className="text-6xl font-black text-zinc-300 dark:text-zinc-800">404</h1>
        <p className="mt-2 text-lg font-bold text-zinc-700 dark:text-zinc-200">{t("movie:notFoundTitle")}</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{t("movie:notFoundBody")}</p>
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

  const trailer = movie.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const trailerKey = trailer?.key || movie.videos?.results[0]?.key || null;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 text-zinc-900 dark:bg-black dark:text-white">
      <div className="relative h-[45vh] w-full bg-zinc-200 md:h-[55vh] dark:bg-zinc-900">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-32 flex max-w-7xl flex-col gap-8 px-6 md:-mt-48 md:flex-row lg:px-8">
        <div className="mx-auto w-55 shrink-0 sm:w-70 md:mx-0">
          <div className="aspect-2/3 w-full overflow-hidden rounded-xl bg-zinc-200 shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/10">
            {movie.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-500 dark:text-zinc-700">
                ✕ {t("common:noPoster")}
              </div>
            )}
          </div>

          <WatchlistToggle media={movie} className="mt-4" />
          <AddToListPopover media={movie} variant="button" className="mt-2" />
        </div>

        <div className="flex-1 pt-4 text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{movie.title}</h1>

          {movie.tagline && (
            <p className="mt-2 text-sm font-medium italic text-zinc-500 sm:text-base dark:text-zinc-400">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 md:justify-start">
            <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
              ★ {movie.vote_average?.toFixed(1) ?? t("common:notRated")}
            </span>
            <span>•</span>
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span>
              {movie.runtime
                ? t("movie:runtimeMins", { count: movie.runtime })
                : t("common:notAvailable")}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start">
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-md border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300">
                {g.name}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-900">
            <h2 className="text-base font-bold tracking-wide text-zinc-800 uppercase dark:text-zinc-200">{t("movie:overview")}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {movie.overview || t("movie:noOverview")}
            </p>
          </div>

          {trailerKey && (
            <div className="mt-6 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-violet-600/10 duration-100 hover:bg-violet-500 active:scale-95"
              >
                🎬 {t("movie:openTrailer")}
              </button>
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-200">{t("movie:principalCast")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent dark:scrollbar-thumb-zinc-900">
            {cast.map((actor) => (
              <div key={actor.id} className="flex w-27.5 shrink-0 flex-col items-center rounded-xl border border-zinc-200 bg-white/80 p-2 text-center shadow-sm sm:w-33.75 dark:border-zinc-900/60 dark:bg-zinc-950/40">
                <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-zinc-200 ring-1 ring-zinc-200 sm:h-20 sm:w-20 dark:bg-zinc-900 dark:ring-white/5">
                  {actor.profile_path ? (
                    <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-zinc-400 dark:text-zinc-700">👤</div>
                  )}
                </div>
                <p className="line-clamp-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">{actor.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[10px] font-medium text-zinc-500">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-bold tracking-wide text-zinc-800 dark:text-zinc-200">{t("movie:recommended")}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent dark:scrollbar-thumb-zinc-900">
            {recommendations.map((rec) => (
              <MovieCard key={rec.id} media={rec} />
            ))}
          </div>
        </div>
      )}

      <TrailerModal videoKey={trailerKey} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
});
