"use client";

import { useEffect, useState } from "react";

import { useTransactions } from "@/views/home/model";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { TransactionForm } from "@/features/add-transaction/ui/transaction-form";

import { Balance } from "@/entities/balance";

import { Dialog } from "@/shared/ui";

import { AddTransactionSection } from "./sections/add-transaction-section";
import { BalanceSection } from "./sections/balance-section";
import { TransactionsSection } from "./sections/transactions-section";

interface HomeContentProps {
  initialBalance?: Balance | null;
}

export function HomeContent({ initialBalance = null }: HomeContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invalidate } = useTransactions();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [addFormLoading, setAddFormLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setAddModalOpen(true);
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  function handleAddSuccess() {
    invalidate();
    setAddModalOpen(false);
  }

  function handleAddCancel() {
    setAddModalOpen(false);
  }

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <BalanceSection initialBalance={initialBalance} />
        <AddTransactionSection onAddClick={() => setAddModalOpen(true)} />
        <TransactionsSection
          onAddClick={() => setAddModalOpen(true)}
          initialEditId={searchParams.get("edit")}
        />
      </div>

      <Dialog
        isOpen={isAddModalOpen}
        onClose={handleAddCancel}
        title="Добавить транзакцию"
        loading={addFormLoading}
      >
        <TransactionForm
          onSuccess={handleAddSuccess}
          onCancel={handleAddCancel}
          onLoadingChange={setAddFormLoading}
        />
      </Dialog>

      {/* FAB: visible on mobile */}
      <button
        type="button"
        onClick={() => setAddModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex md:hidden size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Добавить транзакцию"
      >
        <Plus className="size-7" aria-hidden />
      </button>
    </main>
  );
}
