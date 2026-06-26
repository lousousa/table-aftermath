"use client";

import { useCallback, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

import { clearDraftHistory, clearSplitHistory } from "@/app/history";

export default function AllowedGoogleEmailGuard() {
  const { data: session, status } = useSession();
  const isCheckingRef = useRef(false);

  const clearSessionAndReload = useCallback(async () => {
    clearSplitHistory();
    clearDraftHistory();

    await signOut({ redirect: false });
    window.location.reload();
  }, []);

  const verifyAllowedEmail = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.email) return;
    if (isCheckingRef.current) return;

    isCheckingRef.current = true;

    try {
      const response = await fetch("/api/auth/allowed", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data: {
        authenticated: boolean;
        allowed: boolean;
        email: string | null;
      } = await response.json();

      if (!data.authenticated || !data.allowed) {
        await clearSessionAndReload();
      }
    } catch {
      // If the check fails temporarily, keep the current session and try again
      // on the next app resume.
    } finally {
      isCheckingRef.current = false;
    }
  }, [clearSessionAndReload, session?.user?.email, status]);

  useEffect(() => {
    verifyAllowedEmail();
  }, [verifyAllowedEmail]);

  useEffect(() => {
    const handleFocus = () => verifyAllowedEmail();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifyAllowedEmail();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [verifyAllowedEmail]);

  return null;
}
