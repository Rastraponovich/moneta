"use server";

import { Balance } from "@/entities/balance";

import { delay } from "@/shared/lib/delay";
import { getBalance as getBalanceStore } from "@/shared/lib/mock-store";
import { requireServerAuth } from "@/shared/lib/server-auth";

export async function getBalance(): Promise<Balance> {
  await requireServerAuth();
  await delay();
  return getBalanceStore();
}
