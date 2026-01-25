import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createContext, useContext, type ReactNode } from "react";

import { AuthLoader } from "./auth-loader";

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

describe("AuthLoader", () => {
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
        <AuthLoader>
          <div>Content</div>
        </AuthLoader>
      </TestAuthProvider>
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("renders children when isLoading is false", () => {
    const mockAuthValue = {
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    render(
      <TestAuthProvider value={mockAuthValue}>
        <AuthLoader>
          <div>Content</div>
        </AuthLoader>
      </TestAuthProvider>
    );

    expect(screen.queryByText("Загрузка...")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
