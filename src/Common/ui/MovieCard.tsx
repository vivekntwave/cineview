import { Link } from "react-router";
import { type MediaItem } from "../../core/tmdbSchemas";

interface MovieCardProps {
  media: MediaItem;
}

export function MovieCard({ media }: MovieCardProps) {
  const calculatedTitle = media.title || media.name || "Untitled Production";
  const calculatedDate = media.release_date || media.first_air_date || "";
  const displayYear = calculatedDate ? calculatedDate.split("-")[0] : "N/A";

  const posterUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
    : null;

  const routeTarget = media.title || media.release_date ? `/movie/${media.id}` : `/tv/${media.id}`;

  return (
    <Link
      to={routeTarget}
      className="group relative flex flex-col shrink-0 w-40 sm:w-50 bg-zinc-950 rounded-lg overflow-hidden ring-1 ring-white/5 hover:ring-violet-500/50 hover:scale-[1.02] transition-all duration-300 shadow-lg"
    >
      <div className="relative aspect-2/3 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={calculatedTitle}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <svg className="h-8 w-8 text-zinc-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 017 0z" />
            </svg>
            <span className="text-xs font-medium text-zinc-500 line-clamp-2">{calculatedTitle}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[11px] font-bold text-amber-400 border border-white/5">
          ★ {media.vote_average !== undefined && media.vote_average > 0 ? media.vote_average.toFixed(1) : "NR"}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 min-w-0">
        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-violet-400 transition-colors truncate">
          {calculatedTitle}
        </h3>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          {displayYear}
        </p>
      </div>
    </Link>
  );
}
