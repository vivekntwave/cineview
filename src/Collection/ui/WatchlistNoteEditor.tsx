import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const NOTE_LIMIT = 300;
const NOTE_WARNING_THRESHOLD = 270;

interface WatchlistNoteEditorProps {
  entryId: string;
  initialNote?: string | undefined;
  onSave: (note: string) => void;
  onClear: () => void;
}

export function WatchlistNoteEditor({
  entryId,
  initialNote = "",
  onSave,
  onClear,
}: WatchlistNoteEditorProps) {
  const { t } = useTranslation("collection");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialNote);

  useEffect(() => {
    if (!editing) {
      setDraft(initialNote);
    }
  }, [initialNote, editing, entryId]);

  const nearLimit = draft.length >= NOTE_WARNING_THRESHOLD;
  const atLimit = draft.length >= NOTE_LIMIT;

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(initialNote);
    setEditing(false);
  };

  const handleClear = () => {
    onClear();
    setDraft("");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="space-y-1">
        {initialNote ? (
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {initialNote}
          </p>
        ) : (
          <p className="text-xs text-zinc-400 italic">{t("noNote")}</p>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
        >
          {initialNote ? t("editNote") : t("addNote")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, NOTE_LIMIT))}
        placeholder={t("notePlaceholder")}
        maxLength={NOTE_LIMIT}
        rows={3}
        autoFocus
        className={`w-full resize-none rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder:text-zinc-500 ${nearLimit ? "border-amber-400 dark:border-amber-500" : "border-zinc-300 dark:border-zinc-700"}`}
      />
      <div className="flex items-center justify-between">
        <p
          className={`text-[10px] font-medium ${atLimit ? "text-red-500" : nearLimit ? "text-amber-500" : "text-zinc-400"}`}
        >
          {nearLimit && !atLimit && t("noteNearLimit")}
          {atLimit && t("noteAtLimit")}
          {!nearLimit && `${draft.length}/${NOTE_LIMIT}`}
          {nearLimit && !atLimit && ` · ${draft.length}/${NOTE_LIMIT}`}
        </p>
        <div className="flex gap-2">
          {initialNote && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-zinc-300 px-2.5 py-1 text-[10px] font-semibold text-red-600 hover:border-red-400 dark:border-zinc-700 dark:text-red-400"
            >
              {t("clearNote")}
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-zinc-300 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-violet-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-violet-500"
          >
            {t("saveNote")}
          </button>
        </div>
      </div>
    </div>
  );
}
