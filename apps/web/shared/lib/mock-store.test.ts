import { beforeEach, describe, expect, it } from "vitest";

import {
  addTransaction,
  getBalance,
  getTransactions,
  getTransactionsFiltered,
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

  describe("getTransactionsFiltered", () => {
    it("returns all transactions when params are empty or default", () => {
      const all = getTransactions();
      const filteredEmpty = getTransactionsFiltered({});
      const filteredAll = getTransactionsFiltered({ type: "all" });
      const filteredExplicit = getTransactionsFiltered({
        q: "",
        type: "all",
        sortBy: "date-desc",
      });
      expect(filteredEmpty).toHaveLength(all.length);
      expect(new Set(filteredEmpty.map((t) => t.id))).toEqual(
        new Set(all.map((t) => t.id))
      );
      expect(filteredAll).toHaveLength(all.length);
      expect(filteredExplicit).toHaveLength(all.length);
    });

    it("filters by type income", () => {
      const result = getTransactionsFiltered({ type: "income" });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((t) => t.type === "income")).toBe(true);
    });

    it("filters by type expense", () => {
      const result = getTransactionsFiltered({ type: "expense" });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((t) => t.type === "expense")).toBe(true);
    });

    it("filters by search query in description and category", () => {
      const result = getTransactionsFiltered({ q: "Продукты" });
      expect(result.length).toBeGreaterThan(0);
      expect(
        result.every(
          (t) =>
            t.description.toLowerCase().includes("продукты") ||
            t.category.toLowerCase().includes("продукты")
        )
      ).toBe(true);
    });

    it("sorts by amount descending", () => {
      const result = getTransactionsFiltered({ sortBy: "amount-desc" });
      expect(result.length).toBeGreaterThan(0);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].amount).toBeLessThanOrEqual(result[i - 1].amount);
      }
    });

    it("sorts by amount ascending", () => {
      const result = getTransactionsFiltered({ sortBy: "amount-asc" });
      expect(result.length).toBeGreaterThan(0);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].amount).toBeGreaterThanOrEqual(result[i - 1].amount);
      }
    });
  });
});
