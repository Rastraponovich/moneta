import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { getServerSession, requireAuth } from "./api-auth";
import type { Session } from "./auth";

// Мокируем next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("api-auth", () => {
  const mockCookies = vi.mocked(cookies);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getServerSession", () => {
    it("returns null when no session cookie", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const session = await getServerSession();
      expect(session).toBeNull();
    });

    it("returns null when cookie value is empty", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: "" }),
      } as any);

      const session = await getServerSession();
      expect(session).toBeNull();
    });

    it("returns session when valid cookie exists", async () => {
      const validSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const session = await getServerSession();
      expect(session).toEqual(validSession);
    });

    it("returns null when session expired", async () => {
      const expiredSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() - 1000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(expiredSession),
        }),
      } as any);

      const session = await getServerSession();
      expect(session).toBeNull();
    });

    it("returns null when cookie value is invalid JSON", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: "invalid json",
        }),
      } as any);

      const session = await getServerSession();
      expect(session).toBeNull();
    });
  });

  describe("requireAuth", () => {
    it("returns null when user is authenticated", async () => {
      const validSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = await requireAuth(request);

      expect(result).toBeNull();
    });

    it("returns 401 response when user is not authenticated", async () => {
      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = await requireAuth(request);

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(401);
    });

    it("returns 401 response when session expired", async () => {
      const expiredSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() - 1000,
      };

      mockCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(expiredSession),
        }),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = await requireAuth(request);

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(401);
    });
  });
});
