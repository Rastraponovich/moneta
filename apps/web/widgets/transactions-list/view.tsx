"use client";

import { useState, useTransition } from "react";

import { EditTransactionWidget } from "@/widgets/edit-transaction";

import { Transaction, TransactionCard } from "@/entities/transaction";

import { deleteTransaction } from "@/shared/actions/transactions";
import { Button, Dialog, Surface } from "@/shared/ui";

interface TransactionsListProps {
  transactions: Transaction[];
  isPending?: boolean;
  onTransactionUpdated?: () => void;
  onTransactionDeleted?: () => void;
}

export function TransactionsList({
  transactions,
  isPending: externalIsPending = false,
  onTransactionUpdated,
  onTransactionDeleted,
}: TransactionsListProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingPending, startTransition] = useTransition();

  const isPending = externalIsPending || isDeletingPending;

  function handleDeleteClick(id: string) {
    setConfirmDeleteId(id);
  }

  function handleDeleteConfirm() {
    if (!confirmDeleteId) {
      return;
    }

    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    setDeletingId(id);

    startTransition(async () => {
      try {
        await deleteTransaction(id);
        onTransactionDeleted?.();
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        alert("Не удалось удалить транзакцию. Попробуйте еще раз.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  function handleDeleteCancel() {
    setConfirmDeleteId(null);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
  }

  function handleEditClose() {
    setEditingTransaction(null);
  }

  function handleEditSuccess() {
    setEditingTransaction(null);
    onTransactionUpdated?.();
  }

  // Защита от не-массивов
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <Surface as="section">
      <h2 className="text-xl font-semibold mb-6">Транзакции</h2>
      <div>
        {isPending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-lg">
            <p className="text-gray-600">Обновление...</p>
          </div>
        )}
        {safeTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет транзакций</p>
        ) : (
          <ul className="space-y-2" role="list">
            {safeTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                isDeleting={deletingId === transaction.id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </ul>
        )}
      </div>

      {editingTransaction && (
        <EditTransactionWidget
          onClose={handleEditClose}
          isOpen={!!editingTransaction}
          onSuccess={handleEditSuccess}
          transaction={editingTransaction}
        />
      )}

      <Dialog
        isOpen={!!confirmDeleteId}
        onClose={handleDeleteCancel}
        title="Подтверждение удаления"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя
            отменить.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDeleteConfirm}
              variant="danger"
              className="flex-1"
            >
              Удалить
            </Button>
            <Button
              onClick={handleDeleteCancel}
              variant="secondary"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Dialog>
    </Surface>
  );
}
