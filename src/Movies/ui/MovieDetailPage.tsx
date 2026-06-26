import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { tmdbService } from "../../data/tmdbService";
import { type MovieDetail, type MediaItem, type CastMember } from "../../core/tmdbSchemas";
import { MovieCard, TrailerModal } from "../../Common/index.ts";

export function MovieDetailPage() {
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
          tmdbService.getMovieRecommendations(id)
        ]);

        setMovie(detailsData);
        setCast(creditsData.cast.slice(0, 12)); // Target the primary billing slots
        setRecommendations(recsData.results.slice(0, 8));
      } catch (err) {
        const errorInstance = err instanceof Error ? err : new Error(String(err));
        if (errorInstance?.message === "ENTITY_NOT_FOUND") {
          setError404(true);
        } else {
          console.error("Error tracking movie context profiles:", errorInstance);
        }
      } finally {
        setLoading(false);
      }
    }
    loadMovieContext();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  if (error404 || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-6xl font-black text-zinc-800">404</h1>
        <p className="mt-2 text-lg font-bold text-zinc-200">Movie Profile Not Found</p>
        <p className="mt-1 text-sm text-zinc-500 max-w-sm">The item index resource code parameters specified could not be verified.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const trailer = movie.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const trailerKey = trailer?.key || movie.videos?.results[0]?.key || null;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="relative w-full h-[45vh] md:h-[55vh] bg-zinc-900">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10 flex flex-col md:flex-row gap-8">

        <div className="w-55 sm:w-70 shrink-0 mx-auto md:mx-0">
          <div className="aspect-2/3 w-full bg-zinc-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-700">✕ No Poster</div>
            )}
          </div>

          <button
            type="button"
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors tracking-wide"
            onClick={() => console.log("Watchlist placeholder placeholder action")}
          >
            ➕ Add to Watchlist
          </button>
        </div>

        <div className="flex-1 text-center md:text-left pt-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="mt-2 text-sm sm:text-base italic text-zinc-400 font-medium">
              "{movie.tagline}"
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-xs font-semibold text-zinc-400">
            <span className="text-amber-400 flex items-center gap-1 font-bold">
              ★ {movie.vote_average?.toFixed(1) ?? "NR"}            </span>
            <span>•</span>
            <span>{movie.release_date?.split("-")[0]}</span>
            <span>•</span>
            <span>{movie.runtime ? `${movie.runtime} mins` : "N/A"}</span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-4">
            {movie.genres.map((g) => (
              <span key={g.id} className="rounded-md bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                {g.name}
              </span>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-900 pt-6">
            <h2 className="text-base font-bold text-zinc-200 tracking-wide uppercase">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400 max-w-4xl">
              {movie.overview || "No review summary details have been cataloged for this entry item."}
            </p>
          </div>

          {trailerKey && (
            <div className="mt-6 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-600/10 active:scale-95 duration-100"
              >
                🎬 Open Production Trailer
              </button>
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
          <h2 className="text-lg font-bold text-zinc-200 tracking-wide mb-6">Principal Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
            {cast.map((actor) => (
              <div key={actor.id} className="w-27.5 sm:w-33.75 shrink-0 flex flex-col items-center text-center bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-2 shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-900 ring-1 ring-white/5 mb-3">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-lg">👤</div>
                  )}
                </div>
                <p className="text-xs font-bold text-zinc-200 line-clamp-1">{actor.name}</p>
                <p className="text-[10px] font-medium text-zinc-500 line-clamp-1 mt-0.5">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16">
          <h2 className="text-lg font-bold text-zinc-200 tracking-wide mb-6">Recommended Media Rows</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
            {recommendations.map((rec) => (
              <MovieCard key={rec.id} media={rec} />
            ))}
          </div>
        </div>
      )}

      <TrailerModal
        videoKey={trailerKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
