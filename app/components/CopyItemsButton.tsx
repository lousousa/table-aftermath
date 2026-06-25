import { useState } from "react";

import { saveCurrentSplitToHistory } from "@/app/history";
import { t } from "@/app/i18n";

export default function CopyItemsButton() {
  const [copyCreated, setCopyCreated] = useState(false);

  const copyItems = async () => {
    try {
      const wrappers: NodeListOf<HTMLElement> =
        document.querySelectorAll(".item-text-wrapper");
      if (!wrappers.length) return;

      const content = Array.from(wrappers).map((wrapper) => wrapper.innerText);

      await navigator.clipboard.writeText(content.join("\n"));
      saveCurrentSplitToHistory();
      window.dispatchEvent(new Event("table-aftermath:history-updated"));

      setCopyCreated(true);

      window.setTimeout(() => setCopyCreated(false), 1500);
    } catch (err) {
      console.error("failed to copy", err);
    }
  };

  return (
    <div>
      <button className="underline" onClick={() => copyItems()}>
        {t("share.copyItems")}
      </button>

      {copyCreated && (
        <span className="text-blue-300 font-bold ml-4">
          {t("share.copied")}
        </span>
      )}
    </div>
  );
}
