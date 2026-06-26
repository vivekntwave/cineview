import { useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "react-router";
import { tmdbService } from "../../data/tmdbService";
import { type MediaItem } from "../../core/tmdbSchemas";
import { MovieCard, SectionErrorBoundary } from "../../Common/index.ts";

const HISTORY_KEY = "cineview_search_history";

export function SearchPage() {
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
        console.error("Error executing query searching dispatch metrics:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(delayTimer);
    };
  }, [query]);

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
    <div className="min-h-screen bg-black text-white px-6 sm:px-12 py-8 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-6 text-zinc-100">
          Discover Content
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && commitToHistory(query)}
            placeholder="Search for movies, tv networks, directors or actors..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-500 rounded-xl px-5 py-3.5 pl-12 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-violet-500 shadow-xl transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">🔍</span>

          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          )}
        </div>

        {history.length > 0 && !query && (
          <div className="mt-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-2">
              <span>Recent Enquiries</span>
              <button
                type="button"
                onClick={handleClearHistory}
                className="hover:text-zinc-300 transition-colors lowercase font-normal"
              >
                clear history
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((term, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSearchParams({ q: term })}
                  className="rounded-lg bg-zinc-950 border border-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 transition-all font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-12 space-y-12">
        {query && !loading && !hasAnyResults && (
          <div className="text-center py-16 bg-zinc-950/20 border border-dashed border-zinc-900 rounded-xl max-w-3xl mx-auto">
            <p className="text-sm font-bold text-zinc-400">No matching search metrics returned</p>
            <p className="text-xs text-zinc-600 mt-1">Double check your inputs or try looking for alternative titles instead.</p>
          </div>
        )}

        {hasAnyResults && (
          <>
            <SearchGroupRow title="Movies" items={movies} />
            <SearchGroupRow title="TV Shows & Networks" items={tvShows} />

            <SectionErrorBoundary>
              {people.length > 0 && (
                <div className="flex flex-col">
                  <h2 className="text-md font-bold tracking-wider text-zinc-400 uppercase mb-4 border-b border-zinc-900 pb-2">
                    Cast & Crew ({people.length})
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {people.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-900 p-2.5 rounded-xl pr-6 min-w-45"
                      >
                        <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden text-center flex items-center justify-center border border-white/5 shrink-0">
                          {person.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm">👤</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-200 truncate">{person.title || person.name}</p>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 uppercase">Profile</p>
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
}

interface SearchGroupRowProps {
  title: string;
  items: MediaItem[];
}

function SearchGroupRow({ title, items }: SearchGroupRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="text-md font-bold tracking-wider text-zinc-400 uppercase mb-4 border-b border-zinc-900 pb-2">
        {title} ({items.length})
      </h2>
      <SectionErrorBoundary>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {items.map((item) => (
            <MovieCard key={item.id} media={item} />
          ))}
        </div>
      </SectionErrorBoundary>
    </div>
  );
}
