"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { cva } from "class-variance-authority";
import Link from "next/link";

import { Transaction } from "@/entities/transaction";

import { cx } from "@/shared/lib/cx";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getCategoryIcon,
  getRelativeTime,
  getTransactionAriaAttributes,
} from "@/shared/lib/transaction-utils";
import { Badge } from "@/shared/ui";

export type TransactionCardVariant = "list" | "tiles" | "timeline";

/** Props passed to renderActions — feature (e.g. delete) injects its UI here */
export interface TransactionCardActionsProps {
  transaction: Transaction;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

interface TransactionCardProps {
  transaction: Transaction;
  isDeleting: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  editHref?: string;
  /** Layout variant: list (compact row), tiles (card tile), timeline (date left, content right) */
  variant?: TransactionCardVariant;
  /** Render prop for actions slot (FSD: feature injects delete etc.). When not set, actions slot is empty. */
  renderActions?: (props: TransactionCardActionsProps) => ReactNode;
}

const baseCard =
  "group relative overflow-hidden cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const cardVariants = cva(baseCard, {
  variants: {
    variant: {
      list: "rounded-xl bg-surface border border-border hover:shadow-md hover:border-border/80 pl-0 flex flex-wrap items-center gap-2 md:gap-3 py-2 md:py-0 md:flex-nowrap",
      tiles:
        "flex flex-col rounded-xl bg-surface border border-border hover:shadow-md hover:border-border/80 p-3 min-w-0",
      timeline:
        "rounded-lg bg-surface/60 border border-border/60 hover:bg-surface hover:border-border hover:shadow-sm py-2.5 flex flex-col md:flex-row gap-2 md:gap-3 flex-wrap md:flex-nowrap",
    },
  },
  defaultVariants: { variant: "list" },
});

interface CardWrapperProps {
  editHref?: string;
  ariaArticle: { "aria-label": string; "aria-describedby": string };
  onEdit?: (t: Transaction) => void;
  transaction: Transaction;
  onKeyDown: (e: KeyboardEvent<Element>) => void;
  className: string;
  listClassName?: string;
  children: ReactNode;
}

function CardWrapper({
  editHref,
  ariaArticle,
  onEdit,
  transaction,
  onKeyDown,
  className,
  listClassName,
  children,
}: CardWrapperProps) {
  const inner = editHref ? (
    <Link href={editHref} {...ariaArticle} className={className}>
      {children}
    </Link>
  ) : (
    <article
      tabIndex={0}
      role="button"
      onKeyDown={onKeyDown}
      onClick={() => onEdit?.(transaction)}
      {...ariaArticle}
      className={className}
    >
      {children}
    </article>
  );
  return <li className={listClassName}>{inner}</li>;
}

export function TransactionCard(props: TransactionCardProps) {
  const {
    transaction,
    isDeleting,
    onEdit,
    onDelete,
    editHref,
    variant = "list",
    renderActions,
  } = props;

  const actionsSlot =
    renderActions?.({ transaction, isDeleting, onDelete }) ?? null;

  const Icon = getCategoryIcon(transaction.category);
  const isIncome = transaction.type === "income";
  const aria = getTransactionAriaAttributes(transaction, formatCurrency);

  const accentBg = isIncome
    ? "bg-success/10 text-success"
    : "bg-danger/10 text-danger";
  const amountColor = isIncome ? "text-success" : "text-danger";

  function handleCardKeyDown(event: KeyboardEvent<Element>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (editHref) {
        return;
      }
      onEdit?.(transaction);
    }
  }

  const cardClassName = cardVariants({ variant });

  let content: ReactNode;
  let listClassName: string | undefined;

  if (variant === "list") {
    content = (
      <>
        <div
          aria-hidden
          className={cx(
            "w-1 self-stretch shrink-0 rounded-r min-h-9 md:min-h-0",
            isIncome ? "bg-success" : "bg-danger"
          )}
        />
        <div
          aria-hidden
          className={cx(
            "flex items-center justify-center size-9 md:size-10 rounded-xl shrink-0",
            accentBg
          )}
        >
          <Icon className="size-4 md:size-5" aria-hidden />
        </div>
        <p
          id={aria.ids.description}
          className="font-semibold text-foreground text-sm truncate flex-1 min-w-0"
        >
          {transaction.description}
        </p>
        <p
          id={aria.ids.amount}
          className={cx(
            "font-bold text-sm md:text-base shrink-0 order-0 md:order-2",
            amountColor
          )}
          {...aria.amount}
        >
          {isIncome ? "+" : "−"}
          {formatCurrency(transaction.amount)}
        </p>
        <div className="order-0 md:order-3">{actionsSlot}</div>
        {/* До md: категория·дата на второй строке (pl-12). От md: одна строка — описание, категория·дата, сумма, кнопки */}
        <div className="flex items-center gap-1.5 w-full md:w-auto md:flex-1 md:min-w-0 basis-full md:basis-auto pl-12 md:pl-0 order-1 md:order-1">
          <span
            id={aria.ids.category}
            className="text-xs text-muted md:truncate md:min-w-0"
          >
            {transaction.category}
          </span>
          <span className="text-border shrink-0">·</span>
          <time
            id={aria.ids.date}
            dateTime={transaction.date}
            className="text-xs text-muted shrink-0 whitespace-nowrap tabular-nums"
          >
            {getRelativeTime(transaction.date)}
          </time>
        </div>
      </>
    );
    listClassName = undefined;
  } else if (variant === "tiles") {
    content = (
      <>
        <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
          <div
            className={cx(
              "flex items-center justify-center size-9 rounded-lg shrink-0",
              accentBg
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
          <div className="flex items-center gap-1.5 min-w-0 shrink">
            <Badge variant={isIncome ? "success" : "danger"}>
              {isIncome ? "Доход" : "Расход"}
            </Badge>
            <time
              id={aria.ids.date}
              dateTime={transaction.date}
              className="text-[11px] text-muted whitespace-nowrap tabular-nums shrink-0"
              title={formatDateTime(transaction.date)}
            >
              {getRelativeTime(transaction.date)}
            </time>
          </div>
        </div>
        <p
          id={aria.ids.description}
          className="font-semibold text-foreground text-sm line-clamp-2 mb-0.5 min-w-0"
        >
          {transaction.description}
        </p>
        <p
          id={aria.ids.category}
          className="text-xs text-muted truncate mb-1.5 min-w-0"
        >
          {transaction.category}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto min-w-0">
          <p
            id={aria.ids.amount}
            className={cx("font-bold text-base truncate", amountColor)}
            {...aria.amount}
          >
            {isIncome ? "+" : "−"}
            {formatCurrency(transaction.amount)}
          </p>
          {actionsSlot}
        </div>
      </>
    );
    listClassName = "list-none";
  } else {
    // timeline: до 768px — две строки, от 768px — горизонтальный таймлайн
    const dateTimeParts = formatDateTime(transaction.date).split(", ");
    const timePart = dateTimeParts[1] ?? "";
    content = (
      <>
        <div className="flex items-center gap-2 min-w-0 order-1 md:order-0 md:contents">
          <div className="shrink-0 md:w-18 md:flex md:flex-col md:items-end md:text-right">
            <time
              id={aria.ids.date}
              dateTime={transaction.date}
              className="text-xs md:text-[11px] font-medium text-muted tabular-nums shrink-0 md:flex md:flex-col md:items-end"
              title={formatDateTime(transaction.date)}
            >
              <span className="block md:hidden">
                {getRelativeTime(transaction.date)}
              </span>
              <span className="hidden md:block">
                {formatDate(transaction.date)}
              </span>
              <span className="hidden md:block text-[10px] text-muted mt-0.5">
                {timePart}
              </span>
            </time>
          </div>
        </div>
        <p
          id={aria.ids.amount}
          className={cx(
            "font-bold text-sm md:text-base shrink-0 order-2 md:order-5",
            amountColor
          )}
          {...aria.amount}
        >
          {isIncome ? "+" : "−"}
          {formatCurrency(transaction.amount)}
        </p>
        <div
          className="order-3 md:order-6 flex-1 min-w-0 md:flex-initial md:min-w-0"
          aria-hidden
        >
          {actionsSlot}
        </div>
        <div className="w-full basis-full order-4 md:hidden" aria-hidden />
        <div
          aria-hidden
          className={cx(
            "hidden md:block w-0.5 self-stretch shrink-0 rounded-full md:order-1",
            isIncome ? "bg-success/50" : "bg-danger/50"
          )}
        />
        <div
          aria-hidden
          className={cx(
            "flex items-center justify-center size-8 md:size-9 rounded-lg shrink-0 order-5 md:order-2",
            accentBg
          )}
        >
          <Icon className="size-3.5 md:size-4" aria-hidden />
        </div>
        <p
          id={aria.ids.description}
          className="font-semibold text-foreground text-sm truncate min-w-0 flex-1 order-6 md:order-3"
        >
          {transaction.description}
        </p>
        <span
          id={aria.ids.category}
          className="text-xs text-muted truncate shrink-0 max-w-[100px] md:max-w-none order-7 md:order-4"
        >
          {transaction.category}
        </span>
      </>
    );
    listClassName = undefined;
  }

  return (
    <CardWrapper
      editHref={editHref}
      ariaArticle={aria.article}
      onEdit={onEdit}
      transaction={transaction}
      onKeyDown={handleCardKeyDown}
      className={cardClassName}
      listClassName={listClassName}
    >
      {content}
    </CardWrapper>
  );
}
