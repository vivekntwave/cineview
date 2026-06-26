import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate, useLocation } from "react-router";
import { tmdbService } from "../../data/tmdbService";
import { type TVShowDetail } from "../../core/tmdbSchemas";

export interface TVShowContextType {
  show: TVShowDetail;
}

export function TVShowLayout() {
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
          console.error("Error building TV profile context layer:", errorInstance);
        }
      } finally {
        setLoading(false);
      }
    }
    loadTVContext();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-violet-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  if (error404 || !show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-6xl font-black text-zinc-800">404</h1>
        <p className="mt-2 text-lg font-bold text-zinc-200">TV Show Profile Not Found</p>
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

  const isNestedSubPage = location.pathname.includes("/season/");

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="relative w-full h-[40vh] bg-zinc-900">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

        {isNestedSubPage && (
          <button
            type="button"
            onClick={() => navigate(`/tv/${show.id}`)}
            className="absolute top-6 left-6 sm:left-12 flex items-center gap-2 rounded-lg bg-black/60 border border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white backdrop-blur-md transition-colors"
          >
            ← Back to All Seasons
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start border-b border-zinc-900 pb-8">
          <div className="w-40 sm:w-50 shrink-0 mx-auto md:mx-0 aspect-2/3 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {show.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="w-full h-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-700">✕ No Artwork</div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left pt-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">{show.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 mt-3 text-xs font-semibold text-zinc-400">
              <span className="text-amber-400 font-bold">★ {show.vote_average?.toFixed(1) ?? "NR"}</span>
              <span>•</span>
              <span>{show.first_air_date?.split("-")[0]}</span>
              <span>•</span>
              <span>{show.number_of_seasons} Seasons ({show.number_of_episodes} Episodes)</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 max-w-4xl">{show.overview}</p>
          </div>
        </div>

        <div className="mt-10">
          <Outlet context={{ show } satisfies TVShowContextType} />
        </div>
      </div>
    </div>
  );
}
