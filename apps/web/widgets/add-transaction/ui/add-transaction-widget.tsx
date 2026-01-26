"use client";

import { useState } from "react";

import { AddTransactionForm } from "@/features/add-transaction";

import { Transaction } from "@/entities/transaction";

import { Button, Dialog } from "@/shared/ui";

interface AddTransactionWidgetProps {
  onTransactionAdded?: (transaction: Transaction) => void;
}

export function AddTransactionWidget({
  onTransactionAdded,
}: AddTransactionWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSuccess(transaction: Transaction) {
    setIsOpen(false);
    onTransactionAdded?.(transaction);
  }

  function handleClose() {
    if (!loading) {
      setIsOpen(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button onClick={() => setIsOpen(true)} className="w-full">
          + Добавить транзакцию
        </Button>
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Добавить транзакцию"
        loading={loading}
      >
        <AddTransactionForm
          onSuccess={handleSuccess}
          onCancel={handleClose}
          onLoadingChange={setLoading}
        />
      </Dialog>
    </>
  );
}
