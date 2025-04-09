"use client";
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  PlusCircle, 
  ArrowDownToLine, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  CreditCard,
  Landmark,
  QrCode,
  Clock,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
  Download,
  FileText,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

// Map transaction types to UI labels and icons
const transactionTypeMap = {
  'ADD_MONEY': { label: 'Added to Wallet', icon: ArrowDownRight, colorClass: 'text-mcp-green bg-mcp-green/10' },
  'TRANSFER': { label: 'Transfer', icon: ArrowUpRight, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'WITHDRAW': { label: 'Withdraw', icon: ArrowDownToLine, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'PAYMENT': { label: 'Payment', icon: ArrowUpRight, colorClass: 'text-mcp-red bg-mcp-red/10' },
  'REFUND': { label: 'Refund', icon: ArrowDownRight, colorClass: 'text-mcp-green bg-mcp-green/10' }
};

// Map transaction status to UI components
const statusMap = {
  'PENDING': { badgeVariant: 'warning', icon: Clock },
  'COMPLETED': { badgeVariant: 'success', icon: CheckCircle },
  'FAILED': { badgeVariant: 'destructive', icon: X }
};

const Wallet = () => {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactionType, setTransactionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [summaryPeriod, setSummaryPeriod] = useState('month');
  const [transactionSummary, setTransactionSummary] = useState({
    received: { total: 0, breakdown: [] },
    sent: { total: 0, breakdown: [] },
    netFlow: 0
  });
  
  // Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const fetchBalance = async () => {
    try {
      const walletbalance = await axios.get(`${BACKEND_URL}/wallet/balance`, {withCredentials: true});
      setBalance(walletbalance.data.data.balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet balance",
        variant: "destructive"
      });
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      
      if (transactionType !== 'all') {
        params.append('type', transactionType);
      }
      
      if (searchTerm) {
        // If backend supports description search
        params.append('description', searchTerm);
      }
      const response = await axios.get(`${BACKEND_URL}/wallet/transaction?${params.toString()}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setTotalPages(response.data.data.pagination.pages);
        setTotalTransactions(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionSummary = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/wallet/transaction/summary?period=${summaryPeriod}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTransactionSummary(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching transaction summary:", error);
    }
  };

  const fetchTransactionDetails = async (transactionId: any) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/wallet/transaction/${transactionId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSelectedTransaction(response.data.data);
        setIsTransactionDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transaction details",
        variant: "destructive"
      });
    }
  };

  const exportTransactions = async () => {
    try {
      const params = new URLSearchParams();
      params.append('format', 'json');
      
      // Add any filters
      if (transactionType !== 'all') {
        params.append('type', transactionType);
      }
      
      const response = await axios.get(`${BACKEND_URL}/wallet/transaction/export?${params.toString()}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `transactions-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast({
          title: "Success",
          description: "Transactions exported successfully",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast({
        title: "Error",
        description: "Failed to export transactions",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    fetchTransactionSummary();
  }, [currentPage, transactionType, summaryPeriod]);

  useEffect(() => {
    // Reset to first page when changing filters
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchTransactions();
    }
  }, [searchTerm, transactionType]);
  
  // Process payment using Razorpay
  const handleRazorpayPayment = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Step 1: Create Razorpay order
      const orderResponse = await axios.post(
        `${BACKEND_URL}/wallet/razorpay/create-order`, 
        { amount }, 
        { withCredentials: true }
      );
      
      const { orderId, key, amount: amountInPaise, currency, transactionId, user } = orderResponse.data.data;
      
      // Step 2: Open Razorpay checkout
      const options = {
        key,
        amount: amountInPaise,
        currency,
        name: "MCP Nexus",
        description: "Wallet Fund Addition",
        order_id: orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.contact
        },
        theme: {
          color: "#3399cc"
        },
        handler: async function(response: any) {
          try {
            // Step 3: Verify payment
            console.log(response)
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId
            };
            
            const verifyResponse = await axios.post(
              `${BACKEND_URL}/wallet/razorpay/verify-payment`,
              paymentData,
              { withCredentials: true }
            );
            
            if (verifyResponse.data.success) {
              toast({
                title: "Payment Successful",
                description: `₹${amount} has been added to your wallet`,
                variant: "success"
              });
              
              // Update wallet balance and close dialog
              setBalance(verifyResponse.data.data.newBalance);
              setIsAddFundsOpen(false);
              setAmount('');
              fetchTransactions();
              fetchTransactionSummary();
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment",
              variant: "destructive"
            });
          }
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              variant: "default"
            });
            setIsProcessing(false);
          }
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast({
        title: "Error",
        description: "Failed to process payment request",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get transaction icon and color based on type
  const getTransactionTypeInfo = (type: string | number) => {
    return transactionTypeMap[type] || { 
      label: type, 
      icon: ArrowUpRight, 
      colorClass: 'text-primary bg-primary/10'
    };
  };

  // Get status badge properties
  const getStatusInfo = (status) => {
    return statusMap[status] || { 
      badgeVariant: 'secondary', 
      icon: Info 
    };
  };

  // Determine if the transaction is incoming or outgoing for the user
  const getTransactionDirection = (transaction) => {
    // This assumes the backend would include whether the current user is the receiver
    return transaction.isIncoming ? 'credit' : 'debit';
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-1">Manage your funds and transactions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Summary Card */}
          <Card className="md:col-span-2 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>Wallet Summary</CardTitle>
              <CardDescription>Your current balance and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center p-6 bg-primary/10 rounded-lg">
                    <h3 className="text-lg font-medium text-muted-foreground">Current Balance</h3>
                    <p className="text-3xl font-bold mt-2">₹{balance}</p>
                    <div className="flex gap-2 mt-4">
                      <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add Funds</DialogTitle>
                            <DialogDescription>
                              Add money to your wallet using Razorpay.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="amount">Amount (₹)</Label>
                              <Input 
                                id="amount" 
                                type="number" 
                                placeholder="Enter amount" 
                                className="mt-1" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You will be redirected to Razorpay to complete the payment.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setIsAddFundsOpen(false)}
                              disabled={isProcessing}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleRazorpayPayment}
                              disabled={isProcessing || !amount || amount <= 0}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Pay Now'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ArrowDownToLine className="h-4 w-4 mr-1" />
                            Withdraw
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Withdraw Funds</DialogTitle>
                            <DialogDescription>
                              Enter the details to withdraw funds to your bank account.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="withdraw-amount">Amount</Label>
                              <Input id="withdraw-amount" type="number" placeholder="Enter amount" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="bank-account">Select Bank Account</Label>
                              <Select>
                                <SelectTrigger id="bank-account" className="mt-1">
                                  <SelectValue placeholder="Select bank account" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hdfc">HDFC Bank - XX1234</SelectItem>
                                  <SelectItem value="sbi">SBI - XX5678</SelectItem>
                                  <SelectItem value="icici">ICICI Bank - XX9012</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="remarks">Remarks (Optional)</Label>
                              <Input id="remarks" placeholder="Add remarks" className="mt-1" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsWithdrawOpen(false)}>
                              Withdraw
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                {/* Summary stats from API */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Quick Stats</h4>
                    <Select value={summaryPeriod} onValueChange={setSummaryPeriod}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total In</p>
                          <p className="text-xl font-bold text-mcp-green">+₹{transactionSummary.received.total}</p>
                        </div>
                        <div className="p-2 bg-mcp-green/10 rounded-full">
                          <ArrowDownRight className="h-5 w-5 text-mcp-green" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Out</p>
                          <p className="text-xl font-bold text-mcp-red">-₹{transactionSummary.sent.total}</p>
                        </div>
                        <div className="p-2 bg-mcp-red/10 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-mcp-red" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Net Flow</p>
                          <p className={`text-xl font-bold ${transactionSummary.netFlow >= 0 ? 'text-mcp-green' : 'text-mcp-red'}`}>
                            {transactionSummary.netFlow >= 0 ? '+' : ''}₹{Math.abs(transactionSummary.netFlow)}
                          </p>
                        </div>
                        <div className={`p-2 rounded-full ${transactionSummary.netFlow >= 0 ? 'bg-mcp-green/10' : 'bg-mcp-red/10'}`}>
                          {transactionSummary.netFlow >= 0 ? (
                            <ArrowDownRight className="h-5 w-5 text-mcp-green" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-mcp-red" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                          <p className="text-xl font-bold">{totalTransactions}</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Methods Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-border rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">HDFC Credit Card</p>
                    <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                
                <div className="p-3 border border-border rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-muted-foreground">mcp@ybl</p>
                  </div>
                </div>
                
                <div className="p-3 border border-border rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">SBI Bank Account</p>
                    <p className="text-sm text-muted-foreground">**** 5678</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent transactions and payment history</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center max-w-sm relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search transactions..." 
                    className="pl-9 w-[200px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ADD_MONEY">Add Money</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="WITHDRAW">Withdraw</SelectItem>
                    <SelectItem value="PAYMENT">Payment</SelectItem>
                    <SelectItem value="REFUND">Refund</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setTransactionType('all');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon" onClick={exportTransactions}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Transaction table */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Description</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Amount</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Date</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                      <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const TypeIcon = getTransactionTypeInfo(transaction.type).icon;
                      const StatusIcon = getStatusInfo(transaction.status).icon;
                      const direction = getTransactionDirection(transaction);
                      
                      return (
                        <tr key={transaction._id} className="border-b border-border hover:bg-muted/50 cursor-pointer" 
                            onClick={() => fetchTransactionDetails(transaction._id)}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                getTransactionTypeInfo(transaction.type).colorClass
                              }`}>
                                <TypeIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {transaction.description || getTransactionTypeInfo(transaction.type).label}
                                </p>
                                {transaction.toUserId && transaction.toUserId.fullName && direction === 'debit' && (
                                  <p className="text-sm text-muted-foreground">To: {transaction.toUserId.fullName}</p>
                                )}
                                {transaction.fromUserId && transaction.fromUserId.fullName && direction === 'credit' && (
                                  <p className="text-sm text-muted-foreground">From: {transaction.fromUserId.fullName}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${
                              direction === 'credit' 
                                ? 'text-mcp-green' 
                                : 'text-mcp-red'
                            }`}>
                              {direction === 'credit' ? '+' : '-'}₹{transaction.amount}
                            </span>
                          </td>
                          <td className="py-3 px-4">
  <div className="flex items-center">
    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
    <span className="text-sm">{formatDate(transaction.createdAt)}</span>
  </div>
</td>
<td className="py-3 px-4">
  <Badge variant={getStatusInfo(transaction.status).badgeVariant} className="flex items-center gap-1.5">
    <StatusIcon className="h-3 w-3" />
    {transaction.status}
  </Badge>
</td>
<td className="py-3 px-4">
  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
    <ChevronRight className="h-4 w-4" />
  </Button>
</td>
</tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            {transactions.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalTransactions)} of {totalTransactions} transactions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction Details Dialog */}
      <Dialog open={isTransactionDetailsOpen} onOpenChange={setIsTransactionDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4 py-2">
              {/* Transaction status */}
              <div className="flex justify-center">
                <Badge
                  variant={getStatusInfo(selectedTransaction.status).badgeVariant}
                  className="text-base py-1.5 px-3 flex items-center gap-2"
                >
                  {React.createElement(getStatusInfo(selectedTransaction.status).icon, { className: "h-4 w-4" })}
                  {selectedTransaction.status}
                </Badge>
              </div>
              
              {/* Amount and type */}
              <div className="flex flex-col items-center justify-center py-3">
                <p className="text-sm text-muted-foreground">
                  {getTransactionTypeInfo(selectedTransaction.type).label}
                </p>
                <p className={`text-3xl font-bold mt-1 ${
                  getTransactionDirection(selectedTransaction) === 'credit' 
                    ? 'text-mcp-green' 
                    : 'text-mcp-red'
                }`}>
                  {getTransactionDirection(selectedTransaction) === 'credit' ? '+' : '-'}
                  ₹{selectedTransaction.amount}
                </p>
              </div>
              
              {/* Details table */}
              <div className="border rounded-lg divide-y">
                <div className="flex py-3 px-4">
                  <span className="w-1/3 text-sm font-medium text-muted-foreground">Transaction ID</span>
                  <span className="w-2/3 text-sm font-mono">{selectedTransaction._id}</span>
                </div>
                
                <div className="flex py-3 px-4">
                  <span className="w-1/3 text-sm font-medium text-muted-foreground">Date & Time</span>
                  <span className="w-2/3 text-sm">{formatDate(selectedTransaction.createdAt)}</span>
                </div>
                
                {selectedTransaction.description && (
                  <div className="flex py-3 px-4">
                    <span className="w-1/3 text-sm font-medium text-muted-foreground">Description</span>
                    <span className="w-2/3 text-sm">{selectedTransaction.description}</span>
                  </div>
                )}
                
                {selectedTransaction.fromUserId && selectedTransaction.fromUserId.fullName && (
                  <div className="flex py-3 px-4">
                    <span className="w-1/3 text-sm font-medium text-muted-foreground">From</span>
                    <span className="w-2/3 text-sm">{selectedTransaction.fromUserId.fullName}</span>
                  </div>
                )}
                
                {selectedTransaction.toUserId && selectedTransaction.toUserId.fullName && (
                  <div className="flex py-3 px-4">
                    <span className="w-1/3 text-sm font-medium text-muted-foreground">To</span>
                    <span className="w-2/3 text-sm">{selectedTransaction.toUserId.fullName}</span>
                  </div>
                )}
                
                {selectedTransaction.paymentId && (
                  <div className="flex py-3 px-4">
                    <span className="w-1/3 text-sm font-medium text-muted-foreground">Payment ID</span>
                    <span className="w-2/3 text-sm font-mono">{selectedTransaction.paymentId}</span>
                  </div>
                )}
                
                {selectedTransaction.reference && (
                  <div className="flex py-3 px-4">
                    <span className="w-1/3 text-sm font-medium text-muted-foreground">Reference</span>
                    <span className="w-2/3 text-sm">{selectedTransaction.reference}</span>
                  </div>
                )}
              </div>
              
              {/* Receipt button */}
              <div className="flex justify-center pt-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Wallet;