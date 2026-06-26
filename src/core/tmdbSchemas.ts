import { z } from "zod";

export const MediaItemSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  overview: z.string().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  media_type: z.enum(["movie", "tv", "person"]).optional(),
  genre_ids: z.array(z.number()).optional(),
  origin_country: z.array(z.string()).optional(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
});

export const PaginatedResponseSchema = z.object({
  page: z.number(),
  results: z.array(MediaItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const GenreListResponseSchema = z.object({
  genres: z.array(GenreSchema),
});

export const VideoItemSchema = z.object({
  id: z.string(),
  key: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
});

export const VideoResponseSchema = z.object({
  results: z.array(VideoItemSchema),
});

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
});

export const CreditsResponseSchema = z.object({
  cast: z.array(CastMemberSchema),
});

export const MovieDetailSchema = MediaItemSchema.extend({
  genres: z.array(GenreSchema),
  runtime: z.number().nullable(),
  tagline: z.string().nullable(),
  videos: z.object({ results: z.array(VideoItemSchema) }).optional(),
});

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  episode_number: z.number(),
  overview: z.string(),
  still_path: z.string().nullable(),
  air_date: z.string().nullable(),
});

export const SeasonItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episode_count: z.number(),
  poster_path: z.string().nullable(),
});

export const TVShowDetailSchema = MediaItemSchema.extend({
  genres: z.array(GenreSchema),
  number_of_seasons: z.number(),
  number_of_episodes: z.number(),
  seasons: z.array(SeasonItemSchema),
});

export const SeasonDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  episodes: z.array(EpisodeSchema),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
export type MovieDetail = z.infer<typeof MovieDetailSchema>;
export type TVShowDetail = z.infer<typeof TVShowDetailSchema>;
export type SeasonDetail = z.infer<typeof SeasonDetailSchema>;
export type Genre = z.infer<typeof GenreSchema>;
export type CastMember = z.infer<typeof CastMemberSchema>;
