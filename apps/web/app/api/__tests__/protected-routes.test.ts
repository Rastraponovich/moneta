import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET as getBalance } from "../balance/route";
import { GET as getCategories } from "../categories/route";
import { GET as getTransactions } from "../transactions/route";
import { POST as postTransaction } from "../transactions/route";

// Мокируем next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Мокируем mock-data
vi.mock("@/shared/lib/mock-data", () => ({
  mockTransactions: [{ id: "1", amount: 100 }],
  mockBalance: { total: 1000 },
  mockCategories: [{ id: "1", name: "Food" }],
}));

describe("Protected API Routes", () => {
  const mockCookies = vi.mocked(cookies);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/transactions", () => {
    it("returns 401 when not authenticated", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new NextRequest("http://localhost/api/transactions");
      const response = await getTransactions(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("returns transactions when authenticated", async () => {
      const validSession = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new NextRequest("http://localhost/api/transactions");
      const response = await getTransactions(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([{ id: "1", amount: 100 }]);
    });
  });

  describe("POST /api/transactions", () => {
    it("returns 401 when not authenticated", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new NextRequest("http://localhost/api/transactions", {
        method: "POST",
        body: JSON.stringify({ amount: 100 }),
      });
      const response = await postTransaction(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("creates transaction when authenticated", async () => {
      const validSession = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new NextRequest("http://localhost/api/transactions", {
        method: "POST",
        body: JSON.stringify({ amount: 200, category: "food" }),
      });
      const response = await postTransaction(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.amount).toBe(200);
      expect(data.category).toBe("food");
    });
  });

  describe("GET /api/balance", () => {
    it("returns 401 when not authenticated", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new NextRequest("http://localhost/api/balance");
      const response = await getBalance(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("returns balance when authenticated", async () => {
      const validSession = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new NextRequest("http://localhost/api/balance");
      const response = await getBalance(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ total: 1000 });
    });
  });

  describe("GET /api/categories", () => {
    it("returns 401 when not authenticated", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new NextRequest("http://localhost/api/categories");
      const response = await getCategories(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("returns categories when authenticated", async () => {
      const validSession = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new NextRequest("http://localhost/api/categories");
      const response = await getCategories(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([{ id: "1", name: "Food" }]);
    });
  });

  describe("Expired session handling", () => {
    it("returns 401 when session is expired", async () => {
      const expiredSession = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() - 1000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(expiredSession),
        }),
      } as any);

      const request = new NextRequest("http://localhost/api/transactions");
      const response = await getTransactions(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });
});
