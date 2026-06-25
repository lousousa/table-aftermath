import { useEffect, useState } from "react";

import {
  restoreSplitFromHistory,
  hasStoredSplitInHistory,
  isCurrentSplitEmpty,
} from "@/app/history";
import { HistoryIcon } from "@/app/icons";
import { t } from "@/app/i18n";

type Props = {
  setPayersCount: React.Dispatch<React.SetStateAction<number | "">>;
  onBeforeRestore: () => void;
};

export default function HistoryButton({
  setPayersCount,
  onBeforeRestore,
}: Props) {
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    setHasHistory(hasStoredSplitInHistory());

    const handleHistoryUpdated = () => setHasHistory(hasStoredSplitInHistory());
    window.addEventListener(
      "table-aftermath:history-updated",
      handleHistoryUpdated,
    );

    return () => {
      window.removeEventListener(
        "table-aftermath:history-updated",
        handleHistoryUpdated,
      );
    };
  }, []);

  const restoreHistory = () => {
    if (!hasStoredSplitInHistory()) {
      setHasHistory(false);
      window.alert(t("history.unavailable"));
      return;
    }

    if (!isCurrentSplitEmpty() && !window.confirm(t("history.confirmReplace")))
      return;

    onBeforeRestore();
    const split = restoreSplitFromHistory();

    if (!split) {
      setHasHistory(false);
      window.alert(t("history.unavailable"));
      return;
    }

    setPayersCount(split.payers.length);
  };

  if (!hasHistory) return null;

  return (
    <div className="mt-3 flex justify-end">
      <button
        className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold transition hover:bg-gray-100"
        onClick={restoreHistory}
        title={t("history.restore")}
        type="button"
      >
        <HistoryIcon className="h-5 w-5" aria-hidden="true" />
        <span>{t("history.restore")}</span>
      </button>
    </div>
  );
}
