import {
  Car,
  Film,
  Heart,
  type LucideIcon,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Transaction } from "@/entities/transaction";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getCategoryIcon(category: string): LucideIcon {
  if (category.includes("Продукты")) {
    return ShoppingCart;
  }
  if (category.includes("Транспорт")) {
    return Car;
  }
  if (category.includes("Развлечения")) {
    return Film;
  }
  if (category.includes("Здоровье")) {
    return Heart;
  }
  return Wallet;
}

export function getTransactionAriaAttributes(
  transaction: Transaction,
  formatCurrencyFn: (amount: number) => string
) {
  const transactionId = `transaction-${transaction.id}`;
  const amountId = `${transactionId}-amount`;
  const descriptionId = `${transactionId}-description`;
  const categoryId = `${transactionId}-category`;
  const dateId = `${transactionId}-date`;
  const isIncome = transaction.type === "income";

  return {
    ids: {
      transaction: transactionId,
      amount: amountId,
      description: descriptionId,
      category: categoryId,
      date: dateId,
    },
    article: {
      "aria-label": `Транзакция: ${transaction.description}, ${formatCurrencyFn(transaction.amount)}`,
      "aria-describedby": `${descriptionId} ${amountId} ${categoryId} ${dateId}`,
    },
    amount: {
      "aria-label": `Сумма: ${isIncome ? "доход" : "расход"} ${formatCurrencyFn(transaction.amount)}`,
    },
    deleteButton: {
      "aria-label": `Удалить транзакцию: ${transaction.description}`,
    },
  };
}
