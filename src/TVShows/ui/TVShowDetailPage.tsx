import { useOutletContext, Link } from "react-router";
import { type TVShowContextType } from "./TVShowLayout";

export function TVShowDetailPage() {
  const { show } = useOutletContext<TVShowContextType>();

  const activeSeasons = show.seasons.filter((s) => s.season_number > 0);

  return (
    <div>
      <h2 className="text-xl font-bold tracking-wide text-zinc-100 mb-6">Browse Available Seasons</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeSeasons.map((season) => {
          const seasonPoster = season.poster_path
            ? `https://image.tmdb.org/t/p/w342${season.poster_path}`
            : null;

          return (
            <Link
              key={season.id}
              to={`season/${season.season_number}`}
              className="group flex gap-4 bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 hover:border-violet-500/40 hover:bg-zinc-900/20 transition-all duration-200"
            >
              <div className="w-20 aspect-2/3 bg-zinc-900 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/5">
                {seasonPoster ? (
                  <img src={seasonPoster} alt={season.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-600">No Image</div>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <h3 className="text-sm font-bold text-zinc-200 group-hover:text-violet-400 transition-colors truncate">
                  {season.name}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  {season.episode_count} Episodes Published
                </p>
                <span className="text-[10px] font-semibold text-violet-400 mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Episodes →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
