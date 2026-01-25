export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

export interface Balance {
  total: number;
  income: number;
  expenses: number;
  period: {
    start: string;
    end: string;
  };
}
