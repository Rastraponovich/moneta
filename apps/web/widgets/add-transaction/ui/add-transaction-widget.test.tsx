import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Transaction } from "@/entities/transaction";

import { AddTransactionWidget } from "./add-transaction-widget";

// Мокируем компоненты
vi.mock("@/features/add-transaction", () => ({
  AddTransactionForm: ({
    onSuccess,
    onCancel,
    onLoadingChange,
  }: {
    onSuccess?: (transaction: Transaction) => void;
    onCancel?: () => void;
    onLoadingChange?: (loading: boolean) => void;
  }) => (
    <div data-testid="add-transaction-form">
      <button
        onClick={() => {
          onSuccess?.({
            id: "1",
            amount: 1000,
            type: "expense",
            category: "Продукты",
            description: "Тест",
            date: "2026-01-25",
          });
        }}
      >
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      <button
        onClick={() => {
          onLoadingChange?.(true);
        }}
      >
        Set Loading
      </button>
    </div>
  ),
}));

vi.mock("@/shared/ui", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  Dialog: ({
    isOpen,
    onClose,
    title,
    children,
    loading,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    loading?: boolean;
  }) =>
    isOpen ? (
      <div data-testid="dialog">
        {title && <h2>{title}</h2>}
        {loading && <div data-testid="dialog-loading">Loading...</div>}
        {children}
        <button onClick={onClose}>Close Dialog</button>
      </div>
    ) : null,
}));

describe("AddTransactionWidget", () => {
  const mockOnTransactionAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders button to open dialog", () => {
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    expect(
      screen.getByRole("button", { name: /добавить транзакцию/i })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("opens dialog when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    const openButton = screen.getByRole("button", {
      name: /добавить транзакцию/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByText("Добавить транзакцию")).toBeInTheDocument();
    expect(screen.getByTestId("add-transaction-form")).toBeInTheDocument();
  });

  it("closes dialog when transaction is added successfully", async () => {
    const user = userEvent.setup();
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    // Открываем диалог
    const openButton = screen.getByRole("button", {
      name: /добавить транзакцию/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    // Симулируем успешное добавление транзакции
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    expect(mockOnTransactionAdded).toHaveBeenCalledWith({
      id: "1",
      amount: 1000,
      type: "expense",
      category: "Продукты",
      description: "Тест",
      date: "2026-01-25",
    });
  });

  it("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    // Открываем диалог
    const openButton = screen.getByRole("button", {
      name: /добавить транзакцию/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    // Нажимаем отмену
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not close dialog when loading", async () => {
    const user = userEvent.setup();
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    // Открываем диалог
    const openButton = screen.getByRole("button", {
      name: /добавить транзакцию/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    // Устанавливаем состояние загрузки
    const setLoadingButton = screen.getByRole("button", {
      name: /set loading/i,
    });
    await user.click(setLoadingButton);

    expect(screen.getByTestId("dialog-loading")).toBeInTheDocument();

    // Пытаемся закрыть диалог
    const closeButton = screen.getByRole("button", { name: /close dialog/i });
    await user.click(closeButton);

    // Диалог должен остаться открытым во время загрузки
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("passes loading state to dialog", async () => {
    const user = userEvent.setup();
    render(
      <AddTransactionWidget onTransactionAdded={mockOnTransactionAdded} />
    );

    // Открываем диалог
    const openButton = screen.getByRole("button", {
      name: /добавить транзакцию/i,
    });
    await user.click(openButton);

    // Устанавливаем состояние загрузки
    const setLoadingButton = screen.getByRole("button", {
      name: /set loading/i,
    });
    await user.click(setLoadingButton);

    expect(screen.getByTestId("dialog-loading")).toBeInTheDocument();
  });
});
