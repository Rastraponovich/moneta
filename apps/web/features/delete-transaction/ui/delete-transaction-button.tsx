"use client";

import { Trash2 } from "lucide-react";

import { Transaction } from "@/entities/transaction";

import {
  formatCurrency,
  getTransactionAriaAttributes,
} from "@/shared/lib/transaction-utils";

export interface DeleteTransactionButtonProps {
  transaction: Transaction;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export function DeleteTransactionButton(props: DeleteTransactionButtonProps) {
  const { transaction, isDeleting, onDelete } = props;

  const aria = getTransactionAriaAttributes(transaction, formatCurrency);

  return (
    <div
      className="flex items-center gap-1 shrink-0"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        disabled={isDeleting}
        aria-busy={isDeleting}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onDelete(transaction.id);
        }}
        {...aria.deleteButton}
        className="size-9 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
