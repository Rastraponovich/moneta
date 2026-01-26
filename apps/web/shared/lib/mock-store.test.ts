import { beforeEach, describe, expect, it } from "vitest";

import {
  addTransaction,
  getBalance,
  getTransactions,
  resetStore,
} from "./mock-store";

describe("mock-store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("adds transaction and recalculates balance", () => {
    const initialBalance = getBalance();
    const initialTransactions = getTransactions();

    const newTransaction = {
      id: "new-1",
      amount: 5000,
      type: "expense" as const,
      category: "Продукты",
      description: "Тест",
      date: "2026-01-25",
    };

    addTransaction(newTransaction);

    const updatedTransactions = getTransactions();
    const updatedBalance = getBalance();

    // Проверяем, что транзакция добавлена
    expect(updatedTransactions.length).toBe(initialTransactions.length + 1);
    expect(updatedTransactions).toContainEqual(newTransaction);

    // Проверяем, что баланс пересчитан
    if (newTransaction.type === "expense") {
      expect(updatedBalance.expenses).toBe(
        initialBalance.expenses + newTransaction.amount
      );
      expect(updatedBalance.total).toBe(
        initialBalance.total - newTransaction.amount
      );
    } else {
      expect(updatedBalance.income).toBe(
        initialBalance.income + newTransaction.amount
      );
      expect(updatedBalance.total).toBe(
        initialBalance.total + newTransaction.amount
      );
    }
  });

  it("recalculates balance correctly for income", () => {
    resetStore();
    const initialBalance = getBalance();

    const incomeTransaction = {
      id: "income-1",
      amount: 10000,
      type: "income" as const,
      category: "Зарплата",
      description: "Тест доход",
      date: "2026-01-25",
    };

    addTransaction(incomeTransaction);

    const updatedBalance = getBalance();
    expect(updatedBalance.income).toBe(
      initialBalance.income + incomeTransaction.amount
    );
    expect(updatedBalance.total).toBe(
      initialBalance.total + incomeTransaction.amount
    );
  });

  it("recalculates balance correctly for expense", () => {
    resetStore();
    const initialBalance = getBalance();

    const expenseTransaction = {
      id: "expense-1",
      amount: 2000,
      type: "expense" as const,
      category: "Продукты",
      description: "Тест расход",
      date: "2026-01-25",
    };

    addTransaction(expenseTransaction);

    const updatedBalance = getBalance();
    expect(updatedBalance.expenses).toBe(
      initialBalance.expenses + expenseTransaction.amount
    );
    expect(updatedBalance.total).toBe(
      initialBalance.total - expenseTransaction.amount
    );
  });
});
