"use client";

import { LayoutGrid, List, ListOrdered, type LucideIcon } from "lucide-react";

import type { TransactionCardVariant } from "@/entities/transaction";

import { cx } from "@/shared/lib/cx";

const VIEW_OPTIONS: ReadonlyArray<{
  mode: TransactionCardVariant;
  icon: LucideIcon;
  label: string;
}> = [
  { mode: "list", icon: List, label: "Список" },
  { mode: "tiles", icon: LayoutGrid, label: "Тайлы" },
  { mode: "timeline", icon: ListOrdered, label: "Таймлайн" },
];

interface ViewModeToggleProps {
  value: TransactionCardVariant;
  onChange: (mode: TransactionCardVariant) => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div
      className="flex rounded-lg border border-border bg-surface p-0.5"
      role="tablist"
      aria-label="Режим отображения транзакций"
    >
      {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={value === mode}
          aria-label={label}
          onClick={() => onChange(mode)}
          className={cx(
            "flex items-center justify-center size-9 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            value === mode
              ? "bg-primary text-white"
              : "text-muted hover:text-foreground hover:bg-border/50"
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}
