import { HTMLAttributes, ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cx } from "@/shared/lib/cx";

const badgeVariants = cva(
  "inline-flex items-center font-medium rounded px-1.5 py-px text-xs",
  {
    variants: {
      variant: {
        default: "bg-border text-foreground",
        success: "bg-success/15 text-success",
        danger: "bg-danger/15 text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export function Badge({
  children,
  variant,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span className={cx(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
