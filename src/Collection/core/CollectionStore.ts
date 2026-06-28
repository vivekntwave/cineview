import { makeAutoObservable, reaction } from "mobx";
import { type MediaItem } from "../../core/tmdbSchemas";
import {
  CollectionStorageSchema,
  WatchlistEntrySchema,
  CustomListSchema,
  CustomListItemSchema,
  EpisodeProgressSchema,
  WatchlistStorageSchema,
  COLLECTION_STORAGE_VERSION,
  type WatchlistEntry,
  type WatchlistStatus,
  type WatchlistFilter,
  type WatchlistSort,
  type CustomList,
} from "./collectionSchema";
import { createSnapshot, getMediaType } from "./mediaUtils";

const STORAGE_KEY = "cineview_collection";
const LEGACY_STORAGE_KEY = "cineview_watchlist";

export class CollectionStore {
  watchlist: WatchlistEntry[] = [];
  customLists: CustomList[] = [];
  episodeProgress: Array<{
    showId: number;
    seasonNumber: number;
    episodeNumber: number;
    episodeId: number;
    watchedAt: string;
  }> = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();

    reaction(
      () => ({
        watchlist: this.watchlist.map((e) => ({ ...e })),
        customLists: this.customLists.map((l) => ({
          ...l,
          items: l.items.map((i) => ({ ...i })),
        })),
        episodeProgress: this.episodeProgress.map((p) => ({ ...p })),
      }),
      (state) => {
        const payload = CollectionStorageSchema.parse({
          version: COLLECTION_STORAGE_VERSION,
          ...state,
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      },
    );
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const result = CollectionStorageSchema.safeParse(JSON.parse(saved));
        if (result.success) {
          this.watchlist = result.data.watchlist;
          this.customLists = result.data.customLists;
          this.episodeProgress = result.data.episodeProgress;
          return;
        }
      } catch {
        // fall through to legacy migration
      }
    }

    this.migrateLegacyWatchlist();
  }

  private migrateLegacyWatchlist() {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return;

    try {
      const result = WatchlistStorageSchema.safeParse(JSON.parse(legacy));
      if (result.success) {
        this.watchlist = result.data.entries;
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch {
      // ignore corrupt legacy data
    }
  }

  // ── Watchlist ──────────────────────────────────────────────

  get entries() {
    return this.watchlist;
  }

  get totalCount() {
    return this.watchlist.length;
  }

  countByStatus(status: WatchlistStatus) {
    return this.watchlist.filter((e) => e.status === status).length;
  }

  isInWatchlist(mediaId: number, mediaType: "movie" | "tv") {
    return this.watchlist.some((e) => e.mediaId === mediaId && e.mediaType === mediaType);
  }

  getEntry(mediaId: number, mediaType: "movie" | "tv") {
    return this.watchlist.find((e) => e.mediaId === mediaId && e.mediaType === mediaType);
  }

  getEntries(filter: WatchlistFilter, sortBy: WatchlistSort): WatchlistEntry[] {
    const filtered =
      filter === "all" ? [...this.watchlist] : this.watchlist.filter((e) => e.status === filter);

    switch (sortBy) {
      case "dateAdded":
        filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case "rating":
        filtered.sort(
          (a, b) => (b.snapshot.voteAverage ?? -1) - (a.snapshot.voteAverage ?? -1),
        );
        break;
      case "title":
        filtered.sort((a, b) => a.snapshot.title.localeCompare(b.snapshot.title));
        break;
    }

    return filtered;
  }

  add(
    media: MediaItem,
    status: WatchlistStatus = "want_to_watch",
    extras?: { totalEpisodes?: number },
  ) {
    const mediaType = getMediaType(media);
    if (this.isInWatchlist(media.id, mediaType)) return;

    const now = new Date().toISOString();
    const entry = WatchlistEntrySchema.parse({
      id: crypto.randomUUID(),
      mediaId: media.id,
      mediaType,
      status,
      snapshot: createSnapshot(media, extras),
      addedAt: now,
      updatedAt: now,
    });

    this.watchlist.push(entry);
  }

  remove(mediaId: number, mediaType: "movie" | "tv") {
    const index = this.watchlist.findIndex(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType,
    );
    if (index !== -1) {
      this.watchlist.splice(index, 1);
    }

    if (mediaType === "tv") {
      this.removeEpisodeProgressForShow(mediaId);
    }
  }

  toggle(media: MediaItem, extras?: { totalEpisodes?: number }) {
    const mediaType = getMediaType(media);
    if (this.isInWatchlist(media.id, mediaType)) {
      this.remove(media.id, mediaType);
    } else {
      this.add(media, "want_to_watch", extras);
    }
  }

  updateStatus(entryId: string, status: WatchlistStatus) {
    const entry = this.watchlist.find((e) => e.id === entryId);
    if (!entry) return;

    entry.status = status;
    entry.updatedAt = new Date().toISOString();
  }

  updateNote(entryId: string, note: string) {
    const trimmed = note.slice(0, 300);
    const entry = this.watchlist.find((e) => e.id === entryId);
    if (!entry) return;

    entry.note = trimmed || undefined;
    entry.updatedAt = new Date().toISOString();
  }

  clearNote(entryId: string) {
    const entry = this.watchlist.find((e) => e.id === entryId);
    if (!entry) return;

    entry.note = undefined;
    entry.updatedAt = new Date().toISOString();
  }

  // ── Custom Lists ─────────────────────────────────────────────

  getList(listId: string) {
    return this.customLists.find((l) => l.id === listId);
  }

  createList(name: string, description?: string) {
    const trimmedName = name.trim().slice(0, 60);
    if (!trimmedName) return null;

    const now = new Date().toISOString();
    const list = CustomListSchema.parse({
      id: crypto.randomUUID(),
      name: trimmedName,
      description: description?.trim() || undefined,
      items: [],
      createdAt: now,
      updatedAt: now,
    });

    this.customLists.push(list);
    return list;
  }

  renameList(listId: string, name: string) {
    const list = this.getList(listId);
    if (!list) return;

    const trimmedName = name.trim().slice(0, 60);
    if (!trimmedName) return;

    list.name = trimmedName;
    list.updatedAt = new Date().toISOString();
  }

  updateListDescription(listId: string, description: string) {
    const list = this.getList(listId);
    if (!list) return;

    list.description = description.trim() || undefined;
    list.updatedAt = new Date().toISOString();
  }

  deleteList(listId: string) {
    const index = this.customLists.findIndex((l) => l.id === listId);
    if (index !== -1) {
      this.customLists.splice(index, 1);
    }
  }

  isInList(listId: string, mediaId: number, mediaType: "movie" | "tv") {
    const list = this.getList(listId);
    if (!list) return false;
    return list.items.some((i) => i.mediaId === mediaId && i.mediaType === mediaType);
  }

  addToList(listId: string, media: MediaItem, extras?: { totalEpisodes?: number }) {
    const list = this.getList(listId);
    if (!list) return;

    const mediaType = getMediaType(media);
    if (this.isInList(listId, media.id, mediaType)) return;

    const item = CustomListItemSchema.parse({
      id: crypto.randomUUID(),
      mediaId: media.id,
      mediaType,
      snapshot: createSnapshot(media, extras),
      addedAt: new Date().toISOString(),
    });

    list.items.push(item);
    list.updatedAt = new Date().toISOString();
  }

  removeFromList(listId: string, itemId: string) {
    const list = this.getList(listId);
    if (!list) return;

    const index = list.items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      list.items.splice(index, 1);
      list.updatedAt = new Date().toISOString();
    }
  }

  toggleInList(listId: string, media: MediaItem, extras?: { totalEpisodes?: number }) {
    const list = this.getList(listId);
    if (!list) return;

    const mediaType = getMediaType(media);
    const existing = list.items.find(
      (i) => i.mediaId === media.id && i.mediaType === mediaType,
    );

    if (existing) {
      this.removeFromList(listId, existing.id);
    } else {
      this.addToList(listId, media, extras);
    }
  }

  isMediaInAnyList(mediaId: number, mediaType: "movie" | "tv") {
    return this.customLists.some((l) =>
      l.items.some((i) => i.mediaId === mediaId && i.mediaType === mediaType),
    );
  }

  // ── Episode Progress ─────────────────────────────────────────

  isEpisodeWatched(showId: number, seasonNumber: number, episodeNumber: number) {
    return this.episodeProgress.some(
      (p) =>
        p.showId === showId &&
        p.seasonNumber === seasonNumber &&
        p.episodeNumber === episodeNumber,
    );
  }

  toggleEpisodeWatched(
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
    episodeId: number,
  ) {
    const index = this.episodeProgress.findIndex(
      (p) =>
        p.showId === showId &&
        p.seasonNumber === seasonNumber &&
        p.episodeNumber === episodeNumber,
    );

    if (index !== -1) {
      this.episodeProgress.splice(index, 1);
    } else {
      const progress = EpisodeProgressSchema.parse({
        showId,
        seasonNumber,
        episodeNumber,
        episodeId,
        watchedAt: new Date().toISOString(),
      });
      this.episodeProgress.push(progress);
    }
  }

  markSeasonWatched(
    showId: number,
    seasonNumber: number,
    episodes: Array<{ episodeNumber: number; episodeId: number }>,
  ) {
    const now = new Date().toISOString();
    for (const ep of episodes) {
      if (!this.isEpisodeWatched(showId, seasonNumber, ep.episodeNumber)) {
        this.episodeProgress.push(
          EpisodeProgressSchema.parse({
            showId,
            seasonNumber,
            episodeNumber: ep.episodeNumber,
            episodeId: ep.episodeId,
            watchedAt: now,
          }),
        );
      }
    }
  }

  unmarkSeasonWatched(showId: number, seasonNumber: number) {
    this.episodeProgress = this.episodeProgress.filter(
      (p) => !(p.showId === showId && p.seasonNumber === seasonNumber),
    );
  }

  getSeasonProgress(showId: number, seasonNumber: number, totalEpisodes: number) {
    const watched = this.episodeProgress.filter(
      (p) => p.showId === showId && p.seasonNumber === seasonNumber,
    ).length;
    return { watched, total: totalEpisodes };
  }

  getShowProgress(
    showId: number,
    seasons: Array<{ seasonNumber: number; episodeCount: number }>,
  ) {
    const total = seasons.reduce((sum, s) => sum + s.episodeCount, 0);
    const watched = this.episodeProgress.filter((p) => p.showId === showId).length;
    return { watched, total };
  }

  getShowWatchedCount(showId: number) {
    return this.episodeProgress.filter((p) => p.showId === showId).length;
  }

  removeEpisodeProgressForShow(showId: number) {
    this.episodeProgress = this.episodeProgress.filter((p) => p.showId !== showId);
  }
}

export const collectionStore = new CollectionStore();

/** @deprecated Use collectionStore */
export const watchlistStore = collectionStore;
