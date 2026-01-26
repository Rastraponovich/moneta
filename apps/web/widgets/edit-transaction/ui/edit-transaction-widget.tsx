"use client";

import { useState } from "react";

import { TransactionForm } from "@/features/add-transaction/ui/transaction-form";

import { Transaction } from "@/entities/transaction";

import { Dialog } from "@/shared/ui";

interface EditTransactionWidgetProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: Transaction) => void;
}

export function EditTransactionWidget({
  transaction,
  isOpen,
  onClose,
  onSuccess,
}: EditTransactionWidgetProps) {
  const [loading, setLoading] = useState(false);

  function handleSuccess(updatedTransaction: Transaction) {
    onClose();
    onSuccess?.(updatedTransaction);
  }

  function handleClose() {
    if (!loading) {
      onClose();
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Редактировать транзакцию"
      loading={loading}
    >
      <TransactionForm
        initialTransaction={transaction}
        onSuccess={handleSuccess}
        onCancel={handleClose}
        onLoadingChange={setLoading}
      />
    </Dialog>
  );
}
