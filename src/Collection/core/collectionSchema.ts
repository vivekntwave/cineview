import { z } from "zod";

export const COLLECTION_STORAGE_VERSION = 1;

export const WatchlistStatusSchema = z.enum(["want_to_watch", "watching", "completed"]);

export const MediaSnapshotSchema = z.object({
  title: z.string(),
  posterPath: z.string().nullable(),
  voteAverage: z.number().optional(),
  totalEpisodes: z.number().optional(),
});

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: z.enum(["movie", "tv"]),
  status: WatchlistStatusSchema,
  note: z.string().max(300).optional(),
  snapshot: MediaSnapshotSchema,
  addedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CustomListItemSchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: z.enum(["movie", "tv"]),
  snapshot: MediaSnapshotSchema,
  addedAt: z.string().datetime(),
});

export const CustomListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(60),
  description: z.string().optional(),
  items: z.array(CustomListItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const EpisodeProgressSchema = z.object({
  showId: z.number(),
  seasonNumber: z.number(),
  episodeNumber: z.number(),
  episodeId: z.number(),
  watchedAt: z.string().datetime(),
});

export const CollectionStorageSchema = z.object({
  version: z.number(),
  watchlist: z.array(WatchlistEntrySchema),
  customLists: z.array(CustomListSchema),
  episodeProgress: z.array(EpisodeProgressSchema),
});

/** @deprecated Use CollectionStorageSchema */
export const WatchlistStorageSchema = z.object({
  entries: z.array(WatchlistEntrySchema),
});

export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>;
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>;
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>;
export type CustomListItem = z.infer<typeof CustomListItemSchema>;
export type CustomList = z.infer<typeof CustomListSchema>;
export type EpisodeProgress = z.infer<typeof EpisodeProgressSchema>;
export type CollectionStorage = z.infer<typeof CollectionStorageSchema>;
export type WatchlistStorage = z.infer<typeof WatchlistStorageSchema>;

export type WatchlistFilter = WatchlistStatus | "all";
export type WatchlistSort = "dateAdded" | "rating" | "title";
