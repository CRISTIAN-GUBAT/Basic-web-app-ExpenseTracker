import { Transaction } from '@/types';

const STORAGE_KEY = 'expense-tracker-transactions';

export const getStoredTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions from storage:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions to storage:', error);
  }
};

export const exportTransactions = (transactions: Transaction[]): void => {
  const csvContent = [
    ['Date', 'Description', 'Category', 'Type', 'Amount'],
    ...transactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount.toString()
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};