"use client";

import { useEffect, useState } from "react";

import { Category } from "@/entities/category";
import { Transaction } from "@/entities/transaction";
import { Button, Input } from "@/shared/ui";

interface AddTransactionFormProps {
  onSuccess?: (transaction: Transaction) => void;
  onCancel?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function AddTransactionForm({
  onSuccess,
  onCancel,
  onLoadingChange,
}: AddTransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Загружаем категории
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data: Category[]) => {
        setCategories(data);
        if (data.length > 0) {
          // Устанавливаем первую категорию выбранного типа по умолчанию
          const defaultCategory = data.find((cat) => cat.type === type);
          if (defaultCategory) {
            setCategory(defaultCategory.name);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
        setError("Не удалось загрузить категории");
      })
      .finally(() => {
        setLoadingCategories(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновляем категорию при изменении типа
  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategory = categories.find((cat) => cat.type === type);
      if (defaultCategory) {
        setCategory(defaultCategory.name);
      } else {
        setCategory("");
      }
    }
  }, [type, categories]);

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

    setLoading(true);
    onLoadingChange?.(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          description: description.trim(),
          date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const newTransaction: Transaction = await response.json();

      // Сброс формы
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      const defaultCategory = categories.find((cat) => cat.type === type);
      if (defaultCategory) {
        setCategory(defaultCategory.name);
      }

      onSuccess?.(newTransaction);
    } catch (err) {
      setError("Не удалось создать транзакцию. Попробуйте еще раз.");
      console.error("Failed to create transaction:", err);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
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
          {loading ? "Сохранение..." : "Добавить"}
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
