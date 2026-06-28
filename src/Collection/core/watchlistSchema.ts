import { z } from "zod";

export const WatchlistStatusSchema = z.enum(["want_to_watch", "watching", "completed"]);

export const MediaSnapshotSchema = z.object({
  title: z.string(),
  posterPath: z.string().nullable(),
  voteAverage: z.number().optional(),
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

export const WatchlistStorageSchema = z.object({
  entries: z.array(WatchlistEntrySchema),
});

export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>;
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>;
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>;
export type WatchlistStorage = z.infer<typeof WatchlistStorageSchema>;

export type WatchlistFilter = WatchlistStatus | "all";
export type WatchlistSort = "dateAdded" | "rating" | "title";
