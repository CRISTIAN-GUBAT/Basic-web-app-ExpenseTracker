'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types';
import { PlusCircle, DollarSign, Type, Calendar, Tag } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    onSubmit({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date
    });

    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('other');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const categories = {
    income: ['salary', 'freelance', 'investment', 'gift', 'other'],
    expense: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'healthcare', 'other']
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 dark:text-white flex items-center text-xl">
          <PlusCircle className="w-6 h-6 mr-2 text-blue-600" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium">
              <Type className="w-4 h-4 mr-2" />
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description..."
              className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-4 py-3 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium">
              <DollarSign className="w-4 h-4 mr-2" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl px-4 py-3 focus:border-blue-500 dark:focus:border-blue-400 transition-colors text-lg font-semibold"
              required
            />
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="type" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Type
              </Label>
              <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                <SelectTrigger className={`bg-white dark:bg-gray-700 border-2 ${
                  type === 'income' 
                    ? 'border-green-200 dark:border-green-800' 
                    : 'border-red-200 dark:border-red-800'
                } text-gray-900 dark:text-white rounded-xl px-4 py-3`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-0 shadow-2xl rounded-xl">
                  <SelectItem value="income" className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                    Income
                  </SelectItem>
                  <SelectItem value="expense" className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium">
                <Tag className="w-4 h-4 mr-2" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-0 shadow-2xl rounded-xl">
                  {(type === 'income' ? categories.income : categories.expense).map((cat) => (
                    <SelectItem 
                      key={cat} 
                      value={cat}
                      className="text-gray-900 dark:text-white capitalize hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 flex items-center text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}