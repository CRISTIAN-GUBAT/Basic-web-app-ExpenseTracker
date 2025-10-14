export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: string;
}

export interface Filters {
  type: 'all' | 'income' | 'expense';
  category: string;
  month: string;
}