"use client";

import { Transaction } from "@/entities/transaction";

import { TransactionForm } from "./transaction-form";

interface AddTransactionFormProps {
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function AddTransactionForm({
  onSuccess,
  onCancel,
  onLoadingChange,
}: AddTransactionFormProps) {
  return (
    <TransactionForm
      onSuccess={onSuccess}
      onCancel={onCancel}
      onLoadingChange={onLoadingChange}
    />
  );
}
