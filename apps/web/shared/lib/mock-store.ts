import { Balance, Transaction } from "../api/types";
import { mockBalance, mockTransactions } from "./mock-data";

// Используем глобальный объект для сохранения состояния между запросами
// Это необходимо, так как в Next.js development режиме модули могут перезагружаться
declare global {
  var __mockStore:
    | {
        transactions: Transaction[];
        balance: Balance;
      }
    | undefined;
}

function getStore() {
  if (!global.__mockStore) {
    global.__mockStore = {
      transactions: [...mockTransactions],
      balance: { ...mockBalance },
    };
    // Пересчитываем баланс при инициализации
    recalculateBalance();
  }
  return global.__mockStore;
}

function recalculateBalance() {
  const store = getStore();
  const income = store.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = store.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  store.balance = {
    total: income - expenses,
    income,
    expenses,
    period: store.balance.period, // Сохраняем период
  };
}

export function getTransactions(): Transaction[] {
  const store = getStore();
  return [...store.transactions];
}

export function addTransaction(transaction: Transaction): Transaction {
  const store = getStore();
  store.transactions.push(transaction);
  recalculateBalance();
  return transaction;
}

export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | null {
  const store = getStore();
  const index = store.transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    return null;
  }
  store.transactions[index] = { ...store.transactions[index], ...updates };
  recalculateBalance();
  return store.transactions[index];
}

export function deleteTransaction(id: string): boolean {
  const store = getStore();
  const index = store.transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    return false;
  }
  store.transactions.splice(index, 1);
  recalculateBalance();
  return true;
}

export function getBalance(): Balance {
  const store = getStore();
  return { ...store.balance };
}

// Функция для сброса (для тестов)
export function resetStore() {
  const store = getStore();
  store.transactions = [...mockTransactions];
  store.balance = { ...mockBalance };
  recalculateBalance();
}
