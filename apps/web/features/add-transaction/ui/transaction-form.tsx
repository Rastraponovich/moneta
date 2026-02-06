"use client";

import { useEffect, useState, useTransition } from "react";

import { Category } from "@/entities/category";
import { Transaction } from "@/entities/transaction";

import {
  createTransaction,
  updateTransaction,
} from "@/shared/actions/transactions";
import { getCategoryIcon } from "@/shared/lib/transaction-utils";
import { Button, Input, Skeleton, useToast } from "@/shared/ui";

const QUICK_DATE_TODAY = 0;
const QUICK_DATE_YESTERDAY = 1;

interface TransactionFormProps {
  initialTransaction?: Transaction;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function TransactionForm(props: TransactionFormProps) {
  const { initialTransaction, onSuccess, onCancel, onLoadingChange } = props;

  const [amount, setAmount] = useState(
    initialTransaction?.amount.toString() || ""
  );

  const [type, setType] = useState<"income" | "expense">(
    initialTransaction?.type || "expense"
  );

  const [category, setCategory] = useState(initialTransaction?.category || "");

  const [description, setDescription] = useState(
    initialTransaction?.description || ""
  );

  const [date, setDate] = useState(
    initialTransaction?.date || new Date().toISOString().split("T")[0]
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!initialTransaction;
  const loading = isPending;
  const { addToast } = useToast();

  // Загружаем категории (только один раз)
  useEffect(() => {
    if (categoriesLoaded) {
      return;
    }

    let cancelled = false;

    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        return res.json();
      })
      .then((data: Category[]) => {
        if (cancelled) {
          return;
        }
        setCategories(data);
        setCategoriesLoaded(true);
        if (data.length > 0 && !isEditMode) {
          // Устанавливаем первую категорию выбранного типа по умолчанию только при добавлении
          const defaultCategory = data.find((cat) => cat.type === type);
          if (defaultCategory && !category) {
            setCategory(defaultCategory.name);
          }
        }
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        console.error("Failed to load categories:", error);
        setError("Не удалось загрузить категории");
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновляем категорию при изменении типа (только при добавлении)
  useEffect(() => {
    if (categories.length > 0 && !isEditMode) {
      const defaultCategory = categories.find((cat) => cat.type === type);
      if (defaultCategory) {
        setCategory(defaultCategory.name);
      } else {
        setCategory("");
      }
    }
  }, [type, categories, isEditMode]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    // Валидация
    if (!amount || parseFloat(amount) <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    if (!category) {
      setError("Выберите категорию");
      return;
    }

    if (!description.trim()) {
      setError("Введите описание");
      return;
    }

    if (!date) {
      setError("Выберите дату");
      return;
    }

    onLoadingChange?.(true);

    startTransition(async () => {
      try {
        const transactionData = {
          amount: parseFloat(amount),
          type,
          category,
          description: description.trim(),
          date,
        };

        const transaction = isEditMode
          ? await updateTransaction(initialTransaction.id, transactionData)
          : await createTransaction(transactionData);

        // Сброс формы только при добавлении
        if (!isEditMode) {
          setAmount("");
          setDescription("");
          setDate(new Date().toISOString().split("T")[0]);
          const defaultCategory = categories.find((cat) => cat.type === type);
          if (defaultCategory) {
            setCategory(defaultCategory.name);
          }
        }

        addToast(
          isEditMode ? "Транзакция сохранена" : "Транзакция добавлена",
          "success"
        );
        onSuccess?.(transaction);
      } catch (err) {
        const message = isEditMode
          ? "Не удалось обновить транзакцию. Попробуйте еще раз."
          : "Не удалось создать транзакцию. Попробуйте еще раз.";
        setError(message);
        addToast(message, "error");
        console.error("Failed to save transaction:", err);
      } finally {
        onLoadingChange?.(false);
      }
    });
  }

  const filteredCategories = categories.filter((cat) => cat.type === type);

  if (loadingCategories) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  function setQuickAmount(value: number) {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + value));
  }

  function setQuickDate(daysAgo: number) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDate(d.toISOString().split("T")[0]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Тип транзакции */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Тип
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              type === "income"
                ? "bg-success text-white"
                : "bg-border text-foreground hover:bg-muted/30"
            }`}
          >
            Доход
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              type === "expense"
                ? "bg-danger text-white"
                : "bg-border text-foreground hover:bg-muted/30"
            }`}
          >
            Расход
          </button>
        </div>
      </div>

      {/* Сумма */}
      <div>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          label="Сумма"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          required
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {quickAmounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setQuickAmount(value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-border text-foreground hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              +{value.toLocaleString("ru-RU")}
            </button>
          ))}
        </div>
      </div>

      {/* Категория */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Категория
        </label>
        <div className="flex flex-wrap gap-1.5" role="group">
          {filteredCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const isSelected = category === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`inline-flex items-center gap-2 p-2 rounded-xl border-2 transition-all min-h-[36px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-muted"
                }`}
              >
                <span
                  className="flex items-center justify-center size-6 rounded-lg shrink-0 text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Описание */}
      <div>
        <Input
          type="text"
          label="Описание"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Введите описание"
          required
        />
      </div>

      {/* Дата */}
      <div>
        <Input
          type="date"
          label="Дата"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => setQuickDate(QUICK_DATE_TODAY)}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-border text-foreground hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Сегодня
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(QUICK_DATE_YESTERDAY)}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-border text-foreground hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Вчера
          </button>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/30">
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading
            ? isEditMode
              ? "Сохранение..."
              : "Сохранение..."
            : isEditMode
              ? "Сохранить"
              : "Добавить"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!loading) {
                onCancel();
              }
            }}
            disabled={loading}
          >
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
