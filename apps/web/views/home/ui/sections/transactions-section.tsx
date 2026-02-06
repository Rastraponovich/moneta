"use client";

import { useEffect, useState } from "react";

import { useDeleteTransaction, useTransactions } from "@/views/home/model";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { TransactionsList } from "@/widgets/transactions-list";

import { TransactionForm } from "@/features/add-transaction/ui/transaction-form";

import { Transaction } from "@/entities/transaction";

import { Dialog } from "@/shared/ui";

const DeleteTransactionDialog = dynamic(
  () =>
    import("@/widgets/delete-transaction-dialog").then((m) => ({
      default: m.DeleteTransactionDialog,
    })),
  { ssr: false, loading: () => null }
);

const SEARCH_DEBOUNCE_MS = 300;

type TypeFilter = "all" | "income" | "expense";
type SortBy = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

interface TransactionsSectionProps {
  onAddClick?: () => void;
  /** When set (e.g. from URL ?edit=id), open edit modal for this transaction */
  initialEditId?: string | null;
}

export function TransactionsSection({
  onAddClick,
  initialEditId,
}: TransactionsSectionProps) {
  const router = useRouter();
  const {
    allTransactions,
    transactions,
    isPending,
    invalidate,
    searchTransactions,
  } = useTransactions();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editFormLoading, setEditFormLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    searchTransactions({
      q: debouncedSearchQuery.trim(),
      type: typeFilter,
      sortBy,
    });
  }, [debouncedSearchQuery, typeFilter, sortBy, searchTransactions]);

  const {
    requestDelete,
    confirmDelete,
    cancelDelete,
    deletingId,
    isDeletePending,
    confirmDeleteId,
  } = useDeleteTransaction();

  useEffect(() => {
    if (!initialEditId || allTransactions.length === 0) {
      return;
    }
    const found = allTransactions.find((t) => t.id === initialEditId);
    if (found) {
      setEditingTransaction(found);
      router.replace("/", { scroll: false });
    }
  }, [initialEditId, allTransactions, router]);

  return (
    <>
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "income", "expense"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTypeFilter(value)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                typeFilter === value
                  ? "bg-primary text-white"
                  : "bg-border text-foreground hover:bg-muted/30"
              }`}
            >
              {value === "all"
                ? "Все"
                : value === "income"
                  ? "Доходы"
                  : "Расходы"}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Поиск по описанию или категории..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] text-sm"
              aria-label="Поиск транзакций"
            />
          </div>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="rounded-xl border border-border bg-surface text-foreground px-4 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Сортировка"
          >
            <option value="date-desc">По дате (сначала новые)</option>
            <option value="date-asc">По дате (сначала старые)</option>
            <option value="amount-desc">По сумме (убыв.)</option>
            <option value="amount-asc">По сумме (возр.)</option>
          </select>
        </div>
      </div>

      <TransactionsList
        transactions={transactions}
        isPending={isPending}
        onDeleteRequest={requestDelete}
        onEditRequest={(t) => setEditingTransaction(t)}
        onAddClick={onAddClick}
        deletingId={deletingId}
        isDeletePending={isDeletePending}
        emptyFiltered={searchQuery.trim() !== "" || typeFilter !== "all"}
        onResetFilters={() => {
          setTypeFilter("all");
          setSearchQuery("");
          searchTransactions({});
        }}
        groupByDate={sortBy === "date-desc" || sortBy === "date-asc"}
      />

      {editingTransaction !== null && (
        <Dialog
          isOpen
          onClose={() => setEditingTransaction(null)}
          title="Редактировать транзакцию"
          loading={editFormLoading}
        >
          <TransactionForm
            initialTransaction={editingTransaction}
            onSuccess={() => {
              invalidate();
              setEditingTransaction(null);
            }}
            onCancel={() => setEditingTransaction(null)}
            onLoadingChange={setEditFormLoading}
          />
        </Dialog>
      )}

      {confirmDeleteId !== null && (
        <DeleteTransactionDialog
          isOpen
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isPending={isDeletePending}
        />
      )}
    </>
  );
}
