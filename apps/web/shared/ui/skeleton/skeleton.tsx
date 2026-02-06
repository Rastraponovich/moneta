import { cx } from "@/shared/lib/cx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={cx("animate-pulse rounded-xl bg-border", className)}
      aria-hidden
    />
  );
}

export type TransactionCardSkeletonVariant = "list" | "tiles" | "timeline";

interface TransactionCardSkeletonProps {
  variant?: TransactionCardSkeletonVariant;
}

export function TransactionCardSkeleton({
  variant = "list",
}: TransactionCardSkeletonProps = {}) {
  if (variant === "list") {
    return (
      <li className="flex items-center gap-3 rounded-xl p-0 bg-surface border border-border overflow-hidden">
        <Skeleton className="w-1 self-stretch shrink-0 rounded-r" />
        <Skeleton className="size-10 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2 py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-20 shrink-0" />
        <div className="flex gap-1 shrink-0 pr-2">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </li>
    );
  }

  if (variant === "tiles") {
    return (
      <li className="list-none flex flex-col rounded-xl p-4 bg-surface border border-border">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Skeleton className="size-10 rounded-xl shrink-0" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-3 w-24 mb-2" />
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-1">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      </li>
    );
  }

  // timeline
  return (
    <li className="flex gap-4 rounded-lg py-3 bg-surface/60 border border-border/60">
      <div className="flex flex-col shrink-0 w-16 gap-1">
        <Skeleton className="h-3 w-12 ml-auto" />
        <Skeleton className="h-3 w-8 ml-auto" />
      </div>
      <Skeleton className="w-0.5 self-stretch shrink-0 rounded-full" />
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-20 shrink-0" />
        <div className="flex gap-1 shrink-0">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>
    </li>
  );
}
