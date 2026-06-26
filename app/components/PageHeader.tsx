"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  clearDraftHistory,
  clearSplitHistory,
  hasStoredSplitInHistory,
  isCurrentSplitEmpty,
  restoreSplitFromHistory,
} from "@/app/history";
import { ContextMenuIcon, HistoryIcon } from "@/app/icons";
import { t } from "@/app/i18n";
import Toast from "@/app/components/Toast";

const getFirstName = (name?: string | null, email?: string | null) => {
  if (name?.trim()) return name.trim().split(/\s+/)[0];
  if (email?.trim()) return email.split("@")[0];

  return "";
};

export default function PageHeader() {
  const { data: session, status } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const firstName = getFirstName(session?.user?.name, session?.user?.email);

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");

    if (error === "AccessDenied") {
      setToastMessage(t("auth.notAllowed"));
    } else if (error) {
      setToastMessage(t("auth.genericError"));
    }

    if (error) {
      url.searchParams.delete("callbackUrl");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const clearHistoryAndNotify = () => {
    clearSplitHistory();
    clearDraftHistory();
    setHasHistory(false);
    window.dispatchEvent(new Event("table-aftermath:history-updated"));
  };

  const handleLogin = () => {
    clearHistoryAndNotify();
    setIsMenuOpen(false);
    signIn("google", { callbackUrl: "/" });
  };

  const handleLogout = () => {
    clearHistoryAndNotify();
    setIsMenuOpen(false);
    signOut({ callbackUrl: "/" });
  };

  const handleRestoreHistory = () => {
    if (!hasStoredSplitInHistory()) {
      setHasHistory(false);
      setToastMessage(t("history.unavailable"));
      return;
    }

    if (
      !isCurrentSplitEmpty() &&
      !window.confirm(t("history.confirmReplace"))
    ) {
      return;
    }

    const split = restoreSplitFromHistory();

    if (!split) {
      setHasHistory(false);
      setToastMessage(t("history.unavailable"));
      return;
    }

    window.dispatchEvent(
      new CustomEvent("table-aftermath:history-restored", {
        detail: { payersCount: split.payers.length },
      }),
    );
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gray-900">
        <div
          ref={menuRef}
          className="relative mx-auto flex max-w-lg items-center justify-between gap-x-4 p-4"
        >
          <div className="flex items-center gap-x-4">
            <Image
              src="/assets/images/icons8-pub-64.png"
              alt="logo header"
              width={64}
              height={64}
              className="w-10"
            />

            <h1 className="text-xl text-white">
              {t("app.titlePrefix")}{" "}
              <b className="italic">{t("app.titleEmphasis")}</b>
            </h1>
          </div>

          <button
            aria-label={t("menu.open")}
            className="rounded p-2 text-white transition hover:bg-gray-700"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            <ContextMenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className={`absolute right-4 text-right top-16 z-40 min-w-56 rounded border border-gray-200 bg-white py-2 text-gray-900 shadow-lg transition-all duration-200 ${
              isMenuOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {!isAuthenticated && (
              <button
                className="block w-full px-4 py-2 text-right transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                onClick={handleLogin}
                type="button"
              >
                {t("auth.login")}
              </button>
            )}

            {isAuthenticated && firstName && (
              <div className="px-4 py-2 font-bold text-gray-600">
                {t("auth.hello", { name: firstName })}
              </div>
            )}

            {hasHistory && (
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-gray-100"
                onClick={handleRestoreHistory}
                type="button"
              >
                <HistoryIcon className="h-4 w-4" aria-hidden="true" />
                {t("history.restore")}
              </button>
            )}

            {isAuthenticated && (
              <button
                className="block w-full px-4 py-2 text-right transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                onClick={handleLogout}
                type="button"
              >
                {t("auth.logout")}
              </button>
            )}
          </div>
        </div>
      </header>

      <Toast
        isOpen={Boolean(toastMessage)}
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        variant="warning"
      />
    </>
  );
}
