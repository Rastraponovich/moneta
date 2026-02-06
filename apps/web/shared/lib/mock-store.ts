import { Balance, Transaction } from "../api/types";
import { mockBalance, mockTransactions } from "./mock-data";

export type TransactionsFilterType = "all" | "income" | "expense";
export type TransactionsSortBy =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc";

export interface TransactionsFilter {
  q?: string;
  type?: TransactionsFilterType;
  sortBy?: TransactionsSortBy;
}

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

/** Returns in-memory store (initializes from mock data if needed). For tests: use _getStore. */
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

/** Recalculates balance from transactions. For tests: use _recalculateBalance. */
function recalculateBalance() {
  const store = getStore();
  const income = store.transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenses = store.transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  store.balance = {
    total: income - expenses,
    income,
    expenses,
    period: store.balance.period, // Сохраняем период
  };
}

/** Returns all transactions from mock store. */
export function getTransactions(): Transaction[] {
  const store = getStore();
  return [...store.transactions];
}

/** Returns transactions filtered and sorted by params. */
export function getTransactionsFiltered(
  params: TransactionsFilter
): Transaction[] {
  const store = getStore();
  const { q = "", type = "all", sortBy = "date-desc" } = params;
  const query = q.trim().toLowerCase();
  const filtered: Transaction[] = [];

  for (const t of store.transactions) {
    if (type !== "all" && t.type !== type) continue;
    if (
      query &&
      !t.description.toLowerCase().includes(query) &&
      !t.category.toLowerCase().includes(query)
    )
      continue;
    filtered.push(t);
  }

  filtered.sort((a, b) => {
    if (sortBy === "date-desc") return b.date.localeCompare(a.date);
    if (sortBy === "date-asc") return a.date.localeCompare(b.date);
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  return filtered;
}

/** Adds transaction and recalculates balance. */
export function addTransaction(transaction: Transaction): Transaction {
  const store = getStore();
  store.transactions.push(transaction);
  recalculateBalance();
  return transaction;
}

/** Updates transaction by id; returns updated transaction or null. */
export function updateTransaction(
  id: string,
  updates: Partial<Transaction>
): Transaction | null {
  const store = getStore();
  const index = store.transactions.findIndex(
    (transaction) => transaction.id === id
  );
  if (index === -1) {
    return null;
  }
  store.transactions[index] = { ...store.transactions[index], ...updates };
  recalculateBalance();
  return store.transactions[index];
}

/** Deletes transaction by id; returns true if found. */
export function deleteTransaction(id: string): boolean {
  const store = getStore();
  const index = store.transactions.findIndex(
    (transaction) => transaction.id === id
  );
  if (index === -1) {
    return false;
  }
  store.transactions.splice(index, 1);
  recalculateBalance();
  return true;
}

/** Returns current balance from mock store. */
export function getBalance(): Balance {
  const store = getStore();
  return { ...store.balance };
}

/** Resets store to initial mock data. For tests. */
export function resetStore() {
  const store = getStore();
  store.transactions = [...mockTransactions];
  store.balance = { ...mockBalance };
  recalculateBalance();
}

/** @internal For tests: access internal store. */
export const _getStore = getStore;

/** @internal For tests: trigger balance recalculation. */
export const _recalculateBalance = recalculateBalance;
