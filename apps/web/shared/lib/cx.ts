import { cx as clsx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/** Merges class names with CVA and tailwind-merge. */
export function cx(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(...inputs));
}
