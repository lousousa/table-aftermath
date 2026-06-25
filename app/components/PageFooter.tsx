"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { GoogleIcon } from "@/app/icons";
import { t } from "@/app/i18n";

export default function PageFooter() {
  const { data: session, status } = useSession();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get("error");

    if (error === "AccessDenied") {
      setAuthError(t("auth.notAllowed"));
    } else if (error) {
      setAuthError(t("auth.genericError"));
    }

    if (error) {
      url.searchParams.delete("callbackUrl");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <footer className="text-center mt-4 py-4 border-gray-300 text-sm border-t-2">
      <div className="flex flex-col items-center gap-3">
        {authError && (
          <p
            className="max-w-sm rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700"
            role="alert"
          >
            {authError}
          </p>
        )}

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-2">
            {session?.user?.email && (
              <span className="text-gray-600">
                {t("auth.loggedInAs", { email: session.user.email })}
              </span>
            )}
            <button
              className="rounded border border-gray-300 px-4 py-2 font-bold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onClick={() => signOut({ callbackUrl: "/" })}
              type="button"
            >
              {t("auth.logout")}
            </button>
          </div>
        ) : (
          <button
            className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 font-bold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            type="button"
          >
            <GoogleIcon className="h-5 w-5" aria-hidden="true" />
            {t("auth.loginWithGoogle")}
          </button>
        )}

        <div>
          <span>{t("footer.developedBy")}</span>
          <a className="font-bold" href="https://github.com/lousousa">
            @lousousa
          </a>
          <span> ● v.1.1 ● 2024</span>
        </div>
      </div>
    </footer>
  );
}
