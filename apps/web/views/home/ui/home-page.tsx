"use client";

import {
  DeleteTransactionProvider,
  TransactionsProvider,
} from "@/views/home/model";

import { Balance } from "@/entities/balance";
import { Transaction } from "@/entities/transaction";

import { HomeContent } from "./home-content";

interface HomePageProps {
  initialBalance?: Balance | null;
  initialTransactions?: Transaction[];
}

export function HomePage({
  initialBalance = null,
  initialTransactions = [],
}: HomePageProps) {
  return (
    <TransactionsProvider initialTransactions={initialTransactions}>
      <DeleteTransactionProvider>
        <HomeContent initialBalance={initialBalance} />
      </DeleteTransactionProvider>
    </TransactionsProvider>
  );
}
