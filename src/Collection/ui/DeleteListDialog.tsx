import { useTranslation } from "react-i18next";

interface DeleteListDialogProps {
  isOpen: boolean;
  listName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteListDialog({ isOpen, listName, onConfirm, onCancel }: DeleteListDialogProps) {
  const { t } = useTranslation("collection");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-list-title"
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 id="delete-list-title" className="text-lg font-bold text-zinc-900 dark:text-white">
          {t("deleteListTitle")}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t("deleteListBody", { name: listName })}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            {t("deleteListConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
