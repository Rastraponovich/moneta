import { Balance, Category, Transaction } from "../api/types";

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Зарплата",
    type: "income",
    color: "#10b981",
    icon: "Wallet",
  },
  {
    id: "2",
    name: "Продукты",
    type: "expense",
    color: "#ef4444",
    icon: "ShoppingCart",
  },
  {
    id: "3",
    name: "Транспорт",
    type: "expense",
    color: "#3b82f6",
    icon: "Car",
  },
  {
    id: "4",
    name: "Развлечения",
    type: "expense",
    color: "#8b5cf6",
    icon: "Film",
  },
  {
    id: "5",
    name: "Здоровье",
    type: "expense",
    color: "#f59e0b",
    icon: "Heart",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 100000,
    type: "income",
    category: "Зарплата",
    description: "Зарплата за январь",
    date: "2026-01-01",
  },
  {
    id: "2",
    amount: 5000,
    type: "expense",
    category: "Продукты",
    description: "Покупки в магазине",
    date: "2026-01-05",
  },
  {
    id: "3",
    amount: 2000,
    type: "expense",
    category: "Транспорт",
    description: "Бензин",
    date: "2026-01-10",
  },
  {
    id: "4",
    amount: 3000,
    type: "expense",
    category: "Развлечения",
    description: "Кино",
    date: "2026-01-15",
  },
  {
    id: "5",
    amount: 1500,
    type: "expense",
    category: "Здоровье",
    description: "Аптека",
    date: "2026-01-20",
  },
  {
    id: "6",
    amount: 2500,
    type: "expense",
    category: "Продукты",
    description: "Овощи и фрукты",
    date: "2026-01-06",
  },
  {
    id: "7",
    amount: 1500,
    type: "expense",
    category: "Транспорт",
    description: "Такси",
    date: "2026-01-12",
  },
  {
    id: "8",
    amount: 2000,
    type: "expense",
    category: "Развлечения",
    description: "Концерт",
    date: "2026-01-18",
  },
  {
    id: "9",
    amount: 800,
    type: "expense",
    category: "Здоровье",
    description: "Витамины",
    date: "2026-01-22",
  },
  {
    id: "10",
    amount: 3200,
    type: "expense",
    category: "Продукты",
    description: "Супермаркет",
    date: "2026-01-25",
  },
];

export const mockBalance: Balance = {
  total: 78500,
  income: 100000,
  expenses: 21500,
  period: {
    start: "2026-01-01",
    end: "2026-01-31",
  },
};
