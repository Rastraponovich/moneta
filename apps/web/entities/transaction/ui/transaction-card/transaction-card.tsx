"use client";

import { Trash2 } from "lucide-react";

import { Transaction } from "@/entities/transaction";

import { cx } from "@/shared/lib/cx";
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getTransactionAriaAttributes,
} from "@/shared/lib/transaction-utils";

interface TransactionCardProps {
  transaction: Transaction;
  isDeleting: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionCard(props: TransactionCardProps) {
  const { transaction, isDeleting, onEdit, onDelete } = props;

  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === "income";
  const aria = getTransactionAriaAttributes(transaction, formatCurrency);

  function handleCardKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEdit(transaction);
    }
  }

  return (
    <li>
      <article
        tabIndex={0}
        role="button"
        onKeyDown={handleCardKeyDown}
        onClick={() => onEdit(transaction)}
        {...aria.article}
        className={cx(
          "group relative flex items-start sm:items-center gap-3 sm:gap-4 pl-0 rounded-full bg-white border border-gray-100 transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          isIncome
            ? "hover:ring-2 hover:ring-green-500"
            : "hover:ring-2 hover:ring-red-500"
        )}
      >
        <div
          aria-hidden="true"
          className={cx(
            "flex items-center justify-center size-10 sm:size-14 rounded-full shrink-0",
            isIncome ? "bg-green-500" : "bg-red-500"
          )}
        >
          <div className="p-1 sm:p-2">
            <Icon
              aria-hidden="true"
              className="size-4 sm:size-6 text-white shrink-0"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col sm:block">
          <p
            id={aria.ids.amount}
            className={cx(
              "text-base sm:text-lg font-bold",
              isIncome ? "text-green-600" : "text-red-600"
            )}
            {...aria.amount}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="flex items-start sm:items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-right flex flex-col gap-1 max-sm:flex-col-reverse">
            <p
              id={aria.ids.description}
              className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2"
            >
              {transaction.description}
            </p>
            <div className="flex items-center gap-2 justify-end">
              <span
                id={aria.ids.category}
                className="text-xs sm:text-sm text-gray-500"
              >
                {transaction.category}
              </span>
              <span
                aria-hidden="true"
                className="text-gray-300 hidden sm:inline"
              >
                •
              </span>
              <time
                id={aria.ids.date}
                dateTime={transaction.date}
                className="text-xs sm:text-sm text-gray-500 hidden sm:inline"
              >
                {formatDate(transaction.date)}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={isDeleting}
              aria-busy={isDeleting}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(transaction.id);
              }}
              {...aria.deleteButton}
              className="size-10 sm:size-14 rounded-full shrink-0 bg-red-400 hover:bg-red-500 transition-colors disabled:opacity-50 touch-manipulation flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            >
              <div className="p-1 sm:p-2">
                <Trash2
                  aria-hidden="true"
                  className="size-4 sm:size-6 text-white shrink-0"
                />
              </div>
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}
