"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

import PageHeader from "@/app/components/PageHeader";
import PageFooter from "@/app/components/PageFooter";
import PayerCountInput from "@/app/components/PayersCountInput";
import InputGrid from "@/app/components/InputGrid";
import AddItemButton from "@/app/components/AddItemButton";
import SaveItemForm from "@/app/components/SaveItemForm";
import ReceiptUploader from "@/app/components/ReceiptUploader";
import ResultsSection from "@/app/components/ResultsSection";

import {
  clearDraftHistory,
  getStoredDraftFromHistory,
  restoreDraftFromHistory,
  saveCurrentDraftToHistory,
} from "@/app/history";
import { addPayer, clearPayers } from "@/app/store/reducers/payers";
import type { RootState } from "@/app/store";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const payersList = useSelector((state: RootState) => state.payers.list);
  const currentPayer = useSelector(
    (state: RootState) => state.payers.stagingPayer,
  );
  const currentItem = useSelector(
    (state: RootState) => state.items.stagingItem,
  );
  const itemsList = useSelector((state: RootState) => state.items.list);
  const paymentsList = useSelector((state: RootState) => state.payments.list);
  const currentResults = useSelector(
    (state: RootState) => state.payments.results,
  );
  const dispatch = useDispatch();
  const { status } = useSession();

  const [payersCount, setPayersCount] = useState<number | "">(0);
  const [hasBootstrappedDraft, setHasBootstrappedDraft] = useState(false);
  const skipNextPayersSetup = useRef(false);

  useEffect(() => {
    const draft = getStoredDraftFromHistory();

    if (draft) {
      skipNextPayersSetup.current = true;
      setPayersCount(draft.payersCount);
      restoreDraftFromHistory();
    }

    setHasBootstrappedDraft(true);
  }, []);

  useEffect(() => {
    const handleHistoryRestored = (event: Event) => {
      const { payersCount } = (event as CustomEvent<{ payersCount: number }>)
        .detail;

      skipNextPayersSetup.current = true;
      setPayersCount(payersCount);
    };

    window.addEventListener(
      "table-aftermath:history-restored",
      handleHistoryRestored,
    );

    return () => {
      window.removeEventListener(
        "table-aftermath:history-restored",
        handleHistoryRestored,
      );
    };
  }, []);

  useEffect(() => {
    if (!payersCount) return;

    if (skipNextPayersSetup.current) {
      skipNextPayersSetup.current = false;
      return;
    }

    dispatch(clearPayers());

    for (let i = 0; i < Math.min(payersCount, 10); i++) {
      dispatch(
        addPayer({
          id: i + 1,
          name: String.fromCharCode(65 + i),
        }),
      );
    }
  }, [dispatch, payersCount]);

  useEffect(() => {
    if (!hasBootstrappedDraft) return;

    const hasDraftContent =
      Boolean(payersCount) ||
      Boolean(payersList.length) ||
      Boolean(itemsList.length) ||
      Boolean(paymentsList.length) ||
      Boolean(currentPayer) ||
      Boolean(currentItem) ||
      Boolean(currentResults);

    if (!hasDraftContent) {
      clearDraftHistory();
      return;
    }

    const persistDraft = () => {
      const effectivePayersCount = payersCount || payersList.length;
      saveCurrentDraftToHistory(effectivePayersCount);
    };

    persistDraft();

    const handlePageHide = () => persistDraft();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistDraft();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    currentItem,
    currentPayer,
    currentResults,
    hasBootstrappedDraft,
    itemsList,
    payersCount,
    payersList,
    paymentsList,
  ]);

  return (
    <div className={`${inter.className}`}>
      <PageHeader />

      <div className="p-4 max-w-lg mx-auto" style={{ minHeight: "83vh" }}>
        <div>
          <PayerCountInput setPayersCount={setPayersCount} />

          {payersCount > 0 && (
            <div>
              <InputGrid />

              {status === "authenticated" && !itemsList.length && (
                <ReceiptUploader />
              )}

              {!currentItem && !currentPayer && (
                <div className="mt-2 flex justify-center">
                  <AddItemButton />
                </div>
              )}

              {currentItem && <SaveItemForm />}
            </div>
          )}
        </div>

        <ResultsSection />
      </div>

      <PageFooter />
    </div>
  );
}
