import { useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { tmdbService } from "../../data/tmdbService";
import { type MediaItem } from "../../core/tmdbSchemas";
import { MovieCard, SectionErrorBoundary } from "../../Common/index.ts";
import { preferencesStore } from "../../Preferences/core/PreferenceStore";

const HISTORY_KEY = "cineview_search_history";

export const SearchPage = observer(function SearchPage() {
  const { t } = useTranslation(["search", "common"]);
  const { language, region } = preferencesStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [results, setResults] = useState<MediaItem[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const delayTimer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const searchPayload = await tmdbService.searchMulti(query);
        if (!cancelled) setResults(searchPayload.results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
    };
  }, [query, language, region]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim()) {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ q: value }, { replace: true });
    }
  };

  const commitToHistory = (searchTarget: string) => {
    const cleanTarget = searchTarget.trim();
    if (!cleanTarget) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== cleanTarget.toLowerCase());
      const updated = [cleanTarget, ...filtered].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const movies = results.filter((item) => item.media_type === "movie" || (item.title && !item.name));
  const tvShows = results.filter((item) => item.media_type === "tv" || (item.name && !item.title));
  const people = results.filter((item) => item.media_type === "person");
  const hasAnyResults = results.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-8 pb-20 text-zinc-900 dark:bg-black dark:text-white sm:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-black tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
          {t("search:title")}
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && commitToHistory(query)}
            placeholder={t("search:placeholder")}
            className="w-full rounded-xl border border-zinc-300 bg-white px-5 py-3.5 pl-12 text-sm text-zinc-800 shadow-xl transition-all placeholder-zinc-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500"
          />
          <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg text-zinc-400">🔍</span>
          {loading && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          )}
        </div>

        {history.length > 0 && !query && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              <span>{t("search:recent")}</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="font-normal lowercase transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {t("search:clearHistory")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((term, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSearchParams({ q: term })}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-violet-500/30 hover:text-violet-600 dark:border-zinc-900 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-7xl space-y-12">
        {query && !loading && !hasAnyResults && (
          <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-zinc-300 bg-zinc-100/50 py-16 text-center dark:border-zinc-900 dark:bg-zinc-950/20">
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{t("search:noResultsTitle")}</p>
            <p className="mt-1 text-xs text-zinc-500">{t("search:noResultsBody")}</p>
          </div>
        )}

        {hasAnyResults && (
          <>
            <SearchGroupRow title={t("search:movies")} items={movies} />
            <SearchGroupRow title={t("search:tvShows")} items={tvShows} />
            <SectionErrorBoundary>
              {people.length > 0 && (
                <div className="flex flex-col">
                  <h2 className="text-md mb-4 border-b border-zinc-200 pb-2 font-bold tracking-wider text-zinc-500 uppercase dark:border-zinc-900 dark:text-zinc-400">
                    {t("search:castCrew")} ({people.length})
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {people.map((person) => (
                      <div
                        key={person.id}
                        className="flex min-w-45 items-center gap-3 rounded-xl border border-zinc-200 bg-white/80 p-2.5 pr-6 dark:border-zinc-900 dark:bg-zinc-950/40"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 text-center dark:border-white/5 dark:bg-zinc-900">
                          {person.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm">👤</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">{person.title || person.name}</p>
                          <p className="mt-0.5 text-[10px] font-semibold text-zinc-500 uppercase">{t("search:profile")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionErrorBoundary>
          </>
        )}
      </div>
    </div>
  );
});

interface SearchGroupRowProps {
  title: string;
  items: MediaItem[];
}

function SearchGroupRow({ title, items }: SearchGroupRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="text-md mb-4 border-b border-zinc-200 pb-2 font-bold tracking-wider text-zinc-500 uppercase dark:border-zinc-900 dark:text-zinc-400">
        {title} ({items.length})
      </h2>
      <SectionErrorBoundary>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent dark:scrollbar-thumb-zinc-800">
          {items.map((item) => (
            <MovieCard key={item.id} media={item} />
          ))}
        </div>
      </SectionErrorBoundary>
    </div>
  );
}
