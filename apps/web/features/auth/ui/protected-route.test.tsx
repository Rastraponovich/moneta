import { createContext, type ReactNode, useContext } from "react";

import { useRouter } from "next/navigation";

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProtectedRoute } from "./protected-route";

// Мокируем next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Создаем тестовый контекст
const TestAuthContext = createContext<
  | {
      user: any;
      isLoading: boolean;
      login: () => Promise<void>;
      logout: () => Promise<void>;
      register: () => Promise<void>;
    }
  | undefined
>(undefined);

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

describe("ProtectedRoute", () => {
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
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestAuthProvider>
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to login when user is not authenticated", async () => {
    const mockAuthValue = {
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestAuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    const mockAuthValue = {
      user: { id: "1", email: "test@example.com" },
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestAuthProvider>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
