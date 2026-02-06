"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import { Transaction } from "@/entities/transaction";

import { getTransactions } from "@/shared/actions/transactions";
import type { GetTransactionsParams } from "@/shared/actions/transactions";

export interface TransactionsContextValue {
  /** Full list from server (for lookup by id, e.g. initialEditId). */
  allTransactions: Transaction[];
  /** Display list: search result or all. */
  transactions: Transaction[];
  isPending: boolean;
  invalidate: () => void;
  removeOptimistic: (id: string) => void;
  searchTransactions: (params: GetTransactionsParams) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined
);

function isEmptyParams(params: GetTransactionsParams | undefined): boolean {
  if (!params) return true;
  const q = (params.q ?? "").trim();
  const type = params.type ?? "all";
  const sortBy = params.sortBy ?? "date-desc";
  return !q && type === "all" && sortBy === "date-desc";
}

interface TransactionsProviderProps {
  children: ReactNode;
  initialTransactions: Transaction[];
}

export function TransactionsProvider({
  children,
  initialTransactions,
}: TransactionsProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [allTransactions, setAllTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [searchResult, setSearchResult] = useState<Transaction[] | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAllTransactions(initialTransactions);
    setSearchResult(null);
    setRemovedIds(new Set());
  }, [initialTransactions]);

  const displayTransactions = (searchResult ?? allTransactions).filter(
    (t) => !removedIds.has(t.id)
  );

  function invalidate() {
    startTransition(() => {
      router.refresh();
    });
  }

  function removeOptimistic(id: string) {
    setRemovedIds((prev) => new Set(prev).add(id));
  }

  const searchTransactions = useCallback(
    async (params: GetTransactionsParams) => {
      if (isEmptyParams(params)) {
        setSearchResult(null);
        return;
      }
      const list = await getTransactions(params);
      setSearchResult(Array.isArray(list) ? list : []);
    },
    []
  );

  const value: TransactionsContextValue = {
    allTransactions,
    transactions: displayTransactions,
    isPending,
    invalidate,
    removeOptimistic,
    searchTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(): TransactionsContextValue {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
}
