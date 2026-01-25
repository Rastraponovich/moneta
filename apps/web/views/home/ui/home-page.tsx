"use client";

import { useEffect, useState } from "react";

import { Balance } from "@/entities/balance";
import { Transaction } from "@/entities/transaction";
import { BalanceCard } from "@/widgets/balance-card";
import { TransactionsList } from "@/widgets/transactions-list";

export function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/transactions").then((res) => res.json()),
      fetch("/api/balance").then((res) => res.json()),
    ])
      .then(([transactionsData, balanceData]) => {
        setTransactions(transactionsData);
        setBalance(balanceData);
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">
          Финансовый трекер
        </h1>

        {balance && <BalanceCard balance={balance} />}

        <TransactionsList transactions={transactions} />
      </div>
    </main>
  );
}
