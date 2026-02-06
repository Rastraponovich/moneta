"use client";

export function AddTransactionSection({
  onAddClick,
}: {
  onAddClick?: () => void;
}) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => onAddClick?.()}
        className="font-medium rounded-xl transition-colors min-h-[44px] bg-primary text-white hover:bg-primary-hover px-4 py-2 text-base w-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        + Добавить транзакцию
      </button>
    </div>
  );
}
