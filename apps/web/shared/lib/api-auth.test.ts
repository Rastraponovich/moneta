import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    it("returns null when no session cookie", () => {
      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const session = getServerSession();
      expect(session).toBeNull();
    });

    it("returns null when cookie value is empty", () => {
      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({ value: "" }),
      } as any);

      const session = getServerSession();
      expect(session).toBeNull();
    });

    it("returns session when valid cookie exists", () => {
      const validSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const session = getServerSession();
      expect(session).toEqual(validSession);
    });

    it("returns null when session expired", () => {
      const expiredSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() - 1000,
      };

      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(expiredSession),
        }),
      } as any);

      const session = getServerSession();
      expect(session).toBeNull();
    });

    it("returns null when cookie value is invalid JSON", () => {
      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({
          value: "invalid json",
        }),
      } as any);

      const session = getServerSession();
      expect(session).toBeNull();
    });
  });

  describe("requireAuth", () => {
    it("returns null when user is authenticated", () => {
      const validSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() + 1000000,
      };

      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(validSession),
        }),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = requireAuth(request);

      expect(result).toBeNull();
    });

    it("returns 401 response when user is not authenticated", () => {
      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = requireAuth(request);

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(401);
    });

    it("returns 401 response when session expired", () => {
      const expiredSession: Session = {
        token: "test_token",
        userId: "user_123",
        expiresAt: Date.now() - 1000,
      };

      mockCookies.mockReturnValue({
        get: vi.fn().mockReturnValue({
          value: JSON.stringify(expiredSession),
        }),
      } as any);

      const request = new Request("http://localhost/api/test");
      const result = requireAuth(request);

      expect(result).toBeInstanceOf(NextResponse);
      expect(result?.status).toBe(401);
    });
  });
});
