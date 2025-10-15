'use client';

import { Transaction, Filters } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, PieChart, BarChart3 } from 'lucide-react';

interface MonthlyChartProps {
  transactions: Transaction[];
  filters: Filters;
}

export function MonthlyChart({ transactions, filters }: MonthlyChartProps) {
  // Use filters to avoid unused parameter warning
  const activeMonth = filters.month;
  
  // Group transactions by month and calculate totals
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.slice(0, 7); // YYYY-MM format
    if (!acc[month]) {
      acc[month] = { 
        income: 0, 
        expenses: 0,
        transactions: 0
      };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    acc[month].transactions += 1;
    
    return acc;
  }, {} as Record<string, { income: number; expenses: number; transactions: number }>);

  // Current month stats - use activeMonth from filters if available, otherwise current month
  const currentMonth = activeMonth || new Date().toISOString().slice(0, 7);
  const currentMonthData = monthlyData[currentMonth] || { income: 0, expenses: 0, transactions: 0 };
  const currentMonthBalance = currentMonthData.income - currentMonthData.expenses;
  const savingsRate = currentMonthData.income > 0 ? (currentMonthBalance / currentMonthData.income) * 100 : 0;

  // Total stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const totalSavingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0;

  // Category breakdown for current month
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const expenseByCategory = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpensesAmount = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalIncomeAmount = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <PieChart className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Add transactions to see financial insights
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Month Overview with Progress Bars */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {activeMonth ? 'Selected Month' : 'Current Month'} ({new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
              </h3>
              
              {/* Income vs Expenses Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-600 dark:text-green-400 font-medium">Income</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ${currentMonthData.income.toFixed(2)} • {currentMonthData.income > 0 ? '100%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${currentMonthData.income > 0 ? Math.min(100, (currentMonthData.income / (currentMonthData.income + currentMonthData.expenses)) * 100) : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-red-600 dark:text-red-400 font-medium">Expenses</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    ${currentMonthData.expenses.toFixed(2)} • {currentMonthData.income > 0 ? ((currentMonthData.expenses / currentMonthData.income) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${currentMonthData.income > 0 ? Math.min(100, (currentMonthData.expenses / currentMonthData.income) * 100) : 0}%` 
                    }}
                  />
                </div>
              </div>

              {/* Balance and Savings Rate */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${
                    currentMonthBalance >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ${currentMonthBalance.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Balance</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${
                    savingsRate >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {savingsRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Savings Rate</div>
                </div>
              </div>
            </div>

            {/* Expense Breakdown by Category */}
            {totalExpensesAmount > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <PieChart className="w-4 h-4 mr-2" />
                  Expense Breakdown
                </h4>
                <div className="space-y-3">
                  {Object.entries(expenseByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage = (amount / totalExpensesAmount) * 100;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {category}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400 w-16 text-right">
                              ${amount.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Income Breakdown by Category */}
            {totalIncomeAmount > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Income Sources
                </h4>
                <div className="space-y-3">
                  {Object.entries(incomeByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage = (amount / totalIncomeAmount) * 100;
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {category}
                          </span>
                          <div className="flex items-center space-x-3">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400 w-16 text-right">
                              ${amount.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Overall Financial Health */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-center">
                Overall Financial Health
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${totalIncome.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Income</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    ${totalExpenses.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Expenses</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${
                    totalSavingsRate >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {totalSavingsRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Savings Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
