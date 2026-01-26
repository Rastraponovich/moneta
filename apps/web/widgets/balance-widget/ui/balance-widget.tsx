"use client";

import { useEffect, useState, useTransition } from "react";

import { RefreshCw } from "lucide-react";

import { BalanceCard } from "@/widgets/balance-card";

import { Balance } from "@/entities/balance";

import { getBalance } from "@/shared/actions/balance";
import { Button } from "@/shared/ui";

interface BalanceWidgetProps {
  refreshKey?: number;
}

export function BalanceWidget({ refreshKey }: BalanceWidgetProps) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadBalance() {
      try {
        const data = await getBalance();
        setBalance(data);
      } catch (error) {
        console.error("Failed to load balance:", error);
        setBalance(null);
      }
    }

    loadBalance();
  }, [refreshKey]);

  function handleRefresh() {
    startTransition(async () => {
      try {
        const data = await getBalance();
        setBalance(data);
      } catch (error) {
        console.error("Failed to refresh balance:", error);
      }
    });
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <BalanceCard balance={balance} />
      <Button
        onClick={handleRefresh}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        disabled={isPending}
      >
        <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
        <span className="hidden sm:inline">Обновить</span>
      </Button>
    </div>
  );
}
