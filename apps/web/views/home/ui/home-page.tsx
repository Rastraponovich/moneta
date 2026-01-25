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
      fetch("/api/transactions").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      }),
      fetch("/api/balance").then((res) => {
        if (!res.ok) throw new Error("Failed to fetch balance");
        return res.json();
      }),
    ])
      .then(([transactionsData, balanceData]) => {
        // Убеждаемся, что transactionsData - это массив
        setTransactions(
          Array.isArray(transactionsData) ? transactionsData : []
        );
        setBalance(balanceData);
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
        setTransactions([]);
        setBalance(null);
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
        {balance && <BalanceCard balance={balance} />}

        <TransactionsList transactions={transactions} />
      </div>
    </main>
  );
}
