"use client";

import { createContext, type ReactNode, useContext } from "react";

import { Balance } from "@/entities/balance";
import { Transaction } from "@/entities/transaction";

export interface DashboardData {
  initialBalance: Balance | null;
  initialTransactions: Transaction[];
}

const DashboardDataContext = createContext<DashboardData | undefined>(
  undefined
);

export function DashboardDataProvider({
  children,
  initialBalance,
  initialTransactions,
}: {
  children: ReactNode;
  initialBalance: Balance | null;
  initialTransactions: Transaction[];
}) {
  const value: DashboardData = {
    initialBalance,
    initialTransactions: Array.isArray(initialTransactions)
      ? initialTransactions
      : [],
  };
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData(): DashboardData {
  const context = useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardData must be used within a DashboardDataProvider"
    );
  }
  return context;
}
