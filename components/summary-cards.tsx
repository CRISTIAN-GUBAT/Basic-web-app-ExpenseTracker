'use client';

import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-white text-sm font-medium">
            Total Balance
          </CardTitle>
          <Wallet className="h-5 w-5 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1">
            ${totalBalance.toFixed(2)}
          </div>
          <p className="text-blue-100 text-xs">
            {transactionCount} transactions
          </p>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-white text-sm font-medium">
            Total Income
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1">
            ${totalIncome.toFixed(2)}
          </div>
          <p className="text-green-100 text-xs">
            {transactions.filter(t => t.type === 'income').length} income transactions
          </p>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-white text-sm font-medium">
            Total Expenses
          </CardTitle>
          <TrendingDown className="h-5 w-5 text-red-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1">
            ${totalExpenses.toFixed(2)}
          </div>
          <p className="text-red-100 text-xs">
            {transactions.filter(t => t.type === 'expense').length} expense transactions
          </p>
        </CardContent>
      </Card>

      {/* Transactions Count */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-white text-sm font-medium">
            Total Transactions
          </CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-purple-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-1">
            {transactionCount}
          </div>
          <p className="text-purple-100 text-xs">
            All time transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}