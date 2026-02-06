"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import { cva } from "class-variance-authority";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION = 4000;

const toastVariants = cva(
  "pointer-events-auto rounded-xl shadow-lg px-4 py-3 text-sm font-medium transition-opacity bg-surface-elevated text-foreground border-l-4",
  {
    variants: {
      type: {
        success: "border-l-success",
        error: "border-l-danger",
        info: "border-l-primary",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: ToastType = "success",
      duration = TOAST_DURATION
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastList toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastList({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) {
    return null;
  }
  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-100 flex flex-col gap-2 pointer-events-none sm:left-auto sm:right-4 sm:max-w-sm"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className={toastVariants({ type: toast.type })}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
