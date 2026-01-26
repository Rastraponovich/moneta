import { Car, Film, Heart, ShoppingCart, Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Transaction } from "@/entities/transaction";

import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getTransactionAriaAttributes,
} from "./lib";

describe("transactions-list utilities", () => {
  describe("formatCurrency", () => {
    it("formats amount as currency", () => {
      expect(formatCurrency(1000)).toContain("1");
      expect(formatCurrency(1000)).toContain("000");
    });

    it("formats zero amount", () => {
      const result = formatCurrency(0);
      expect(result).toBeTruthy();
      expect(result).toContain("0");
    });

    it("formats large amounts", () => {
      const result = formatCurrency(1000000);
      expect(result).toBeTruthy();
      expect(result).toContain("1");
    });

    it("formats negative amounts", () => {
      const result = formatCurrency(-500);
      expect(result).toBeTruthy();
    });
  });

  describe("formatDate", () => {
    it("formats date string correctly", () => {
      const result = formatDate("2026-01-25");
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });

    it("formats date with leading zeros", () => {
      const result = formatDate("2026-01-05");
      expect(result).toContain("05");
    });

    it("handles different dates", () => {
      const result1 = formatDate("2026-12-31");
      const result2 = formatDate("2026-01-01");
      expect(result1).not.toBe(result2);
    });
  });

  describe("getCategoryIcon", () => {
    it("returns ShoppingCart for Продукты", () => {
      const Icon = getCategoryIcon("Продукты");
      expect(Icon).toBe(ShoppingCart);
    });

    it("returns Car for Транспорт", () => {
      const Icon = getCategoryIcon("Транспорт");
      expect(Icon).toBe(Car);
    });

    it("returns Film for Развлечения", () => {
      const Icon = getCategoryIcon("Развлечения");
      expect(Icon).toBe(Film);
    });

    it("returns Heart for Здоровье", () => {
      const Icon = getCategoryIcon("Здоровье");
      expect(Icon).toBe(Heart);
    });

    it("returns Wallet for unknown category", () => {
      const Icon = getCategoryIcon("Неизвестная категория");
      expect(Icon).toBe(Wallet);
    });

    it("returns correct icon for partial match", () => {
      const Icon = getCategoryIcon("Категория: Продукты питания");
      expect(Icon).toBe(ShoppingCart);
    });
  });

  describe("getTransactionAriaAttributes", () => {
    const mockTransaction: Transaction = {
      id: "test-1",
      amount: 1000,
      type: "income",
      category: "Продукты",
      description: "Тестовая транзакция",
      date: "2026-01-25",
    };

    const mockFormatCurrency = (amount: number) => `${amount} ₽`;

    it("returns correct ids structure", () => {
      const result = getTransactionAriaAttributes(
        mockTransaction,
        mockFormatCurrency
      );

      expect(result.ids.transaction).toBe("transaction-test-1");
      expect(result.ids.amount).toBe("transaction-test-1-amount");
      expect(result.ids.description).toBe("transaction-test-1-description");
      expect(result.ids.category).toBe("transaction-test-1-category");
      expect(result.ids.date).toBe("transaction-test-1-date");
    });

    it("returns correct aria-label for article", () => {
      const result = getTransactionAriaAttributes(
        mockTransaction,
        mockFormatCurrency
      );

      expect(result.article["aria-label"]).toContain("Тестовая транзакция");
      expect(result.article["aria-label"]).toContain("1000 ₽");
    });

    it("returns correct aria-describedby", () => {
      const result = getTransactionAriaAttributes(
        mockTransaction,
        mockFormatCurrency
      );

      const describedBy = result.article["aria-describedby"];
      expect(describedBy).toContain("transaction-test-1-description");
      expect(describedBy).toContain("transaction-test-1-amount");
      expect(describedBy).toContain("transaction-test-1-category");
      expect(describedBy).toContain("transaction-test-1-date");
    });

    it("returns correct aria-label for income amount", () => {
      const result = getTransactionAriaAttributes(
        mockTransaction,
        mockFormatCurrency
      );

      expect(result.amount["aria-label"]).toContain("доход");
      expect(result.amount["aria-label"]).toContain("1000 ₽");
    });

    it("returns correct aria-label for expense amount", () => {
      const expenseTransaction: Transaction = {
        ...mockTransaction,
        type: "expense",
      };

      const result = getTransactionAriaAttributes(
        expenseTransaction,
        mockFormatCurrency
      );

      expect(result.amount["aria-label"]).toContain("расход");
      expect(result.amount["aria-label"]).toContain("1000 ₽");
    });

    it("returns correct aria-label for delete button", () => {
      const result = getTransactionAriaAttributes(
        mockTransaction,
        mockFormatCurrency
      );

      expect(result.deleteButton["aria-label"]).toBe(
        "Удалить транзакцию: Тестовая транзакция"
      );
    });
  });
});
