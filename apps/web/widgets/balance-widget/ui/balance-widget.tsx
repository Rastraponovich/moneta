"use client";

import { Balance, BalanceCard } from "@/entities/balance";

interface BalanceWidgetProps {
  initialBalance?: Balance | null;
  isUpdating?: boolean;
}

const balanceCardTypes = ["total", "income", "expenses"] as const;

const emptyBalance: Balance = {
  total: 0,
  income: 0,
  expenses: 0,
  period: { start: "", end: "" },
};

export function BalanceWidget({
  initialBalance = null,
  isUpdating = false,
}: BalanceWidgetProps) {
  const displayBalance = initialBalance ?? emptyBalance;

  return (
    <section className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {balanceCardTypes.map((type) => (
        <BalanceCard key={type} type={type} amount={displayBalance[type]} />
      ))}
      {isUpdating && (
        <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
          <p className="text-muted text-sm">Обновление...</p>
        </div>
      )}
    </section>
  );
}
