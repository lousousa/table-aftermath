import { useEffect, useState } from "react";

import { t } from "@/app/i18n";

type ToastVariant = "warning" | "success" | "info";

type Props = {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
  variant?: ToastVariant;
};

const variantClasses: Record<ToastVariant, string> = {
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  success: "border-green-300 bg-green-50 text-green-900",
  info: "border-blue-300 bg-blue-50 text-blue-900",
};

export default function Toast({
  isOpen,
  message,
  onClose,
  variant = "warning",
}: Props) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return;
    }

    const timeout = window.setTimeout(() => setShouldRender(false), 200);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  if (!shouldRender || !message) return null;

  return (
    <div
      className={`fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded border px-4 py-3 shadow-lg transition-all duration-200 bottom-[15vh] ${variantClasses[variant]} ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 font-bold">{message}</p>
        <button
          aria-label={t("toast.close")}
          className="font-bold leading-none"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}
