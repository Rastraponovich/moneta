import { useCallback, useEffect, useState } from "react";

import type { TransactionCardVariant } from "@/entities/transaction";

// Реэкспорт для обратной совместимости
// Функции перенесены в shared/lib/transaction-utils.ts
export {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getTransactionAriaAttributes,
} from "@/shared/lib/transaction-utils";

export type ViewMode = TransactionCardVariant;

const VIEW_STORAGE_KEY = "transactions-view-mode";

export function getStoredViewMode(): ViewMode {
  if (typeof window === "undefined") {
    return "list";
  }
  const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
  if (stored === "list" || stored === "tiles" || stored === "timeline") {
    return stored;
  }
  return "list";
}

/** Единый источник класса контейнера списка по режиму (скелетон и реальный список). */
export function getListClassName(viewMode: ViewMode): string {
  return viewMode === "tiles"
    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 list-none max-w-full"
    : viewMode === "timeline"
      ? "space-y-0"
      : "space-y-2";
}

export function useViewMode(
  controlledViewMode?: ViewMode,
  onViewModeChange?: (mode: ViewMode) => void
): [ViewMode, (mode: ViewMode) => void] {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("list");
  const isControlled = controlledViewMode !== undefined;
  const viewMode = isControlled ? controlledViewMode : internalViewMode;

  useEffect(() => {
    if (!isControlled) {
      setInternalViewMode(getStoredViewMode());
    }
  }, [isControlled]);

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      if (!isControlled) {
        setInternalViewMode(mode);
        try {
          window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
        } catch {
          // ignore
        }
      }
      onViewModeChange?.(mode);
    },
    [isControlled, onViewModeChange]
  );

  return [viewMode, setViewMode];
}
