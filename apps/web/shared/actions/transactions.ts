"use server";

import { revalidatePath } from "next/cache";

import { Transaction } from "@/entities/transaction";

import { delay } from "@/shared/lib/delay";
import {
  addTransaction,
  deleteTransaction as deleteTransactionStore,
  getTransactions as getTransactionsStore,
  updateTransaction as updateTransactionStore,
} from "@/shared/lib/mock-store";
import { requireServerAuth } from "@/shared/lib/server-auth";

export async function getTransactions(): Promise<Transaction[]> {
  await requireServerAuth();
  await delay();
  return getTransactionsStore();
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
