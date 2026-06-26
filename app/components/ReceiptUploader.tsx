import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { t } from "@/app/i18n";
import { addItems } from "@/app/store/reducers/items";
import { addPayments } from "@/app/store/reducers/payments";
import type { RootState } from "@/app/store";
import type { Item, Payment } from "@/app/types";
import { MAX_IMPORTED_ITEM_TITLE_LENGTH } from "@/app/utils";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const ACCEPTED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
];
const MAX_UPLOAD_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1800;
const JPEG_QUALITY = 0.86;

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

const isAcceptedImage = (file: File) => {
  const fileName = file.name.toLowerCase();
  const hasAcceptedType = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const hasAcceptedExtension = ACCEPTED_IMAGE_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );

  return hasAcceptedType || hasAcceptedExtension;
};

const readBlobAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error(t("receipt.readImageError")));
    };

    reader.onerror = () => reject(new Error(t("receipt.readImageError")));
    reader.readAsDataURL(blob);
  });

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(t("receipt.readImageError")));
    };

    image.src = objectUrl;
  });

const getResizedDimensions = (width: number, height: number) => {
  const largestSide = Math.max(width, height);

  if (largestSide <= MAX_IMAGE_DIMENSION) return { width, height };

  const ratio = MAX_IMAGE_DIMENSION / largestSide;

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
};

const canvasToJpegBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(t("receipt.readImageError")));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

const prepareImageForUpload = async (file: File) => {
  try {
    const image = await loadImage(file);
    const { width, height } = getResizedDimensions(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error(t("receipt.readImageError"));

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const blob = await canvasToJpegBlob(canvas);

    if (blob.size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
      throw new Error(t("receipt.tooLarge"));
    }

    return readBlobAsDataUrl(blob);
  } catch (error) {
    throw new Error(getUserVisibleErrorMessage(error));
  }
};

const getUserVisibleErrorMessage = (error: unknown) => {
  const knownMessages = new Set([
    t("receipt.readImageError"),
    t("receipt.invalidType"),
    t("receipt.tooLarge"),
    t("receipt.processError"),
    t("receipt.notDetected"),
  ]);

  if (error instanceof Error && knownMessages.has(error.message)) {
    return error.message;
  }

  return t("receipt.processError");
};

const truncateItemTitle = (title: string) =>
  title.trim().slice(0, MAX_IMPORTED_ITEM_TITLE_LENGTH);

const parseJsonResponse = async (response: Response) => {
  const responseText = await response.text();

  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
};

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
      title: truncateItemTitle(item.title),
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

    if (!isAcceptedImage(file)) {
      setError(t("receipt.invalidType"));
      resetInput();
      return;
    }

    setIsLoading(true);

    try {
      const image = await prepareImageForUpload(file);
      const response = await fetch("/api/receipts/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(t("receipt.processError"));
      }

      const extraction = data as ReceiptExtraction | null;

      if (!extraction) {
        throw new Error(t("receipt.processError"));
      }

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
      setError(getUserVisibleErrorMessage(error));
    } finally {
      setIsLoading(false);
      resetInput();
    }
  };

  return (
    <section className="mt-2 mb-4 rounded border border-gray-300 bg-gray-50 p-4">
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
