'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Filters } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, Filter, Search, Plus } from 'lucide-react';
import { EditTransactionModal } from './edit-transaction-modal';

interface TransactionListProps {
  transactions: Transaction[];
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onEditTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  categories: string[];
}

export function TransactionList({
  transactions,
  filters,
  onFiltersChange,
  onEditTransaction,
  onDeleteTransaction,
  categories
}: TransactionListProps) {
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== 'all' && transaction.type !== filters.type) return false;
    if (filters.category !== 'all' && transaction.category !== filters.category) return false;
    if (filters.month && !transaction.date.startsWith(filters.month)) return false;
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleEditClick = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (id: string, updates: Partial<Transaction>) => {
    onEditTransaction(id, updates);
    setIsEditModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    if (window.confirm(`Are you sure you want to delete "${transaction.description}" for $${transaction.amount}?`)) {
      onDeleteTransaction(transaction.id);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      category: 'all',
      month: new Date().toISOString().slice(0, 7)
    });
    setSearchTerm('');
  };

  const hasActiveFilters = filters.type !== 'all' || filters.category !== 'all' || searchTerm;

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Transactions
          </CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} of {transactions.length}
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select
                value={filters.type}
                onValueChange={(value) => onFiltersChange({ ...filters, type: value as any })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-white">All Types</SelectItem>
                  <SelectItem value="income" className="text-gray-900 dark:text-white">Income</SelectItem>
                  <SelectItem value="expense" className="text-gray-900 dark:text-white">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-white">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-gray-900 dark:text-white capitalize"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Input
                  type="month"
                  value={filters.month}
                  onChange={(e) => onFiltersChange({ ...filters, month: e.target.value })}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
                />
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <ArrowDownCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize flex items-center space-x-2">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className={`text-lg font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(transaction)}
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(transaction)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-lg font-medium mb-2">
                  {transactions.length === 0 ? 'No transactions yet' : 'No transactions found'}
                </div>
                <div className="text-sm mb-4">
                  {transactions.length === 0 
                    ? 'Get started by adding your first transaction!' 
                    : 'Try adjusting your filters or search term'
                  }
                </div>
                {transactions.length === 0 && (
                  <Plus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                )}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={transactionToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTransactionToEdit(null);
        }}
        onSave={handleSaveEdit}
      />
    </>
  );
}