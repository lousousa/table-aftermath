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
import HistoryButton from "@/app/components/HistoryButton";

import { addPayer, clearPayers } from "@/app/store/reducers/payers";
import type { RootState } from "@/app/store";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const currentItem = useSelector(
    (state: RootState) => state.items.stagingItem,
  );
  const currentPayer = useSelector(
    (state: RootState) => state.payers.stagingPayer,
  );
  const itemsList = useSelector((state: RootState) => state.items.list);
  const dispatch = useDispatch();
  const { status } = useSession();

  const [payersCount, setPayersCount] = useState<number | "">(0);
  const skipNextPayersSetup = useRef(false);

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

  return (
    <div className={`${inter.className}`}>
      <PageHeader />

      <div className="p-4 max-w-lg mx-auto" style={{ minHeight: "80vh" }}>
        <div>
          <PayerCountInput setPayersCount={setPayersCount} />

          <HistoryButton
            setPayersCount={setPayersCount}
            onBeforeRestore={() => {
              skipNextPayersSetup.current = true;
            }}
          />

          {payersCount > 0 && (
            <div>
              <InputGrid />

              {status === "authenticated" && !itemsList.length && (
                <ReceiptUploader />
              )}

              {!currentItem && !currentPayer && (
                <div className="mt-4 flex justify-center">
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
