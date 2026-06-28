import { useTranslation } from "react-i18next";

export function CollectionDetailPage() {
  const { t } = useTranslation("collection");

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900 dark:bg-black dark:text-white">
      <h1 className="text-2xl font-bold">{t("collectionDetailTitle")}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("collectionDetailBody")}</p>
    </div>
  );
}
