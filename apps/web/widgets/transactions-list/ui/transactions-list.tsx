"use client";

import {
  Car,
  Film,
  Heart,
  type LucideIcon,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Transaction } from "@/entities/transaction";
import { Card } from "@/shared/ui/card";

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  const getCategoryIcon = (category: string): LucideIcon => {
    if (category.includes("Продукты")) return ShoppingCart;
    if (category.includes("Транспорт")) return Car;
    if (category.includes("Развлечения")) return Film;
    if (category.includes("Здоровье")) return Heart;
    return Wallet;
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Транзакции</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          return (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <p
                className={`text-lg font-bold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
