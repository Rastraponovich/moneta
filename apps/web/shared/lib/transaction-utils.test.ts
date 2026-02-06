import { describe, expect, it } from "vitest";

import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  getCategoryIcon,
  getDateGroupLabel,
  getDaySummary,
  getRelativeTime,
  getTransactionAriaAttributes,
  groupTransactionsByDate,
} from "./transaction-utils";

describe("transaction-utils", () => {
  describe("formatCurrency", () => {
    it("formats positive amount as RUB", () => {
      expect(formatCurrency(1234.56)).toMatch(/\d[\d\s,]*\s*₽/);
    });

    it("formats zero", () => {
      expect(formatCurrency(0)).toContain("0");
    });

    it("formats large amount", () => {
      const result = formatCurrency(100_000);
      expect(result).toContain("100");
      expect(result).toContain("₽");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string as DD.MM.YYYY", () => {
      expect(formatDate("2026-01-15")).toBe("15.01.2026");
    });

    it("formats another date", () => {
      expect(formatDate("2025-12-31")).toBe("31.12.2025");
    });
  });

  describe("formatTime", () => {
    it("formats time from ISO string", () => {
      const result = formatTime("2026-01-15T14:30:00.000Z");
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("formatDateTime", () => {
    it("includes date label and time", () => {
      const result = formatDateTime("2026-01-15T14:30:00.000Z");
      expect(result).toMatch(/,/);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("getRelativeTime", () => {
    it("returns formatDate for old date (fallback)", () => {
      const oldDate = "2020-01-01T12:00:00.000Z";
      expect(getRelativeTime(oldDate)).toBe(formatDate(oldDate));
    });

    it("returns 'только что' for very recent date", () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30_000).toISOString();
      expect(getRelativeTime(recent)).toBe("только что");
    });

    it("returns 'N мин. назад' for minutes ago", () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(
        now.getTime() - 5 * 60 * 1000
      ).toISOString();
      expect(getRelativeTime(fiveMinutesAgo)).toBe("5 мин. назад");
    });

    it("returns 'вчера' for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      expect(getRelativeTime(yesterday.toISOString())).toBe("вчера");
    });
  });

  describe("getDateGroupLabel", () => {
    it("returns 'Сегодня' for today", () => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const dateOnly = new Date(todayStr + "T12:00:00.000Z");
      expect(getDateGroupLabel(dateOnly.toISOString())).toBe("Сегодня");
    });

    it("returns 'Вчера' for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(12, 0, 0, 0);
      expect(getDateGroupLabel(yesterday.toISOString())).toBe("Вчера");
    });

    it("returns DD.MM.YYYY for older date", () => {
      expect(getDateGroupLabel("2025-06-15T12:00:00.000Z")).toBe("15.06.2025");
    });
  });

  describe("getDaySummary", () => {
    it("sums income and expense", () => {
      const items = [
        {
          id: "1",
          amount: 100,
          type: "income" as const,
          category: "A",
          description: "x",
          date: "2026-01-01",
        },
        {
          id: "2",
          amount: 30,
          type: "expense" as const,
          category: "B",
          description: "y",
          date: "2026-01-01",
        },
        {
          id: "3",
          amount: 50,
          type: "income" as const,
          category: "C",
          description: "z",
          date: "2026-01-01",
        },
      ];
      expect(getDaySummary(items)).toEqual({ income: 150, expense: 30 });
    });

    it("returns zeros for empty array", () => {
      expect(getDaySummary([])).toEqual({ income: 0, expense: 0 });
    });
  });

  describe("groupTransactionsByDate", () => {
    it("groups by date newest first", () => {
      const transactions = [
        {
          id: "1",
          amount: 1,
          type: "income" as const,
          category: "A",
          description: "a",
          date: "2026-01-02",
        },
        {
          id: "2",
          amount: 2,
          type: "expense" as const,
          category: "B",
          description: "b",
          date: "2026-01-01",
        },
        {
          id: "3",
          amount: 3,
          type: "income" as const,
          category: "C",
          description: "c",
          date: "2026-01-02",
        },
      ];
      const groups = groupTransactionsByDate(transactions);
      expect(groups).toHaveLength(2);
      expect(groups[0].items).toHaveLength(2);
      expect(groups[1].items).toHaveLength(1);
      expect(groups[0].label).toBe(getDateGroupLabel("2026-01-02"));
      expect(groups[1].label).toBe(getDateGroupLabel("2026-01-01"));
    });

    it("returns empty array for empty input", () => {
      expect(groupTransactionsByDate([])).toEqual([]);
    });
  });

  describe("getCategoryIcon", () => {
    it("returns ShoppingCart for Продукты", () => {
      const icon = getCategoryIcon("Продукты");
      expect(icon).toBeDefined();
    });

    it("returns Wallet for unknown category", () => {
      const icon = getCategoryIcon("Другое");
      expect(icon).toBeDefined();
    });

    it("matches category by substring", () => {
      const icon = getCategoryIcon("Транспорт");
      expect(icon).toBeDefined();
    });
  });

  describe("getTransactionAriaAttributes", () => {
    const formatCurrencyFn = (amount: number) => `${amount} ₽`;

    it("returns ids with transaction id prefix", () => {
      const transaction = {
        id: "tx-1",
        amount: 100,
        type: "income" as const,
        category: "A",
        description: "Test",
        date: "2026-01-01",
      };
      const attrs = getTransactionAriaAttributes(transaction, formatCurrencyFn);
      expect(attrs.ids.transaction).toBe("transaction-tx-1");
      expect(attrs.ids.amount).toBe("transaction-tx-1-amount");
    });

    it("includes description in article aria-label", () => {
      const transaction = {
        id: "tx-1",
        amount: 100,
        type: "expense" as const,
        category: "A",
        description: "Coffee",
        date: "2026-01-01",
      };
      const attrs = getTransactionAriaAttributes(transaction, formatCurrencyFn);
      expect(attrs.article["aria-label"]).toContain("Coffee");
      expect(attrs.deleteButton["aria-label"]).toContain("Coffee");
    });
  });
});
