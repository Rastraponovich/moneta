"use client";

import { HomePage } from "@/views/home";
import { useDashboardData } from "@/views/home/model";

import { ProtectedRoute } from "@/features/auth";

export default function DashboardHomePage() {
  const { initialBalance, initialTransactions } = useDashboardData();

  return (
    <ProtectedRoute>
      <HomePage
        initialBalance={initialBalance}
        initialTransactions={initialTransactions}
      />
    </ProtectedRoute>
  );
}
