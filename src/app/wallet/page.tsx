"use client";
import React, { useState } from 'react';
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
  DialogTrigger 
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
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock transaction data
type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  partner?: string;
};

const transactionsData: Transaction[] = [
  {
    id: '1',
    description: 'Added funds via UPI',
    amount: 5000,
    type: 'credit',
    date: '2023-04-06 14:30',
    status: 'completed',
  },
  {
    id: '2',
    description: 'Transfer to Rahul Sharma',
    amount: 1500,
    type: 'debit',
    date: '2023-04-06 10:15',
    status: 'completed',
    partner: 'Rahul Sharma',
  },
  {
    id: '3',
    description: 'Withdrawal to bank account',
    amount: 2000,
    type: 'debit',
    date: '2023-04-05 16:45',
    status: 'completed',
  },
  {
    id: '4',
    description: 'Added funds via bank transfer',
    amount: 10000,
    type: 'credit',
    date: '2023-04-04 09:20',
    status: 'completed',
  },
  {
    id: '5',
    description: 'Transfer to Priya Patel',
    amount: 800,
    type: 'debit',
    date: '2023-04-04 11:30',
    status: 'pending',
    partner: 'Priya Patel',
  },
  {
    id: '6',
    description: 'Withdrawal attempt',
    amount: 3000,
    type: 'debit',
    date: '2023-04-03 15:10',
    status: 'failed',
  },
  {
    id: '7',
    description: 'Added funds via UPI',
    amount: 2500,
    type: 'credit',
    date: '2023-04-02 13:45',
    status: 'completed',
  },
  {
    id: '8',
    description: 'Transfer to Amit Kumar',
    amount: 1200,
    type: 'debit',
    date: '2023-04-01 10:00',
    status: 'completed',
    partner: 'Amit Kumar',
  },
  {
    id: '9',
    description: 'Added funds via credit card',
    amount: 7500,
    type: 'credit',
    date: '2023-03-30 14:15',
    status: 'completed',
  },
  {
    id: '10',
    description: 'Withdrawal to bank account',
    amount: 5000,
    type: 'debit',
    date: '2023-03-28 16:30',
    status: 'completed',
  },
];

const Wallet = () => {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = transactionsData.filter(transaction => {
    // Apply type filter
    if (filter !== 'all' && transaction.type !== filter) return false;
    
    // Apply search filter
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
                    <p className="text-3xl font-bold mt-2">₹45,600</p>
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
                              Select a payment method to add funds to your wallet.
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs defaultValue="upi" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="upi">UPI</TabsTrigger>
                              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                              <TabsTrigger value="card">Card</TabsTrigger>
                            </TabsList>
                            <TabsContent value="upi" className="py-4">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" type="number" placeholder="Enter amount" className="mt-1" />
                                </div>
                                <div className="flex justify-center py-4">
                                  <div className="p-4 bg-muted rounded-lg">
                                    <QrCode className="h-32 w-32 mx-auto text-primary" />
                                    <p className="text-sm text-center mt-2">Scan to pay</p>
                                  </div>
                                </div>
                                <Button className="w-full">Pay Now</Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="bank" className="py-4">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" type="number" placeholder="Enter amount" className="mt-1" />
                                </div>
                                <div className="p-4 bg-muted rounded-lg space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Account Name</span>
                                    <span className="text-sm font-medium">MCP Nexus Ltd</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Account Number</span>
                                    <span className="text-sm font-medium">1234567890</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">IFSC Code</span>
                                    <span className="text-sm font-medium">ABCD0001234</span>
                                  </div>
                                </div>
                                <Button className="w-full">I've Transferred the Amount</Button>
                              </div>
                            </TabsContent>
                            <TabsContent value="card" className="py-4">
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="amount">Amount</Label>
                                  <Input id="amount" type="number" placeholder="Enter amount" className="mt-1" />
                                </div>
                                <div>
                                  <Label htmlFor="card">Card Number</Label>
                                  <Input id="card" placeholder="XXXX XXXX XXXX XXXX" className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input id="cvv" placeholder="XXX" className="mt-1" />
                                  </div>
                                </div>
                                <Button className="w-full">Pay Now</Button>
                              </div>
                            </TabsContent>
                          </Tabs>
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
                
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total In</p>
                          <p className="text-xl font-bold text-mcp-green">+₹25,000</p>
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
                          <p className="text-xl font-bold text-mcp-red">-₹14,500</p>
                        </div>
                        <div className="p-2 bg-mcp-red/10 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-mcp-red" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Partners Funded</p>
                          <p className="text-xl font-bold">₹8,300</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full">
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pending Transactions</p>
                          <p className="text-xl font-bold text-mcp-yellow">₹800</p>
                        </div>
                        <div className="p-2 bg-mcp-yellow/10 rounded-full">
                          <Clock className="h-5 w-5 text-mcp-yellow" />
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
                
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="credit">Credits</SelectItem>
                    <SelectItem value="debit">Debits</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Description</th>
                    <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Amount</th>
                    <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Date</th>
                    <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
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
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.partner && (
                              <p className="text-sm text-muted-foreground">To: {transaction.partner}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          transaction.type === 'credit' 
                            ? 'text-mcp-green' 
                            : 'text-mcp-red'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{new Date(transaction.date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          transaction.status === 'completed' 
                            ? 'success' 
                            : transaction.status === 'pending' 
                              ? 'warning' 
                              : 'destructive'
                        }>
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : transaction.status === 'pending' ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Showing 1-10 of 50 transactions</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Wallet;