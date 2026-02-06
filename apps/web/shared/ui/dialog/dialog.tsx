"use client";

import { ReactNode, useEffect } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  loading?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  loading = false,
}: DialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) {
    return null;
  }

  function handleOverlayClick() {
    if (!loading) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-surface rounded-2xl shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto transition-all duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              type="button"
              onClick={handleOverlayClick}
              disabled={loading}
              className="text-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Закрыть"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 relative text-foreground">
          {loading && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-border border-t-primary mb-2" />
                <p className="text-muted text-sm">Сохранение...</p>
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
