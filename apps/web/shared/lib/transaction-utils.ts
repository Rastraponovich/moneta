import {
  Car,
  Film,
  Heart,
  type LucideIcon,
  ShoppingCart,
  Wallet,
} from "lucide-react";

import { Transaction } from "@/entities/transaction";

const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;
const MS_PER_DAY = 86_400_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;

/** Formats amount as RUB currency string (e.g. "1 234,56 ₽"). */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(amount);
}

/** Formats date as DD.MM.YYYY. */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Time only, e.g. "14:30" */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** "Сегодня, 14:30" or "Вчера, 09:15" or "01.02.2025, 14:30" */
export function formatDateTime(dateString: string): string {
  const label = getDateGroupLabel(dateString);
  const time = formatTime(dateString);
  return `${label}, ${time}`;
}

/** Relative time: "только что", "5 мин. назад", "2 ч. назад", "вчера", "3 дн. назад" or fallback to formatDate */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / MS_PER_MINUTE);
  const diffHours = Math.floor(diffMs / MS_PER_HOUR);
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffMins < 1) {
    return "только что";
  }
  if (diffMins < MINUTES_PER_HOUR) {
    return `${diffMins} мин. назад`;
  }
  if (diffHours < HOURS_PER_DAY) {
    return `${diffHours} ч. назад`;
  }
  if (diffDays === 1) {
    return "вчера";
  }
  if (diffDays < DAYS_PER_WEEK) {
    return `${diffDays} дн. назад`;
  }
  return formatDate(dateString);
}

/** Sum income and expense for a group of transactions */
export function getDaySummary(items: Transaction[]): {
  income: number;
  expense: number;
} {
  let income = 0;
  let expense = 0;
  for (const transaction of items) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }
  return { income, expense };
}

/** Returns group label for a date: "Сегодня", "Вчера", or DD.MM.YYYY */
export function getDateGroupLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Сегодня";
  }
  if (date.getTime() === yesterday.getTime()) {
    return "Вчера";
  }
  return formatDate(dateString);
}

/** Normalize date string to YYYY-MM-DD for grouping (handles ISO with time). */
function toDateOnly(dateStr: string): string {
  return dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
}

/** Groups transactions by date (newest first). Each group has label and transactions. */
export function groupTransactionsByDate<T extends { date: string }>(
  transactions: T[]
): { label: string; items: T[] }[] {
  const byDate = new Map<string, T[]>();
  for (const transaction of transactions) {
    const key = toDateOnly(transaction.date);
    if (!byDate.has(key)) {
      byDate.set(key, []);
    }
    byDate.get(key)!.push(transaction);
  }
  const sortedDates = Array.from(byDate.keys()).sort((a, b) =>
    b.localeCompare(a)
  );
  return sortedDates.map((dateStr) => ({
    label: getDateGroupLabel(dateStr),
    items: byDate.get(dateStr)!,
  }));
}

/** Returns Lucide icon for category name (Продукты, Транспорт, etc.) or Wallet as fallback. */
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

/**
 * Returns aria-* attributes for transaction card (ids, article, amount, delete/edit buttons).
 * @param transaction - Transaction data
 * @param formatCurrencyFn - Function to format amount for aria-label
 */
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
    editButton: {
      "aria-label": `Редактировать транзакцию: ${transaction.description}`,
    },
  };
}
