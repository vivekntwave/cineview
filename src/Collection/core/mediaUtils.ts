import { type MediaItem } from "../../core/tmdbSchemas";
import { type MediaSnapshot } from "./collectionSchema";

export function getMediaType(media: MediaItem): "movie" | "tv" {
  return media.title || media.release_date ? "movie" : "tv";
}

export function createSnapshot(
  media: MediaItem,
  extras?: { totalEpisodes?: number },
): MediaSnapshot {
  const mediaType = getMediaType(media);
  return {
    title: media.title || media.name || "Untitled",
    posterPath: media.poster_path ?? null,
    voteAverage: media.vote_average,
    ...(mediaType === "tv" && extras?.totalEpisodes !== undefined
      ? { totalEpisodes: extras.totalEpisodes }
      : {}),
  };
}
