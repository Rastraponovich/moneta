"use server";

import { revalidatePath } from "next/cache";

import { Transaction } from "@/entities/transaction";

import { delay } from "@/shared/lib/delay";
import {
  addTransaction,
  deleteTransaction as deleteTransactionStore,
  getTransactionsFiltered,
  getTransactions as getTransactionsStore,
  updateTransaction as updateTransactionStore,
} from "@/shared/lib/mock-store";
import type { TransactionsFilter } from "@/shared/lib/mock-store";
import { requireServerAuth } from "@/shared/lib/server-auth";

export type GetTransactionsParams = TransactionsFilter;

function isEmptyParams(params: GetTransactionsParams | undefined): boolean {
  if (!params) return true;
  const q = (params.q ?? "").trim();
  const type = params.type ?? "all";
  const sortBy = params.sortBy ?? "date-desc";
  return !q && type === "all" && sortBy === "date-desc";
}

export async function getTransactions(
  params?: GetTransactionsParams
): Promise<Transaction[]> {
  await requireServerAuth();
  await delay();
  if (isEmptyParams(params)) {
    return getTransactionsStore();
  }
  return getTransactionsFiltered(params!);
}

export interface CreateTransactionInput {
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
}

export async function createTransaction(
  data: CreateTransactionInput
): Promise<Transaction> {
  await requireServerAuth();
  await delay();
  const transaction: Transaction = {
    id: Date.now().toString(),
    ...data,
  };
  const result = addTransaction(transaction);
  revalidatePath("/");
  return result;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: "income" | "expense";
  category?: string;
  description?: string;
  date?: string;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionInput
): Promise<Transaction> {
  await requireServerAuth();
  await delay();
  const updated = updateTransactionStore(id, data);

  if (!updated) {
    throw new Error("Transaction not found");
  }

  revalidatePath("/");
  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  await requireServerAuth();
  await delay();
  const deleted = deleteTransactionStore(id);

  if (!deleted) {
    throw new Error("Transaction not found");
  }

  revalidatePath("/");
}
