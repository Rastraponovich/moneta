"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";

interface TransactionsListEmptyStateProps {
  emptyFiltered: boolean;
  onResetFilters?: () => void;
  onAddClick?: () => void;
}

export function TransactionsListEmptyState({
  emptyFiltered,
  onResetFilters,
  onAddClick,
}: TransactionsListEmptyStateProps) {
  const buttonClass =
    "font-medium rounded-xl min-h-[44px] px-4 py-2 text-base inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="rounded-full bg-muted/20 p-5 mb-4">
        <Wallet className="size-12 text-muted" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {emptyFiltered ? "Ничего не найдено" : "Пока нет операций"}
      </h3>
      <p className="text-muted text-sm mb-6 max-w-[280px]">
        {emptyFiltered
          ? "Попробуйте изменить фильтры или поисковый запрос."
          : "Добавьте первую транзакцию, чтобы начать учёт доходов и расходов."}
      </p>
      {emptyFiltered && onResetFilters ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className={`${buttonClass} bg-border text-foreground hover:bg-muted/30 focus-visible:ring-offset-2`}
          >
            Сбросить фильтры
          </button>
        </div>
      ) : null}
      {!emptyFiltered &&
        (onAddClick ? (
          <button
            type="button"
            onClick={onAddClick}
            className={`${buttonClass} bg-primary text-white hover:bg-primary-hover focus-visible:ring-offset-2`}
          >
            Добавить первую транзакцию
          </button>
        ) : (
          <Link
            href="/transactions/new"
            className={`${buttonClass} bg-primary text-white hover:bg-primary-hover focus-visible:ring-offset-2`}
          >
            Добавить первую транзакцию
          </Link>
        ))}
    </div>
  );
}
