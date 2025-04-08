
import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'completed' | 'pending';
};

// Mock data for transactions
const transactions: Transaction[] = [
  {
    id: '1',
    description: 'Added funds via UPI',
    amount: 5000,
    type: 'credit',
    date: '2h ago',
    status: 'completed',
  },
  {
    id: '2',
    description: 'Transfer to Rahul Sharma',
    amount: 1500,
    type: 'debit',
    date: '5h ago',
    status: 'completed',
  },
  {
    id: '3',
    description: 'Withdrawal to bank account',
    amount: 2000,
    type: 'debit',
    date: '1d ago',
    status: 'completed',
  },
  {
    id: '4',
    description: 'Added funds via bank transfer',
    amount: 10000,
    type: 'credit',
    date: '2d ago',
    status: 'completed',
  },
  {
    id: '5',
    description: 'Transfer to Priya Patel',
    amount: 800,
    type: 'debit',
    date: '2d ago',
    status: 'pending',
  },
];

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activities</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  transaction.type === 'credit' 
                    ? 'bg-mcp-green/10 text-mcp-green' 
                    : 'bg-mcp-red/10 text-mcp-red'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{transaction.date}</span>
                    {transaction.status === 'pending' && (
                      <div className="flex items-center ml-2 text-mcp-yellow">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={`font-medium ${
                transaction.type === 'credit' 
                  ? 'text-mcp-green' 
                  : 'text-mcp-red'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
