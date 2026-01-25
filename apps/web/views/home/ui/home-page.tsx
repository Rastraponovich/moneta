"use client";

import { useCallback, useEffect, useState } from "react";

import { Balance } from "@/entities/balance";
import { Transaction } from "@/entities/transaction";
import { AddTransactionWidget } from "@/widgets/add-transaction";
import { BalanceCard } from "@/widgets/balance-card";
import { TransactionsList } from "@/widgets/transactions-list";

export function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [transactionsRes, balanceRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/balance"),
      ]);

      if (!transactionsRes.ok) throw new Error("Failed to fetch transactions");
      if (!balanceRes.ok) throw new Error("Failed to fetch balance");

      const [transactionsData, balanceData] = await Promise.all([
        transactionsRes.json(),
        balanceRes.json(),
      ]);

      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setBalance(balanceData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setTransactions([]);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleTransactionAdded() {
    // Обновляем данные после добавления транзакции
    loadData();
  }

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

        <AddTransactionWidget onTransactionAdded={handleTransactionAdded} />

        <TransactionsList transactions={transactions} />
      </div>
    </main>
  );
}
