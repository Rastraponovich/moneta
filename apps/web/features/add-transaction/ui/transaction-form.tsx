"use client";

import { useEffect, useState, useTransition } from "react";

import { Category } from "@/entities/category";
import { Transaction } from "@/entities/transaction";

import {
  createTransaction,
  updateTransaction,
} from "@/shared/actions/transactions";
import { Button, Input } from "@/shared/ui";

interface TransactionFormProps {
  initialTransaction?: Transaction;
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function TransactionForm({
  initialTransaction,
  onSuccess,
  onCancel,
  onLoadingChange,
}: TransactionFormProps) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

        onSuccess?.(transaction);
      } catch (err) {
        setError(
          isEditMode
            ? "Не удалось обновить транзакцию. Попробуйте еще раз."
            : "Не удалось создать транзакцию. Попробуйте еще раз."
        );
        console.error("Failed to save transaction:", err);
      } finally {
        onLoadingChange?.(false);
      }
    });
  }

  const filteredCategories = categories.filter((cat) => cat.type === type);

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600">Загрузка категорий...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Тип транзакции */}
      <div>
        <label className="block text-sm font-medium mb-2">Тип</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
              type === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Доход
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors min-h-[44px] ${
              type === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      {/* Категория */}
      <div>
        <label className="block text-sm font-medium mb-1">Категория</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          required
        >
          <option value="">Выберите категорию</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Описание */}
      <div>
        <Input
          type="text"
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Ошибка */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
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
