import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { collectionStore } from "../core/CollectionStore";
import { DeleteListDialog } from "./DeleteListDialog";

export const CollectionDetailPage = observer(function CollectionDetailPage() {
  const { t } = useTranslation(["collection", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const list = id ? collectionStore.getList(id) : undefined;

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!list) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-black dark:text-white">
        <h1 className="text-6xl font-black text-zinc-300 dark:text-zinc-800">404</h1>
        <p className="mt-2 text-lg font-bold text-zinc-700 dark:text-zinc-200">
          {t("collection:notFoundTitle")}
        </p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{t("collection:notFoundBody")}</p>
        <button
          type="button"
          onClick={() => navigate("/collections")}
          className="mt-6 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          {t("collection:backToLists")}
        </button>
      </div>
    );
  }

  const startRename = () => {
    setNameDraft(list.name);
    setEditingName(true);
  };

  const commitRename = () => {
    if (nameDraft.trim()) {
      collectionStore.renameList(list.id, nameDraft);
    }
    setEditingName(false);
  };

  const handleDelete = () => {
    collectionStore.deleteList(list.id);
    setDeleteOpen(false);
    navigate("/collections");
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 sm:p-8 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/collections"
          className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
        >
          ← {t("collection:backToLists")}
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {editingName ? (
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value.slice(0, 60))}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") setEditingName(false);
                }}
                autoFocus
                maxLength={60}
                className="w-full rounded-lg border border-violet-400 bg-white px-2 py-1 text-2xl font-bold text-zinc-900 dark:bg-zinc-900 dark:text-white"
              />
            ) : (
              <button
                type="button"
                onClick={startRename}
                title={t("collection:renameList")}
                className="truncate text-left text-2xl font-bold text-zinc-900 hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
              >
                {list.name}
              </button>
            )}
            {list.description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{list.description}</p>
            )}
            <p className="mt-2 text-xs font-semibold text-zinc-400">
              {t("collection:listItemCount", { count: list.items.length })}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            {t("collection:deleteList")}
          </button>
        </div>

        {list.items.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("collection:emptyListDetail")}</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {list.items.map((item) => {
              const detailPath =
                item.mediaType === "movie" ? `/movie/${item.mediaId}` : `/tv/${item.mediaId}`;
              const posterUrl = item.snapshot.posterPath
                ? `https://image.tmdb.org/t/p/w342${item.snapshot.posterPath}`
                : null;

              return (
                <div key={item.id} className="group relative">
                  <Link to={detailPath} className="block overflow-hidden rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <div className="aspect-2/3 bg-zinc-200 dark:bg-zinc-900">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={item.snapshot.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-500">
                          {item.snapshot.title}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {item.snapshot.title}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => collectionStore.removeFromList(list.id, item.id)}
                    aria-label={t("collection:remove")}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DeleteListDialog
        isOpen={deleteOpen}
        listName={list.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
});
