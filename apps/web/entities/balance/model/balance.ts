export interface Balance {
  total: number;
  income: number;
  expenses: number;
  period: {
    start: string;
    end: string;
  };
}
