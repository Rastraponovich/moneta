import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateToken, getSession, removeSession, saveSession } from "./auth";

describe("auth utilities", () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;
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

    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(session));
    const retrieved = getSession();
    expect(retrieved).toEqual(session);
  });

  it("removes session", () => {
    removeSession();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });
});
