"use client";

import { useEffect, useState } from "react";

import { Balance, BalanceCard } from "@/entities/balance";

import { getBalance } from "@/shared/actions/balance";

interface BalanceWidgetProps {
  refreshKey?: number;
}

const balanceCardTypes = ["total", "income", "expenses"] as const;

export function BalanceWidget({ refreshKey }: BalanceWidgetProps) {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    async function loadBalance() {
      try {
        const data = await getBalance();
        setBalance(data);
      } catch (error) {
        console.error("Failed to load balance:", error);
        setBalance(null);
      }
    }

    loadBalance();
  }, [refreshKey]);

  if (!balance) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {balanceCardTypes.map((type) => (
        <BalanceCard key={type} type={type} amount={balance[type]} />
      ))}
    </section>
  );
}
