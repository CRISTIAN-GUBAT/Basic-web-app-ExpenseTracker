'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from './transaction-form';
import { TransactionList } from './transaction-list';
import { SummaryCards } from './summary-cards';
import { MonthlyChart } from './monthly-chart';
import { ToastContainer } from './ui/toast';
import { ThemeToggle } from './ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Download, Wallet, Plus, BarChart3 } from 'lucide-react';
import { Transaction, Filters } from '@/types';
import { getStoredTransactions, saveTransactions, exportTransactions } from '@/lib/storage';
import { useToast } from '@/contexts/toast-context';

export function ExpenseTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    category: 'all',
    month: new Date().toISOString().slice(0, 7)
  });
  
  const { showToast } = useToast();

  useEffect(() => {
    const storedTransactions = getStoredTransactions();
    setTransactions(storedTransactions);
  }, []);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
      showToast(`"${transactionData.description}" added successfully!`, 'success');
    } catch (error) {
      showToast('Failed to add transaction!', 'error');
    }
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      const updatedTransactions = transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      );
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
      
      if (updates.description && updates.description !== transaction?.description) {
        showToast(`"${transaction?.description}" updated to "${updates.description}" successfully!`, 'info');
      } else {
        showToast(`"${transaction?.description}" updated successfully!`, 'info');
      }
    } catch (error) {
      showToast('Failed to update transaction!', 'error');
    }
  };

  const deleteTransaction = (id: string) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
      showToast(`"${transaction?.description}" deleted successfully!`, 'warning');
    } catch (error) {
      showToast('Failed to delete transaction!', 'error');
    }
  };

  const handleExport = () => {
    try {
      if (transactions.length === 0) {
        showToast('No transactions to export!', 'warning');
        return;
      }
      
      exportTransactions(transactions);
      showToast(`Exported ${transactions.length} transactions successfully!`, 'info');
    } catch (error) {
      showToast('Failed to export data!', 'error');
    }
  };

  const clearAllTransactions = () => {
    if (transactions.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete all ${transactions.length} transactions? This action cannot be undone.`)) {
      setTransactions([]);
      saveTransactions([]);
      showToast('All transactions cleared successfully!', 'warning');
    }
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl shadow-2xl mb-8 border border-white/10">
          <div className="px-8 py-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <Wallet className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    ExpenseTracker
                  </h1>
                  <p className="text-blue-100 text-sm mt-2 flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{transactions.length} transactions</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold">
                      Balance: ${transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                {transactions.length > 0 && (
                  <Button
                    onClick={clearAllTransactions}
                    className="bg-red-500/20 hover:bg-red-500/30 border-0 text-white backdrop-blur-sm"
                    variant="outline"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  onClick={handleExport}
                  className="bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-sm transition-all duration-200"
                  disabled={transactions.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <SummaryCards transactions={transactions} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-1">
            <TransactionForm onSubmit={addTransaction} />
          </div>

          {/* Middle and Right Columns */}
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MonthlyChart transactions={transactions} filters={filters} />
            <TransactionList
              transactions={transactions}
              filters={filters}
              onFiltersChange={setFilters}
              onEditTransaction={editTransaction}
              onDeleteTransaction={deleteTransaction}
              categories={categories}
            />
          </div>
        </div>

        {/* Quick Actions Footer */}
        {transactions.length === 0 && (
          <div className="text-center mt-12">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Start Tracking?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Add your first transaction to begin managing your finances. Track income, expenses, and watch your financial health improve!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}