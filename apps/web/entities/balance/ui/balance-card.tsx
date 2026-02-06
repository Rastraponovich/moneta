"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCurrency } from "@/shared/lib/transaction-utils";
import { Surface } from "@/shared/ui";

const balanceCardVariants = cva(
  "bg-linear-to-br text-white shadow-lg pointer-fine:hover:shadow-xl transition-all duration-300 pointer-fine:hover:bg-linear-to-tl",
  {
    variants: {
      type: {
        total: "from-blue-400 via-blue-500 to-blue-600",
        income: "from-emerald-400 via-green-500 to-green-600",
        expenses: "from-orange-500 via-red-500 to-red-600",
      },
    },
  }
);

const balanceCardTitleVariants = cva("text-sm mb-1 font-medium", {
  variants: {
    type: {
      total: "text-blue-50",
      income: "text-green-50",
      expenses: "text-red-50",
    },
  },
});

type BalanceCardType = NonNullable<
  VariantProps<typeof balanceCardVariants>["type"]
>;

const balanceCardConfig = {
  total: { title: "Баланс", icon: Wallet },
  income: { title: "Доходы", icon: TrendingUp },
  expenses: { title: "Расходы", icon: TrendingDown },
} as const;

interface BalanceCardProps {
  type: BalanceCardType;
  amount: number;
}

export function BalanceCard({ type, amount }: BalanceCardProps) {
  const config = balanceCardConfig[type];
  const Icon = config.icon;

  return (
    <Surface as="article" className={balanceCardVariants({ type })}>
      <header>
        <h3 className={balanceCardTitleVariants({ type })}>{config.title}</h3>
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
