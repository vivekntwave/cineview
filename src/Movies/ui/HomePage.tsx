import { useState, useEffect } from "react";
import { tmdbService } from "../../data/tmdbService";
import { type MediaItem, type PaginatedResponse } from "../../core/tmdbSchemas";
import { MovieCard } from "../../Common/ui/MovieCard";
import { SectionErrorBoundary } from "../../Common/ui/ErrorBoundary";
import { TrailerModal } from "../../Common/ui/TrailerModal";

export function HomePage() {
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
    async function loadDashboardData() {
      try {
        const [
          trendingData,
          popularData,
          topRatedData,
          upcomingData,
          popularTVData,
          topRatedTVData,
          movieGenreData
        ] = await Promise.all([
          tmdbService.getTrending("all", "day", 1),
          tmdbService.getPopularMovies(1),
          tmdbService.getTopRatedMovies(1),
          tmdbService.getUpcomingMovies(1),
          tmdbService.getPopularTVShows(1), tmdbService.getTopRatedTVShows(1), tmdbService.getMovieGenres(),
        ]);

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setUpcoming(upcomingData.results);

        setPopularTV(popularTVData.results);
        setTopRatedTV(topRatedTVData.results);

        setGenres(movieGenreData.genres);

        if (trendingData.results.length > 0) {
          setHeroMovie(trendingData.results[0] || null);
        }
      } catch (error) {
        console.error("Error populating home layout metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleOpenHeroTrailer = async () => {
    if (!heroMovie) return;
    try {
      const details = await tmdbService.getMovieDetails(heroMovie.id);
      const officialTrailer = details.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
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
      <div className="flex min-h-screen items-center justify-center bg-black text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16 overflow-x-hidden">
      {heroMovie && (
        <div className="relative h-[70vh] w-full flex items-end bg-zinc-900">
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="h-full w-full object-cover opacity-40 animate-fade-in"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          </div>
          <div className="relative max-w-3xl px-6 sm:px-12 pb-12 z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-violet-600/80 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                Spotlight
              </span>
              <span className="text-sm font-bold text-amber-400">
                ★ {heroMovie.vote_average?.toFixed(1) ?? "NR"}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white line-clamp-2">
              {heroMovie.title || heroMovie.name}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-300 line-clamp-3 max-w-2xl">
              {heroMovie.overview}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleOpenHeroTrailer}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors shadow-lg active:scale-95 duration-100 cursor-pointer"
              >
                ▶ Play Trailer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 sm:px-12 mt-8">
        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedGenre(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${selectedGenre === null
              ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/20"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
          >
            All Generic Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => setSelectedGenre(genre.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${selectedGenre === genre.id
                ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/20"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 sm:px-12 mt-8 space-y-10">
        <ContentRow
          title="Trending Media"
          initialItems={trending}
          selectedGenre={selectedGenre}
          fetchType="trending"
        />
        <ContentRow
          title="Popular Blockbusters"
          initialItems={popular}
          selectedGenre={selectedGenre}
          fetchType="popular"
        />

        <ContentRow
          title="Popular TV Shows"
          initialItems={popularTV}
          selectedGenre={selectedGenre}
          fetchType="popularTV"
        />

        <ContentRow
          title="Top Critically Rated"
          initialItems={topRated}
          selectedGenre={selectedGenre}
          fetchType="topRated"
        />

        <ContentRow
          title="Top Rated TV Shows"
          initialItems={topRatedTV}
          selectedGenre={selectedGenre}
          fetchType="topRatedTV"
        />

        <ContentRow
          title="Upcoming Releases"
          initialItems={upcoming}
          selectedGenre={selectedGenre}
          fetchType="upcoming"
        />
      </div>

      <TrailerModal
        videoKey={trailerKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

interface ContentRowProps {
  title: string;
  initialItems: MediaItem[];
  selectedGenre: number | null;
  fetchType: "trending" | "popular" | "topRated" | "upcoming" | "popularTV" | "topRatedTV"; // 🟢 Added TV fetch types
}

function ContentRow({ title, initialItems, selectedGenre, fetchType }: ContentRowProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowLoading, setRowLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        setItems(initialItems);
        setCurrentPage(1);
        setHasMore(true);
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [initialItems]);

  const filteredItems = selectedGenre
    ? items.filter((item) => item.genre_ids?.includes(selectedGenre))
    : items;

  const handleFetchMore = async () => {
    if (rowLoading || !hasMore) return;
    setRowLoading(true);

    const nextPage = currentPage + 1;

    try {
      let payload: PaginatedResponse;

      if (selectedGenre && (fetchType === "popularTV" || fetchType === "topRatedTV")) {
        payload = await tmdbService.getTVShowsByGenre(selectedGenre, nextPage);
      } else if (selectedGenre) {
        payload = await tmdbService.getMoviesByGenre(selectedGenre, nextPage);
      } else {
        // Standard non-filtered lists
        switch (fetchType) {
          case "trending":
            payload = await tmdbService.getTrending("all", "day", nextPage);
            break;
          case "popular":
            payload = await tmdbService.getPopularMovies(nextPage);
            break;
          case "topRated":
            payload = await tmdbService.getTopRatedMovies(nextPage);
            break;
          case "upcoming":
            payload = await tmdbService.getUpcomingMovies(nextPage);
            break;
          case "popularTV":
            payload = await tmdbService.getPopularTVShows(nextPage);
            break;
          case "topRatedTV":
            payload = await tmdbService.getTopRatedTVShows(nextPage);
            break;
        }
      }

      if (payload.results.length === 0 || nextPage >= payload.total_pages) {
        setHasMore(false);
      }

      setItems((prev) => [...prev, ...payload.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error(`Failed to load more pages for row segment [${title}]:`, err);
    } finally {
      setRowLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-zinc-100 tracking-wide mb-4">{title}</h2>
      <SectionErrorBoundary>
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center gap-3 justify-center">
            <p>{selectedGenre ? "No items match this genre filter on current pages." : "No shows available right now."}</p>
            {hasMore && selectedGenre && (
              <button
                type="button"
                onClick={handleFetchMore}
                disabled={rowLoading}
                className="px-4 py-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-violet-400 transition-all cursor-pointer disabled:opacity-50"
              >
                {rowLoading ? "Scanning Next Page..." : "Scan Next API Page"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent items-center">
            {filteredItems.map((item) => (
              <MovieCard key={item.id} media={item} />
            ))}

            {hasMore && (
              <div className="shrink-0 pr-4">
                <button
                  type="button"
                  onClick={handleFetchMore}
                  disabled={rowLoading}
                  className="w-36 h-56 sm:w-44 sm:h-64 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 flex flex-col items-center justify-center gap-2 transition-all hover:border-violet-500 text-zinc-400 hover:text-violet-400 group cursor-pointer disabled:opacity-50"
                >
                  {rowLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <span className="text-xl group-hover:translate-x-1 transition-transform">➔</span>
                      <span className="text-xs font-bold tracking-wider uppercase">
                        {selectedGenre ? "Fetch Deeper" : "Load More"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </SectionErrorBoundary>
    </div>
  );
}
