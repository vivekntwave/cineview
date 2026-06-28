import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type MediaItem, type PaginatedResponse } from "../../core/tmdbSchemas";
import { MovieCard } from "../../Common/ui/MovieCard";
import { SectionErrorBoundary } from "../../Common/ui/ErrorBoundary";

export interface ContentRowProps {
  title: string;
  initialItems: MediaItem[];
  selectedGenre: number | null;
  fetchType: "trending" | "popular" | "topRated" | "upcoming" | "popularTV" | "topRatedTV";
}

export function ContentRow({ title, initialItems, selectedGenre, fetchType }: ContentRowProps) {
  const { t } = useTranslation(["home", "common"]);
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
      console.error(`Failed to load more for [${title}]:`, err);
    } finally {
      setRowLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-xl font-bold tracking-wide text-zinc-800 dark:text-zinc-100">{title}</h2>
      <SectionErrorBoundary>
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-100/50 py-8 text-center text-sm text-zinc-500 dark:border-zinc-900 dark:bg-zinc-950/20">
            <p>{selectedGenre ? t("home:noGenreMatch") : t("home:noShows")}</p>
            {hasMore && selectedGenre && (
              <button
                type="button"
                onClick={handleFetchMore}
                disabled={rowLoading}
                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-violet-600 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-violet-400 dark:hover:bg-zinc-800"
              >
                {rowLoading ? t("common:scanningNextPage") : t("common:scanNextPage")}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent dark:scrollbar-thumb-zinc-800">
            {filteredItems.map((item) => (
              <MovieCard key={item.id} media={item} />
            ))}
            {hasMore && (
              <div className="shrink-0 pr-4">
                <button
                  type="button"
                  onClick={handleFetchMore}
                  disabled={rowLoading}
                  className="group flex h-56 w-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-100/80 text-zinc-500 transition-all hover:border-violet-500 hover:text-violet-600 disabled:opacity-50 sm:h-64 sm:w-44 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-violet-400"
                >
                  {rowLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <span className="text-xl transition-transform group-hover:translate-x-1">➔</span>
                      <span className="text-xs font-bold tracking-wider uppercase">
                        {selectedGenre ? t("common:fetchDeeper") : t("common:loadMore")}
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
