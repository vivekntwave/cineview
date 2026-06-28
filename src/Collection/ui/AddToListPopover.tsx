import { useState, useRef, useEffect, type MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { type MediaItem } from "../../core/tmdbSchemas";
import { collectionStore } from "../core/CollectionStore";
import { getMediaType } from "../core/mediaUtils";

interface AddToListPopoverProps {
  media: MediaItem;
  variant?: "icon" | "button";
  className?: string;
  extras?: { totalEpisodes?: number };
}

export const AddToListPopover = observer(function AddToListPopover({
  media,
  variant = "icon",
  className = "",
  extras,
}: AddToListPopoverProps) {
  const { t } = useTranslation("collection");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaType = getMediaType(media);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleCheckbox = (listId: string, e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    collectionStore.toggleInList(listId, media, extras);
  };

  const inAnyList = collectionStore.isMediaInAnyList(media.id, mediaType);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {variant === "icon" ? (
        <button
          type="button"
          aria-label={t("addToList")}
          aria-expanded={open}
          onClick={handleToggle}
          className={`absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/70 text-sm backdrop-blur-md transition-colors hover:bg-violet-600 ${inAnyList ? "text-violet-400" : "text-zinc-300 hover:text-white"}`}
        >
          ☰
        </button>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          onClick={handleToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-xs font-semibold tracking-wide text-zinc-700 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          ☰ {t("addToList")}
        </button>
      )}

      {open && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-20 min-w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 ${variant === "icon" ? "right-0 bottom-10" : "left-0 mt-1 w-full"}`}
        >
          <p className="px-3 pb-2 text-[10px] font-bold tracking-wide text-zinc-400 uppercase">
            {t("addToListHeading")}
          </p>

          {collectionStore.customLists.length === 0 ? (
            <p className="px-3 py-2 text-xs text-zinc-500">{t("noListsYet")}</p>
          ) : (
            collectionStore.customLists.map((list) => {
              const checked = collectionStore.isInList(list.id, media.id, mediaType);
              return (
                <label
                  key={list.id}
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  onClick={(e) => handleCheckbox(list.id, e)}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={checked}
                    className="pointer-events-none h-3.5 w-3.5 accent-violet-600"
                  />
                  <span className="truncate">{list.name}</span>
                  <span className="ml-auto text-[10px] text-zinc-400">{list.items.length}</span>
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
});
