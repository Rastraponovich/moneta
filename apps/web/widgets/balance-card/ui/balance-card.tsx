"use client";

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Balance } from "@/entities/balance";

import { Card } from "@/shared/ui";

interface BalanceCardProps {
  balance: Balance;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm mb-1">Баланс</p>
            <p className="text-2xl font-bold">
              {formatCurrency(balance.total)}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-gray-600 text-sm mb-1">Доходы</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(balance.income)}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-3">
          <TrendingDown className="w-6 h-6 text-red-600" />
          <div>
            <p className="text-gray-600 text-sm mb-1">Расходы</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(balance.expenses)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
