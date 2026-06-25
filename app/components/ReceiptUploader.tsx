import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { t } from "@/app/i18n";
import { addItems } from "@/app/store/reducers/items";
import { addPayments } from "@/app/store/reducers/payments";
import type { RootState } from "@/app/store";
import type { Item, Payment } from "@/app/types";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

type ReceiptExtraction = {
  receiptDetected: boolean;
  items: Array<{
    title: string;
    price: number;
  }>;
  total: number | null;
  currency: string | null;
  sumMatchesTotal: boolean | null;
  warning: string | null;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error(t("receipt.readImageError")));
    };

    reader.onerror = () => reject(new Error(t("receipt.readImageError")));
    reader.readAsDataURL(file);
  });

export default function ReceiptUploader() {
  const payersList = useSelector((state: RootState) => state.payers.list);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    setError(null);
    setMessage(null);
    resetInput();
  }, [payersList.length]);

  const importItems = (receiptItems: ReceiptExtraction["items"]) => {
    const now = Date.now();
    const items: Item[] = receiptItems.map((item, index) => ({
      id: now + index,
      title: item.title,
      price: item.price,
    }));

    const payments: Payment[] = items.flatMap((item) =>
      payersList.map((payer) => ({
        payerId: payer.id,
        itemId: item.id,
        paid: false,
      })),
    );

    dispatch(addItems(items));
    dispatch(addPayments(payments));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setError(null);
    setMessage(null);

    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(t("receipt.invalidType"));
      resetInput();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(t("receipt.tooLarge"));
      resetInput();
      return;
    }

    setIsLoading(true);

    try {
      const image = await readFileAsDataUrl(file);
      const response = await fetch("/api/receipts/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(t("receipt.processError"));
      }

      const extraction = data as ReceiptExtraction;

      if (!extraction.receiptDetected || !extraction.items.length) {
        setError(extraction.warning ?? t("receipt.notDetected"));
        return;
      }

      importItems(extraction.items);

      const totalWarning =
        extraction.sumMatchesTotal === false ? t("receipt.totalMismatch") : "";

      setMessage(
        `${t("receipt.importedItems", { count: extraction.items.length })}${totalWarning}`,
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : t("receipt.processError"),
      );
    } finally {
      setIsLoading(false);
      resetInput();
    }
  };

  return (
    <section className="mt-4 rounded border border-gray-300 bg-gray-50 p-4">
      <h2 className="font-bold">{t("receipt.title")}</h2>
      <p className="mt-1 text-sm text-gray-600">{t("receipt.description")}</p>

      <label className="mt-3 block">
        <span className="sr-only">{t("receipt.inputLabel")}</span>
        <input
          ref={fileInputRef}
          accept={[...ACCEPTED_IMAGE_EXTENSIONS, ...ACCEPTED_IMAGE_TYPES].join(
            ",",
          )}
          className="block w-full text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-bold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
          onChange={handleFileChange}
          type="file"
        />
      </label>

      {isLoading && (
        <p className="mt-2 text-sm text-gray-600">{t("receipt.loading")}</p>
      )}

      {message && (
        <p className="mt-2 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p
          className="mt-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
