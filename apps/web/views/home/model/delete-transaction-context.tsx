"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import { deleteTransaction } from "@/shared/actions/transactions";
import { useToast } from "@/shared/ui";

import { useTransactions } from "./transactions-context";

export interface DeleteTransactionContextValue {
  confirmDeleteId: string | null;
  deletingId: string | null;
  isDeletePending: boolean;
  requestDelete: (id: string) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

const DeleteTransactionContext = createContext<
  DeleteTransactionContextValue | undefined
>(undefined);

export function DeleteTransactionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { invalidate, removeOptimistic } = useTransactions();
  const { addToast } = useToast();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  function requestDelete(id: string) {
    setConfirmDeleteId(id);
  }

  function confirmDelete() {
    if (!confirmDeleteId) {
      return;
    }
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    removeOptimistic(id);
    setDeletingId(id);
    startDeleteTransition(async () => {
      try {
        await deleteTransaction(id);
        addToast("Транзакция удалена", "success");
        router.refresh();
        invalidate();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        addToast("Не удалось удалить транзакцию. Попробуйте еще раз.", "error");
        invalidate();
      } finally {
        setDeletingId(null);
      }
    });
  }

  function cancelDelete() {
    setConfirmDeleteId(null);
  }

  const value: DeleteTransactionContextValue = {
    confirmDeleteId,
    deletingId,
    isDeletePending,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };

  return (
    <DeleteTransactionContext.Provider value={value}>
      {children}
    </DeleteTransactionContext.Provider>
  );
}

export function useDeleteTransaction(): DeleteTransactionContextValue {
  const context = useContext(DeleteTransactionContext);
  if (context === undefined) {
    throw new Error(
      "useDeleteTransaction must be used within a DeleteTransactionProvider"
    );
  }
  return context;
}
