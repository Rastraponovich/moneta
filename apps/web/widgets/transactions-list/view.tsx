"use client";

import { useCallback } from "react";

import { DeleteTransactionButton } from "@/features/delete-transaction";

import {
  Transaction,
  type TransactionCardActionsProps,
  type TransactionCardVariant,
} from "@/entities/transaction";

import { groupTransactionsByDate } from "@/shared/lib/transaction-utils";
import { Surface, TransactionCardSkeleton } from "@/shared/ui";

import { getListClassName, useViewMode, type ViewMode } from "./lib";
import { TransactionsListEmptyState } from "./ui/empty-state";
import { TransactionGroup } from "./ui/transaction-group";
import { ViewModeToggle } from "./ui/view-mode-toggle";

const SKELETON_CARD_COUNT = 4;

interface TransactionsListProps {
  transactions: Transaction[];
  isPending?: boolean;
  onDeleteRequest?: (id: string) => void;
  onEditRequest?: (transaction: Transaction) => void;
  /** When set, cards use Link to this path + /:id/edit for edit (e.g. "/transactions") */
  editPathPrefix?: string;
  /** When list is empty and not filtered, clicking "Add first" calls this instead of navigating */
  onAddClick?: () => void;
  deletingId?: string | null;
  isDeletePending?: boolean;
  /** When true and list is empty, show "Ничего не найдено" (filtered empty state) */
  emptyFiltered?: boolean;
  /** Optional: controlled view mode */
  viewMode?: ViewMode;
  /** Optional: callback when view mode changes (e.g. to persist in parent) */
  onViewModeChange?: (mode: ViewMode) => void;
  /** Optional: when emptyFiltered, show "Сбросить фильтры" and call this */
  onResetFilters?: () => void;
  /** When false, show flat list (no date groups). Use when sorting by amount. Default true. */
  groupByDate?: boolean;
}

export function TransactionsList({
  transactions,
  isPending: externalIsPending = false,
  onDeleteRequest,
  onEditRequest,
  editPathPrefix,
  onAddClick,
  deletingId = null,
  isDeletePending = false,
  emptyFiltered = false,
  viewMode: controlledViewMode,
  onViewModeChange,
  onResetFilters,
  groupByDate = true,
}: TransactionsListProps) {
  const [viewMode, setViewMode] = useViewMode(
    controlledViewMode,
    onViewModeChange
  );

  const renderActions = useCallback(
    (props: TransactionCardActionsProps) => (
      <DeleteTransactionButton {...props} />
    ),
    []
  );

  const isPending = externalIsPending || isDeletePending;
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const groups = groupByDate
    ? groupTransactionsByDate(safeTransactions)
    : [{ label: "Все", items: safeTransactions }];

  return (
    <Surface as="section" className="rounded-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">Транзакции</h2>
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </div>

      <div className="relative min-h-[120px]">
        {isPending && safeTransactions.length > 0 && (
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl">
            <p className="text-muted text-sm">Обновление...</p>
          </div>
        )}

        {isPending && safeTransactions.length === 0 ? (
          <ul className={getListClassName(viewMode)} role="list" aria-busy>
            {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
              <TransactionCardSkeleton
                key={i}
                variant={viewMode as TransactionCardVariant}
              />
            ))}
          </ul>
        ) : safeTransactions.length === 0 ? (
          <TransactionsListEmptyState
            emptyFiltered={emptyFiltered}
            onResetFilters={onResetFilters}
            onAddClick={onAddClick}
          />
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <TransactionGroup
                key={group.label}
                group={group}
                viewMode={viewMode}
                editPathPrefix={editPathPrefix}
                onEditRequest={onEditRequest}
                onDeleteRequest={onDeleteRequest}
                deletingId={deletingId}
                renderActions={renderActions}
              />
            ))}
          </div>
        )}
      </div>
    </Surface>
  );
}
