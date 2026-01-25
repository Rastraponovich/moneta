import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  generateToken,
  getSession,
  removeSession,
  saveSession,
} from "./auth";

describe("auth utilities", () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    // Мокируем document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("generates token", () => {
    const token = generateToken();
    expect(token).toContain("token_");
    expect(token.length).toBeGreaterThan(10);
  });

  it("saves and retrieves session", () => {
    const session = {
      token: "test_token",
      userId: "1",
      expiresAt: Date.now() + 1000000,
    };

    saveSession(session);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(document.cookie).toContain("finvam_session");

    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(session));
    const retrieved = getSession();
    expect(retrieved).toEqual(session);
  });

  it("saves session to both localStorage and cookies", () => {
    const session = {
      token: "test_token",
      userId: "1",
      expiresAt: Date.now() + 1000000,
    };

    saveSession(session);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "finvam_session",
      JSON.stringify(session)
    );
    expect(document.cookie).toContain("finvam_session");
    expect(document.cookie).toContain(session.token);
  });

  it("removes session from both localStorage and cookies", () => {
    document.cookie = "finvam_session=test; path=/";
    removeSession();

    expect(localStorage.removeItem).toHaveBeenCalledWith("finvam_session");
    expect(document.cookie).toContain("expires=Thu, 01 Jan 1970");
  });

  it("handles expired session", () => {
    const expiredSession = {
      token: "test_token",
      userId: "1",
      expiresAt: Date.now() - 1000,
    };

    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify(expiredSession)
    );
    const retrieved = getSession();
    expect(retrieved).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  it("returns null when no session in localStorage", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    const retrieved = getSession();
    expect(retrieved).toBeNull();
  });

  it("returns null when localStorage is not available (SSR)", () => {
    const originalWindow = global.window;
    // @ts-expect-error - имитируем SSR окружение
    delete global.window;

    const session = {
      token: "test_token",
      userId: "1",
      expiresAt: Date.now() + 1000000,
    };

    saveSession(session);
    const retrieved = getSession();
    expect(retrieved).toBeNull();

    global.window = originalWindow;
  });
});
