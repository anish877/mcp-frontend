import React, { JSX } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  Calendar,
  ArrowDownToLine,
  X,
  Loader
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define transaction types
type TransactionType = 'ADD_MONEY' | 'TRANSFER' | 'WITHDRAW' | 'PAYMENT' | 'REFUND';
type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

// Interface for transaction data
interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  createdAt: string;
  isIncoming?: boolean;
  fromUserId?: {
    _id: string;
    fullName: string;
  };
  toUserId?: {
    _id: string;
    fullName: string;
  };
  paymentId?: string;
  reference?: string;
}

// Props for the RecentTransactions component
interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll: (transactionId?: string) => void;
  loading?: boolean;
  maxItems?: number;
}

// Type definition for transaction type mapping
interface TransactionTypeInfo {
  label: string;
  icon: React.ElementType;
  colorClass: string;
}

// Type definition for status mapping
interface StatusInfo {
  badgeVariant: 'warning' | 'success' | 'destructive' | 'secondary';
  icon: React.ElementType;
}

// Map transaction types to UI labels and icons
const transactionTypeMap: Record<TransactionType, TransactionTypeInfo> = {
  'ADD_MONEY': { label: 'Added to Wallet', icon: ArrowDownRight, colorClass: 'text-mcp-green bg-mcp-green/10' },
  'TRANSFER': { label: 'Transfer', icon: ArrowUpRight, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'WITHDRAW': { label: 'Withdraw', icon: ArrowDownToLine, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'PAYMENT': { label: 'Payment', icon: ArrowUpRight, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'REFUND': { label: 'Refund', icon: ArrowDownRight, colorClass: 'text-mcp-green bg-mcp-green/10' }
};

// Map transaction status to UI components
const statusMap: Record<TransactionStatus, StatusInfo> = {
  'PENDING': { badgeVariant: 'warning', icon: Clock },
  'COMPLETED': { badgeVariant: 'success', icon: CheckCircle },
  'FAILED': { badgeVariant: 'destructive', icon: X }
};

export function RecentTransactions({ 
  transactions = [], 
  onViewAll, 
  loading = false, 
  maxItems = 5 
}: RecentTransactionsProps): JSX.Element {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate time difference in hours
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const days = Math.floor(diffHours / 24);
      return days === 1 ? '1d ago' : `${days}d ago`;
    }
  };

  // Get transaction icon and color based on type
  const getTransactionTypeInfo = (type: string): TransactionTypeInfo => {
    return transactionTypeMap[type as TransactionType] || { 
      label: type, 
      icon: ArrowUpRight, 
      colorClass: 'text-primary bg-primary/10'
    };
  };

  // Get status badge properties
  const getStatusInfo = (status: string): StatusInfo => {
    return statusMap[status as TransactionStatus] || { 
      badgeVariant: 'secondary', 
      icon: Calendar 
    };
  };

  // Determine if the transaction is incoming or outgoing for the user
  const getTransactionDirection = (transaction: Transaction): 'credit' | 'debit' => {
    return transaction.isIncoming || ['ADD_MONEY', 'REFUND'].includes(transaction.type) ? 'credit' : 'debit';
  };
  
  // Show only the requested number of transactions
  const displayedTransactions = transactions.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activities</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewAll()}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : displayedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            displayedTransactions.map((transaction) => {
              const TypeIcon = getTransactionTypeInfo(transaction.type).icon;
              const StatusIcon = getStatusInfo(transaction.status).icon;
              const direction = getTransactionDirection(transaction);
              
              return (
                <div 
                  key={transaction._id} 
                  className="flex items-center justify-between py-3 hover:bg-muted/50 rounded-md px-2 cursor-pointer"
                  onClick={() => onViewAll(transaction._id)}
                >
                  <div className="flex items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      getTransactionTypeInfo(transaction.type).colorClass
                    }`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {transaction.description || getTransactionTypeInfo(transaction.type).label}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{formatDate(transaction.createdAt)}</span>
                        <Badge 
                          variant={getStatusInfo(transaction.status).badgeVariant} 
                          className="ml-2 py-0 h-5 text-xs flex items-center gap-1"
                        >
                          <StatusIcon className="h-3 w-3" />
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    direction === 'credit' 
                      ? 'text-mcp-green' 
                      : 'text-mcp-red'
                  }`}>
                    {direction === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}