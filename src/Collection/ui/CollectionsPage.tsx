import { useState } from "react";
import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { collectionStore } from "../core/CollectionStore";
import { CreateListModal } from "./CreateListModal";

export const CollectionsPage = observer(function CollectionsPage() {
  const { t } = useTranslation("collection");
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (name: string, description?: string) => {
    collectionStore.createList(name, description);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 text-zinc-900 sm:p-8 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t("myListsTitle")}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("myListsBody")}</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            + {t("createList")}
          </button>
        </div>

        {collectionStore.customLists.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
            <p className="text-4xl">📋</p>
            <p className="mt-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {t("emptyListsTitle")}
            </p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              {t("emptyListsBody")}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              + {t("createList")}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collectionStore.customLists.map((list) => {
              const previewPosters = list.items
                .slice(0, 4)
                .map((item) => item.snapshot.posterPath)
                .filter(Boolean);

              return (
                <Link
                  key={list.id}
                  to={`/collection/${list.id}`}
                  className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-violet-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-500/30"
                >
                  <div className="flex gap-1 overflow-hidden rounded-lg">
                    {previewPosters.length > 0 ? (
                      previewPosters.map((poster, i) => (
                        <div
                          key={i}
                          className="aspect-2/3 flex-1 overflow-hidden bg-zinc-200 dark:bg-zinc-900"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w154${poster}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-900">
                        📋
                      </div>
                    )}
                  </div>

                  <h2 className="mt-3 truncate text-base font-bold text-zinc-900 group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
                    {list.name}
                  </h2>
                  {list.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {list.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-semibold text-zinc-400">
                    {t("listItemCount", { count: list.items.length })}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <CreateListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
});
