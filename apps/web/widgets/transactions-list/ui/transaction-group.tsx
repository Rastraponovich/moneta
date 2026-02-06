"use client";

import type { ReactNode } from "react";

import {
  Transaction,
  TransactionCard,
  type TransactionCardActionsProps,
  type TransactionCardVariant,
} from "@/entities/transaction";

import { formatCurrency, getDaySummary } from "@/shared/lib/transaction-utils";

import { getListClassName } from "../lib";

interface TransactionGroupProps {
  group: { label: string; items: Transaction[] };
  viewMode: TransactionCardVariant;
  editPathPrefix?: string;
  onEditRequest?: (t: Transaction) => void;
  onDeleteRequest?: (id: string) => void;
  deletingId?: string | null;
  renderActions: (props: TransactionCardActionsProps) => ReactNode;
}

export function TransactionGroup({
  group,
  viewMode,
  editPathPrefix,
  onEditRequest,
  onDeleteRequest,
  deletingId = null,
  renderActions,
}: TransactionGroupProps) {
  const summary = getDaySummary(group.items);
  const hasSummary = summary.income > 0 || summary.expense > 0;
  const listClassName = getListClassName(viewMode);

  const listContent = group.items.map((transaction) => (
    <TransactionCard
      key={transaction.id}
      transaction={transaction}
      variant={viewMode}
      isDeleting={deletingId === transaction.id}
      onEdit={editPathPrefix ? undefined : onEditRequest}
      editHref={
        editPathPrefix ? `${editPathPrefix}/${transaction.id}/edit` : undefined
      }
      onDelete={() => onDeleteRequest?.(transaction.id)}
      renderActions={renderActions}
    />
  ));

  const list = (
    <ul className={listClassName} role="list">
      {listContent}
    </ul>
  );

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3 sticky top-0 bg-surface py-1.5 -mx-1 px-1 z-1">
        <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
        {hasSummary && (
          <span className="text-xs text-muted">
            +{formatCurrency(summary.income)} / −
            {formatCurrency(summary.expense)}
          </span>
        )}
      </div>
      {viewMode === "timeline" ? (
        <div className="relative pl-0">{list}</div>
      ) : (
        list
      )}
    </div>
  );
}
