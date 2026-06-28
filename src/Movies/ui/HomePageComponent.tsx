import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type MediaItem } from "../../core/tmdbSchemas";
import { TrailerModal } from "../../Common/ui/TrailerModal";
import { preferencesStore } from "../../Preferences/core/PreferenceStore";
import { ContentRow } from "./ContentRow";

export function HomePageComponent() {
  const { t } = useTranslation(["home", "common"]);
  const { language, region } = preferencesStore;

  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popular, setPopular] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [heroMovie, setHeroMovie] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardData() {
      setLoading(true);
      try {
        const [
          trendingData,
          popularData,
          topRatedData,
          upcomingData,
          popularTVData,
          topRatedTVData,
          movieGenreData,
        ] = await Promise.all([
          tmdbService.getTrending("all", "day", 1),
          tmdbService.getPopularMovies(1),
          tmdbService.getTopRatedMovies(1),
          tmdbService.getUpcomingMovies(1),
          tmdbService.getPopularTVShows(1),
          tmdbService.getTopRatedTVShows(1),
          tmdbService.getMovieGenres(),
        ]);

        if (cancelled) return;

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setUpcoming(upcomingData.results);
        setPopularTV(popularTVData.results);
        setTopRatedTV(topRatedTVData.results);
        setGenres(movieGenreData.genres);
        setHeroMovie(trendingData.results[0] ?? null);
        setSelectedGenre(null);
      } catch (error) {
        console.error("Error populating home layout:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDashboardData();
    return () => { cancelled = true; };
  }, [language, region]);

  const handleOpenHeroTrailer = async () => {
    if (!heroMovie) return;
    try {
      const details = await tmdbService.getMovieDetails(heroMovie.id);
      const officialTrailer = details.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      setTrailerKey(officialTrailer?.key || details.videos?.results[0]?.key || null);
      setIsModalOpen(true);
    } catch {
      setTrailerKey(null);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-violet-600 dark:bg-black dark:text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-50 pb-16 text-zinc-900 dark:bg-black dark:text-white">
      {heroMovie && (
        <div className="relative flex h-[70vh] w-full items-end bg-zinc-200 dark:bg-zinc-900">
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title ?? heroMovie.name ?? ""}
              className="h-full w-full animate-fade-in object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 max-w-3xl px-6 pb-12 sm:px-12">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-violet-600/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                {t("home:spotlight")}
              </span>
              <span className="text-sm font-bold text-amber-400">
                ★ {heroMovie.vote_average?.toFixed(1) ?? t("common:notRated")}
              </span>
            </div>
            <h1 className="line-clamp-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {heroMovie.title || heroMovie.name}
            </h1>
            <p className="mt-4 line-clamp-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
              {heroMovie.overview}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleOpenHeroTrailer}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-colors duration-100 hover:bg-zinc-200 active:scale-95"
              >
                ▶ {t("home:playTrailer")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 px-6 sm:px-12">
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${selectedGenre === null
                ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "border-zinc-300 bg-white text-zinc-600 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
          >
            {t("home:allGenres")}
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => setSelectedGenre(genre.id)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${selectedGenre === genre.id
                  ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "border-zinc-300 bg-white text-zinc-600 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-10 px-6 sm:px-12">
        <ContentRow title={t("home:trending")} initialItems={trending} selectedGenre={selectedGenre} fetchType="trending" />
        <ContentRow title={t("home:popularMovies")} initialItems={popular} selectedGenre={selectedGenre} fetchType="popular" />
        <ContentRow title={t("home:popularTV")} initialItems={popularTV} selectedGenre={selectedGenre} fetchType="popularTV" />
        <ContentRow title={t("home:topRatedMovies")} initialItems={topRated} selectedGenre={selectedGenre} fetchType="topRated" />
        <ContentRow title={t("home:topRatedTV")} initialItems={topRatedTV} selectedGenre={selectedGenre} fetchType="topRatedTV" />
        <ContentRow title={t("home:upcoming")} initialItems={upcoming} selectedGenre={selectedGenre} fetchType="upcoming" />
      </div>

      <TrailerModal videoKey={trailerKey} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
