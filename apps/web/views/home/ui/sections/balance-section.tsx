"use client";

import { useDeleteTransaction } from "@/views/home/model";

import { BalanceWidget } from "@/widgets/balance-widget";

import { Balance } from "@/entities/balance";

interface BalanceSectionProps {
  initialBalance?: Balance | null;
}

export function BalanceSection({ initialBalance = null }: BalanceSectionProps) {
  const { isDeletePending } = useDeleteTransaction();

  return (
    <BalanceWidget
      initialBalance={initialBalance}
      isUpdating={isDeletePending}
    />
  );
}
