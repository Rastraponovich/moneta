"use client";

import { useEffect, useState, useTransition } from "react";

import { AddTransactionWidget } from "@/widgets/add-transaction";
import { BalanceWidget } from "@/widgets/balance-widget";
import { TransactionsList } from "@/widgets/transactions-list";

import { Transaction } from "@/entities/transaction";

import { getTransactions } from "@/shared/actions/transactions";

export function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await getTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    if (refreshTrigger === 0) {
      loadTransactions();
    } else {
      startTransition(async () => {
        await loadTransactions();
      });
    }
  }, [refreshTrigger, startTransition]);

  // Обработчики триггерят перезагрузку данных
  // Revalidation от Server Actions также обновит данные автоматически
  function handleTransactionAdded() {
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleTransactionUpdated() {
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleTransactionDeleted() {
    setRefreshTrigger((prev) => prev + 1);
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <BalanceWidget refreshKey={refreshTrigger} />

        <AddTransactionWidget onTransactionAdded={handleTransactionAdded} />

        <TransactionsList
          transactions={transactions}
          isPending={isPending}
          onTransactionUpdated={handleTransactionUpdated}
          onTransactionDeleted={handleTransactionDeleted}
        />
      </div>
    </main>
  );
}
