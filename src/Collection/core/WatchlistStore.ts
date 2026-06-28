import { makeAutoObservable, reaction } from "mobx";
import { type MediaItem } from "../../core/tmdbSchemas";
import {
  WatchlistStorageSchema,
  WatchlistEntrySchema,
  type WatchlistEntry,
  type WatchlistStatus,
  type WatchlistFilter,
  type WatchlistSort,
  type MediaSnapshot,
} from "./watchlistSchema";

const STORAGE_KEY = "cineview_watchlist";

function getMediaType(media: MediaItem): "movie" | "tv" {
  return media.title || media.release_date ? "movie" : "tv";
}

function createSnapshot(media: MediaItem): MediaSnapshot {
  return {
    title: media.title || media.name || "Untitled",
    posterPath: media.poster_path ?? null,
    voteAverage: media.vote_average,
  };
}

export class WatchlistStore {
  entries: WatchlistEntry[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();

    reaction(
      () => this.entries.map((e) => ({ ...e })),
      (entries) => {
        const payload = WatchlistStorageSchema.parse({ entries });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      },
    );
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const result = WatchlistStorageSchema.safeParse(JSON.parse(saved));
      if (result.success) {
        this.entries = result.data.entries;
      }
    } catch {
      // ignore corrupt storage
    }
  }

  get totalCount() {
    return this.entries.length;
  }

  countByStatus(status: WatchlistStatus) {
    return this.entries.filter((e) => e.status === status).length;
  }

  isInWatchlist(mediaId: number, mediaType: "movie" | "tv") {
    return this.entries.some((e) => e.mediaId === mediaId && e.mediaType === mediaType);
  }

  getEntry(mediaId: number, mediaType: "movie" | "tv") {
    return this.entries.find((e) => e.mediaId === mediaId && e.mediaType === mediaType);
  }

  getEntries(filter: WatchlistFilter, sortBy: WatchlistSort): WatchlistEntry[] {
    const filtered =
      filter === "all" ? [...this.entries] : this.entries.filter((e) => e.status === filter);

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

  add(media: MediaItem, status: WatchlistStatus = "want_to_watch") {
    const mediaType = getMediaType(media);
    if (this.isInWatchlist(media.id, mediaType)) return;

    const now = new Date().toISOString();
    const entry = WatchlistEntrySchema.parse({
      id: crypto.randomUUID(),
      mediaId: media.id,
      mediaType,
      status,
      snapshot: createSnapshot(media),
      addedAt: now,
      updatedAt: now,
    });

    this.entries.push(entry);
  }

  remove(mediaId: number, mediaType: "movie" | "tv") {
    const index = this.entries.findIndex(
      (e) => e.mediaId === mediaId && e.mediaType === mediaType,
    );
    if (index !== -1) {
      this.entries.splice(index, 1);
    }
  }

  toggle(media: MediaItem) {
    const mediaType = getMediaType(media);
    if (this.isInWatchlist(media.id, mediaType)) {
      this.remove(media.id, mediaType);
    } else {
      this.add(media, "want_to_watch");
    }
  }

  updateStatus(entryId: string, status: WatchlistStatus) {
    const entry = this.entries.find((e) => e.id === entryId);
    if (!entry) return;

    entry.status = status;
    entry.updatedAt = new Date().toISOString();
  }

  updateNote(entryId: string, note: string) {
    const trimmed = note.slice(0, 300);
    const entry = this.entries.find((e) => e.id === entryId);
    if (!entry) return;

    entry.note = trimmed || undefined;
    entry.updatedAt = new Date().toISOString();
  }
}

export const watchlistStore = new WatchlistStore();
