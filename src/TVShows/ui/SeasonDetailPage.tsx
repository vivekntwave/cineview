import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import { tmdbService } from "../../data/tmdbService";
import { type SeasonDetail } from "../../core/tmdbSchemas";
import { type TVShowContextType } from "./TVShowLayout";

export function SeasonDetailPage() {
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
        console.error("Error retrieving season roster metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSeasonRoster();
  }, [seasonNumber, show.id]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-violet-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  if (!season || season.episodes.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-zinc-500 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-900">
        No descriptive episode listings cataloged for this layout index.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-900 pb-4">
        <h2 className="text-xl font-bold tracking-wide text-zinc-100">{season.name}</h2>
        {season.overview && <p className="text-xs text-zinc-400 mt-2 max-w-4xl leading-relaxed">{season.overview}</p>}
      </div>

      {/* Episode Feed Roster List */}
      <div className="space-y-4">
        {season.episodes.map((episode) => {
          const thumbnail = episode.still_path
            ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
            : null;

          return (
            <div
              key={episode.id}
              className="flex flex-col sm:flex-row gap-4 bg-zinc-950/30 border border-zinc-900/60 rounded-xl p-4 hover:bg-zinc-950/60 transition-colors"
            >
              <div className="w-full sm:w-40 aspect-video bg-zinc-900 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/5 relative">
                {thumbnail ? (
                  <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-700">No Preview</div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider text-zinc-400 border border-white/5">
                  EP {episode.episode_number}
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-bold text-zinc-100 truncate">{episode.name}</h3>

                    <label
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-zinc-500 cursor-pointer select-none hover:text-zinc-400"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Episode tracker bookmark placeholder active action triggered.");
                      }}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={false}
                        className="h-3.5 w-3.5 rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-0 focus:ring-offset-0 pointer-events-none accent-violet-600"
                      />
                      <span>Watched</span>
                    </label>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mt-1.5 line-clamp-2 sm:line-clamp-3">
                    {episode.overview || "No review summary summary description has been cataloged for this episode item."}
                  </p>
                </div>

                {episode.air_date && (
                  <p className="text-[10px] text-zinc-500 font-semibold mt-2">
                    Air Date: {new Date(episode.air_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
