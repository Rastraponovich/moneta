import { DashboardDataProvider } from "@/views/home/model";

import { Balance } from "@/entities/balance";
import { Transaction } from "@/entities/transaction";

import { getBalance } from "@/shared/actions/balance";
import { getTransactions } from "@/shared/actions/transactions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialBalance: Balance | null = null;
  let initialTransactions: Transaction[] = [];
  try {
    initialBalance = await getBalance();
  } catch {
    // не авторизован или ошибка
  }
  try {
    const data = await getTransactions();
    initialTransactions = Array.isArray(data) ? data : [];
  } catch {
    // не авторизован или ошибка
  }

  return (
    <DashboardDataProvider
      initialBalance={initialBalance}
      initialTransactions={initialTransactions}
    >
      {children}
    </DashboardDataProvider>
  );
}
