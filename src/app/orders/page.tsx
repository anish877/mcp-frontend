"use client";
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Package, 
  Check, 
  Clock, 
  TrendingUp,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: 'pending' | 'in progress' | 'completed' | 'cancelled';
  amount: number;
  date: string;
  partner?: {
    id: string;
    name: string;
  };
};

const ordersData: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001234',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 9876543210',
    address: '42, Park Street, Kolkata',
    status: 'completed',
    amount: 1250,
    date: '2023-04-06 14:30',
    partner: {
      id: '1',
      name: 'Rahul Sharma',
    },
  },
  {
    id: '2',
    orderNumber: 'ORD-001235',
    customerName: 'Aisha Khan',
    customerPhone: '+91 8765432109',
    address: '15, MG Road, Bangalore',
    status: 'in progress',
    amount: 850,
    date: '2023-04-06 11:45',
    partner: {
      id: '2',
      name: 'Priya Patel',
    },
  },
  {
    id: '3',
    orderNumber: 'ORD-001236',
    customerName: 'Ravi Kumar',
    customerPhone: '+91 7654321098',
    address: 'Flat 203, Tower B, Mumbai',
    status: 'pending',
    amount: 2100,
    date: '2023-04-06 10:15',
  },
  {
    id: '4',
    orderNumber: 'ORD-001237',
    customerName: 'Sneha Reddy',
    customerPhone: '+91 6543210987',
    address: '78, Jubilee Hills, Hyderabad',
    status: 'pending',
    amount: 1700,
    date: '2023-04-06 09:30',
  },
  {
    id: '5',
    orderNumber: 'ORD-001238',
    customerName: 'Mohammed Ali',
    customerPhone: '+91 9876543211',
    address: '24, Fraser Town, Bangalore',
    status: 'cancelled',
    amount: 950,
    date: '2023-04-05 16:20',
  },
  {
    id: '6',
    orderNumber: 'ORD-001239',
    customerName: 'Kavita Singh',
    customerPhone: '+91 8765432108',
    address: '56, Civil Lines, Delhi',
    status: 'completed',
    amount: 1500,
    date: '2023-04-05 14:45',
    partner: {
      id: '4',
      name: 'Neha Singh',
    },
  },
  {
    id: '7',
    orderNumber: 'ORD-001240',
    customerName: 'Arjun Nair',
    customerPhone: '+91 7654321097',
    address: '12, Marine Drive, Mumbai',
    status: 'in progress',
    amount: 3200,
    date: '2023-04-05 11:30',
    partner: {
      id: '1',
      name: 'Rahul Sharma',
    },
  },
  {
    id: '8',
    orderNumber: 'ORD-001241',
    customerName: 'Preeti Gupta',
    customerPhone: '+91 6543210986',
    address: '35, Salt Lake, Kolkata',
    status: 'completed',
    amount: 1800,
    date: '2023-04-04 15:15',
    partner: {
      id: '2',
      name: 'Priya Patel',
    },
  },
];

const Orders = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in progress' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = ordersData.filter(order => {
    // Apply status filter
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Apply search filter
    if (searchTerm && 
        !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customerPhone.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'in progress':
        return (
          <Badge variant="default">
            <TrendingUp className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="success">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground mt-1">Manage and track all orders</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Order
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">1,856</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Package className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-mcp-green">1,643</p>
                </div>
                <div className="p-2 bg-mcp-green/10 rounded-full">
                  <Check className="h-5 w-5 text-mcp-green" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-primary">125</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-mcp-yellow">88</p>
                </div>
                <div className="p-2 bg-mcp-yellow/10 rounded-full">
                  <Clock className="h-5 w-5 text-mcp-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage all your orders</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center max-w-sm relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search orders..." 
                    className="pl-9 w-[200px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Order</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Customer</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Partner</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Amount</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Date</th>
                        <th className="py-3 px-4 font-medium text-muted-foreground text-sm w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-3 px-4">
                            {order.partner ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {order.partner.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{order.partner.name}</span>
                              </div>
                            ) : (
                              <Badge variant="outline">Not Assigned</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">₹{order.amount}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(order.date).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {!order.partner && (
                                  <DropdownMenuItem>Assign Partner</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                {order.status !== 'cancelled' && (
                                  <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{order.orderNumber}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                            </div>
                            
                            <div className="text-sm">
                              <p className="text-muted-foreground">{order.address}</p>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(order.date).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="font-medium">₹{order.amount}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Partner:</span>
                              {order.partner ? (
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {order.partner.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{order.partner.name}</span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-xs">Not Assigned</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex border-t border-border">
                          <Button variant="ghost" className="flex-1 rounded-none py-2 h-10">
                            View
                          </Button>
                          {!order.partner && (
                            <Button variant="ghost" className="flex-1 rounded-none py-2 h-10 border-l border-border">
                              Assign
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="rounded-none py-2 h-10 w-10 border-l border-border">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              {order.status !== 'cancelled' && (
                                <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Showing 1-8 of 1,856 orders</p>
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

export default Orders;