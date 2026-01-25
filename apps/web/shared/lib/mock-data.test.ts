import { describe, expect, it } from "vitest";

import { mockBalance, mockCategories, mockTransactions } from "./mock-data";

describe("mock-data", () => {
  it("has transactions", () => {
    expect(mockTransactions.length).toBeGreaterThan(0);
    expect(mockTransactions[0]).toHaveProperty("id");
    expect(mockTransactions[0]).toHaveProperty("amount");
    expect(mockTransactions[0]).toHaveProperty("type");
  });

  it("has categories", () => {
    expect(mockCategories.length).toBeGreaterThan(0);
    expect(mockCategories[0]).toHaveProperty("id");
    expect(mockCategories[0]).toHaveProperty("name");
    expect(mockCategories[0]).toHaveProperty("type");
  });

  it("has balance", () => {
    expect(mockBalance).toHaveProperty("total");
    expect(mockBalance).toHaveProperty("income");
    expect(mockBalance).toHaveProperty("expenses");
  });
});
