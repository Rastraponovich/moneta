import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

import { PublicRoute } from "./public-route";

// Мокируем next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Создаем тестовый контекст
const TestAuthContext = createContext<{
  user: any;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
} | undefined>(undefined);

function TestAuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: {
    user: any;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    register: () => Promise<void>;
  };
}) {
  return (
    <TestAuthContext.Provider value={value}>
      {children}
    </TestAuthContext.Provider>
  );
}

// Мокируем useAuth
vi.mock("../model/auth-context", () => ({
  useAuth: () => {
    const context = useContext(TestAuthContext);
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
  },
}));

describe("PublicRoute", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as any);
  });

  it("shows loading indicator when isLoading is true", () => {
    const mockAuthValue = {
      user: null,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </TestAuthProvider>
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
    expect(screen.queryByText("Public Content")).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to home when user is authenticated", async () => {
    const mockAuthValue = {
      user: { id: "1", email: "test@example.com" },
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });

    expect(screen.queryByText("Public Content")).not.toBeInTheDocument();
  });

  it("renders children when user is not authenticated", () => {
    const mockAuthValue = {
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <PublicRoute>
          <div>Public Content</div>
        </PublicRoute>
      </TestAuthProvider>
    );

    expect(screen.getByText("Public Content")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
