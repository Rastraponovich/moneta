"use client";

import { useEffect } from "react";

import { Button } from "@/shared/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Что-то пошло не так
        </h2>
        <p className="text-muted text-sm mb-6">
          Не удалось загрузить страницу. Попробуйте обновить.
        </p>
        <Button variant="primary" onClick={reset}>
          Обновить
        </Button>
      </div>
    </div>
  );
}
