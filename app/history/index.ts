import { store, type RootState } from "@/app/store";
import { restoreItems, setStagingItem } from "@/app/store/reducers/items";
import { restorePayers, setStagingPayer } from "@/app/store/reducers/payers";
import { restorePayments } from "@/app/store/reducers/payments";
import type { Item, Payer, Payment, Results } from "@/app/types";

const HISTORY_STORAGE_KEY = "table-aftermath:last-shared-split";

type StoredSplit = {
  version: 1;
  savedAt: string;
  payers: Payer[];
  items: Item[];
  payments: Payment[];
  results: Results | null;
};

type DraftItem = Item & {
  isCreating: boolean;
};

type StoredDraft = {
  version: 1;
  savedAt: string;
  payersCount: number;
  payers: Payer[];
  items: Item[];
  payments: Payment[];
  results: Results | null;
  stagingPayer: Payer | null;
  stagingItem: DraftItem | null;
};

const canUseLocalStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

const isPayer = (payer: unknown): payer is Payer =>
  Boolean(payer) &&
  typeof payer === "object" &&
  typeof (payer as Payer).id === "number" &&
  typeof (payer as Payer).name === "string";

const isItem = (item: unknown): item is Item =>
  Boolean(item) &&
  typeof item === "object" &&
  typeof (item as Item).id === "number" &&
  typeof (item as Item).price === "number" &&
  (typeof (item as Item).title === "undefined" ||
    typeof (item as Item).title === "string");

const isPayment = (payment: unknown): payment is Payment =>
  Boolean(payment) &&
  typeof payment === "object" &&
  typeof (payment as Payment).payerId === "number" &&
  typeof (payment as Payment).itemId === "number" &&
  typeof (payment as Payment).paid === "boolean";

const isResults = (results: unknown): results is Results | null =>
  results === null ||
  (Boolean(results) &&
    typeof results === "object" &&
    Array.isArray((results as Results).payersData) &&
    typeof (results as Results).total === "number");

const isDraftItem = (item: unknown): item is DraftItem =>
  Boolean(item) &&
  typeof item === "object" &&
  typeof (item as DraftItem).id === "number" &&
  typeof (item as DraftItem).price === "number" &&
  typeof (item as DraftItem).isCreating === "boolean" &&
  (typeof (item as DraftItem).title === "undefined" ||
    typeof (item as DraftItem).title === "string");

const isStoredSplit = (data: unknown): data is StoredSplit =>
  Boolean(data) &&
  typeof data === "object" &&
  (data as StoredSplit).version === 1 &&
  typeof (data as StoredSplit).savedAt === "string" &&
  Array.isArray((data as StoredSplit).payers) &&
  Array.isArray((data as StoredSplit).items) &&
  Array.isArray((data as StoredSplit).payments) &&
  (data as StoredSplit).payers.every(isPayer) &&
  (data as StoredSplit).items.every(isItem) &&
  (data as StoredSplit).payments.every(isPayment) &&
  isResults((data as StoredSplit).results);

const isStoredDraft = (data: unknown): data is StoredDraft =>
  Boolean(data) &&
  typeof data === "object" &&
  (data as StoredDraft).version === 1 &&
  typeof (data as StoredDraft).savedAt === "string" &&
  typeof (data as StoredDraft).payersCount === "number" &&
  Array.isArray((data as StoredDraft).payers) &&
  Array.isArray((data as StoredDraft).items) &&
  Array.isArray((data as StoredDraft).payments) &&
  (data as StoredDraft).payers.every(isPayer) &&
  (data as StoredDraft).items.every(isItem) &&
  (data as StoredDraft).payments.every(isPayment) &&
  ((data as StoredDraft).stagingPayer === null ||
    isPayer((data as StoredDraft).stagingPayer)) &&
  ((data as StoredDraft).stagingItem === null ||
    isDraftItem((data as StoredDraft).stagingItem)) &&
  isResults((data as StoredDraft).results);

export const saveCurrentSplitToHistory = () => {
  if (!canUseLocalStorage()) return false;

  const state: RootState = store.getState();
  const split: StoredSplit = {
    version: 1,
    savedAt: new Date().toISOString(),
    payers: state.payers.list,
    items: state.items.list,
    payments: state.payments.list,
    results: state.payments.results,
  };

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(split));

  return true;
};

export const getStoredSplitFromHistory = () => {
  if (!canUseLocalStorage()) return null;

  const rawData = window.localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!rawData) return null;

  try {
    const data = JSON.parse(rawData);

    return isStoredSplit(data) ? data : null;
  } catch {
    return null;
  }
};

export const hasStoredSplitInHistory = () =>
  Boolean(getStoredSplitFromHistory());

export const clearSplitHistory = () => {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
};

export const isCurrentSplitEmpty = () => {
  const state: RootState = store.getState();

  return (
    !state.payers.list.length &&
    !state.items.list.length &&
    !state.payments.list.length &&
    !state.payments.results
  );
};

export const restoreSplitFromHistory = () => {
  const split = getStoredSplitFromHistory();

  if (!split) return null;

  store.dispatch(restorePayers(split.payers));
  store.dispatch(restoreItems(split.items));
  store.dispatch(
    restorePayments({
      list: split.payments,
      results: split.results,
    }),
  );

  return split;
};

const DRAFT_STORAGE_KEY = "table-aftermath:current-draft";

export const saveCurrentDraftToHistory = (payersCount: number) => {
  if (!canUseLocalStorage()) return false;

  const state: RootState = store.getState();
  const draft: StoredDraft = {
    version: 1,
    savedAt: new Date().toISOString(),
    payersCount,
    payers: state.payers.list,
    items: state.items.list,
    payments: state.payments.list,
    results: state.payments.results,
    stagingPayer: state.payers.stagingPayer,
    stagingItem: state.items.stagingItem,
  };

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));

  return true;
};

export const getStoredDraftFromHistory = () => {
  if (!canUseLocalStorage()) return null;

  const rawData = window.localStorage.getItem(DRAFT_STORAGE_KEY);
  if (!rawData) return null;

  try {
    const data = JSON.parse(rawData);

    return isStoredDraft(data) ? data : null;
  } catch {
    return null;
  }
};

export const clearDraftHistory = () => {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(DRAFT_STORAGE_KEY);
};

export const hasStoredDraftInHistory = () =>
  Boolean(getStoredDraftFromHistory());

export const restoreDraftFromHistory = () => {
  const draft = getStoredDraftFromHistory();

  if (!draft) return null;

  store.dispatch(restorePayers(draft.payers));
  store.dispatch(restoreItems(draft.items));
  store.dispatch(
    restorePayments({
      list: draft.payments,
      results: draft.results,
    }),
  );

  if (draft.stagingPayer) {
    store.dispatch(setStagingPayer(draft.stagingPayer));
  }

  if (draft.stagingItem) {
    store.dispatch(setStagingItem(draft.stagingItem));
  }

  return draft;
};
