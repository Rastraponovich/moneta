import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cx } from "@/shared/lib/cx";

interface SurfaceProps<T extends ElementType = "div"> {
  as?: T;
  children: ReactNode;
  className?: string;
}

export function Surface<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...props
}: SurfaceProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SurfaceProps<T>>) {
  const Component = as || ("div" as ElementType);
  return (
    <Component
      className={cx("bg-surface rounded-2xl p-4 md:p-6 shadow-md", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
