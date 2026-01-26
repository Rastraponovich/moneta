"use client";

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { cx } from "@/shared/lib/cx";
import { formatCurrency } from "@/shared/lib/transaction-utils";
import { Surface } from "@/shared/ui";

type BalanceCardType = "total" | "income" | "expenses";

const balanceCardConfig = {
  total: {
    title: "Баланс",
    icon: Wallet,
    textColor: "text-blue-50",
    gradient: "from-blue-400 via-blue-500 to-blue-600",
  },
  income: {
    title: "Доходы",
    icon: TrendingUp,
    textColor: "text-green-50",
    gradient: "from-emerald-400 via-green-500 to-green-600",
  },
  expenses: {
    title: "Расходы",
    icon: TrendingDown,
    textColor: "text-red-50",
    gradient: "from-orange-500 via-red-500 to-red-600",
  },
} as const;

interface BalanceCardProps {
  type: BalanceCardType;
  amount: number;
}

export function BalanceCard({ type, amount }: BalanceCardProps) {
  const config = balanceCardConfig[type];
  const Icon = config.icon;

  return (
    <Surface
      as="article"
      className={cx(
        config.gradient,
        "text-white shadow-lg pointer-fine:hover:shadow-xl transition-all  duration-300 pointer-fine:hover:bg-linear-to-tl bg-linear-to-br "
      )}
    >
      <header>
        <h3 className={cx(config.textColor, "text-sm mb-1 font-medium")}>
          {config.title}
        </h3>
      </header>
      <div className="flex items-center gap-3">
        <Icon className="size-6 drop-shadow-sm" aria-hidden="true" />
        <strong className="text-2xl font-bold drop-shadow-sm">
          {formatCurrency(amount)}
        </strong>
      </div>
    </Surface>
  );
}
