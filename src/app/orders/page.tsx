"use client";
import React, { useEffect, useState } from 'react';
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
  X,
  AlertTriangle
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import MapView from '@/components/ui/MapView';

// Order type definition based on backend model
type Order = {
  _id: string;
  orderNumber?: string;
  customerId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  mcpId: {
    _id: string;
    fullName: string;
  };
  pickupPartnerId?: {
    _id: string;
    fullName: string;
    phone: string;
  };
  orderAmount: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  location: {
    address: string;
    coordinates?: [number, number];
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelReason?: string;
};

// Partner type definition
type Partner = {
    partner:{
  _id: string;
  fullName: string;
  phone: string;
  email: string;}
};

const Orders = () => {
  // State for orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 8;
  
  // State for filters
  const [filter, setFilter] = useState<'all' | 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{startDate?: string, endDate?: string}>({});
  
  // State for dialogs
  const [newOrderDialog, setNewOrderDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [viewOrderDialog, setViewOrderDialog] = useState(false);
  
  // State for form data
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [newStatus, setNewStatus] = useState<'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('PENDING');
  const [cancelReason, setCancelReason] = useState('');
  
  // New order form data
  const [newOrderData, setNewOrderData] = useState({
    customerId: '',
    mcpId: '',
    orderAmount: 0,
    location: {
      address: '',
      coordinates: [0, 0]
    }
  });
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0
  });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = BACKEND_URL+'/orders';
      const queryParams = [];
      
      if (filter !== 'all') {
        queryParams.push(`status=${filter}`);
      }
      
      if (dateRange.startDate) {
        queryParams.push(`startDate=${dateRange.startDate}`);
      }
      
      if (dateRange.endDate) {
        queryParams.push(`endDate=${dateRange.endDate}`);
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      const response = await axios.get(url,{withCredentials:true});
      
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalOrders(response.data.count);
        
        // Calculate statistics
        const stats = {
          total: response.data.count,
          completed: response.data.data.filter((order: { status: string; }) => order.status === 'COMPLETED').length,
          inProgress: response.data.data.filter((order: { status: string; }) => order.status === 'IN_PROGRESS').length,
          pending: response.data.data.filter((order: { status: string; }) => order.status === 'PENDING').length,
          cancelled: response.data.data.filter((order: { status: string; }) => order.status === 'CANCELLED').length
        };
        
        setStats(stats);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      setError('Error fetching orders. Please try again.');
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch partners for order assignment
  const fetchPartners = async (mcpId: string) => {
    try {
      const response = await axios.get(BACKEND_URL+`/partners`,{withCredentials:true});
      console.log(response.data.data)
      if (response.data.success) {
        setPartners(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Could not load partners. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle new order creation
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(BACKEND_URL+'/orders', newOrderData,{withCredentials:true});
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Order created successfully",
        });
        setNewOrderDialog(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle order assignment
  const handleAssignOrder = async () => {
    if (!selectedOrder || !selectedPartnerId) return;
    
    try {
      const response = await axios.put(BACKEND_URL+`/orders/${selectedOrder._id}/assign`, {
        pickupPartnerId: selectedPartnerId
      },{withCredentials:true});
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Order assigned successfully",
        });
        setAssignDialog(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error assigning order:', error);
      toast({
        title: "Error",
        description: "Failed to assign order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle order status update
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await axios.put(BACKEND_URL+`/orders/${selectedOrder._id}/status`, {
        status: newStatus
      },{withCredentials:true});
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        });
        setStatusDialog(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await axios.put(BACKEND_URL+`/orders/${selectedOrder._id}/cancel`, {
        cancelReason
      },{withCredentials:true});
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Order cancelled successfully",
        });
        setCancelDialog(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description:"Failed to cancel order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Apply search filter to orders
  useEffect(() => {
    if (orders.length > 0) {
      const filtered = orders.filter(order => {
        if (searchTerm === '') return true;
        
        const customerName = order.customerId?.fullName?.toLowerCase() || '';
        const customerPhone = order.customerId?.phone || '';
        const orderNumber = order._id.toLowerCase();
        
        return customerName.includes(searchTerm.toLowerCase()) || 
               customerPhone.includes(searchTerm) ||
               orderNumber.includes(searchTerm.toLowerCase());
      });
      
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [orders, searchTerm]);
  
  // Fetch orders on component mount and when filters change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateRange]);
  
  // Reset form data when dialogs are closed
  useEffect(() => {
    if (!newOrderDialog) {
      setNewOrderData({
        customerId: '',
        mcpId: '',
        orderAmount: 0,
        location: {
          address: '',
          coordinates: [0, 0]
        }
      });
    }
  }, [newOrderDialog]);
  
  // Helper function to display status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return (
          <Badge variant="default">
            <TrendingUp className="h-3 w-3 mr-1" />
            {status === 'ASSIGNED' ? 'Assigned' : 'In Progress'}
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="success">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'CANCELLED':
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
  
  // Helper function to format dates
  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <Button onClick={() => setNewOrderDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Order
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-mcp-green">{stats.completed}</p>
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
                  <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
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
                  <p className="text-2xl font-bold text-mcp-yellow">{stats.pending}</p>
                </div>
                <div className="p-2 bg-mcp-yellow/10 rounded-full">
                  <Clock className="h-5 w-5 text-mcp-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-2xl font-bold text-destructive">{stats.cancelled}</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-full">
                  <X className="h-5 w-5 text-destructive" />
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
                    <SelectValue placeholder="All Orders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Date Range</h4>
                        <p className="text-sm text-muted-foreground">
                          Filter orders by date
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            className="col-span-2"
                            value={dateRange.startDate || ''}
                            onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            className="col-span-2"
                            value={dateRange.endDate || ''}
                            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={() => setDateRange({})}>Clear Dates</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button variant="outline" size="icon" onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                  setDateRange({});
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                  <p>Loading orders...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center p-8">
                <div className="flex flex-col items-center text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-4" />
                  <p>{error}</p>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setError(null);
                      fetchOrders();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="list">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No orders found</h3>
                        <p className="text-muted-foreground">
                          Try clearing your filters or creating a new order.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border text-left">
                              <th className="py-3 px-4 font-medium text-muted-foreground text-sm">Order ID</th>
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
                              <tr key={order._id} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 font-medium">{order._id.substring(0, 8)}...</td>
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium">{order.customerId?.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{order.customerId?.phone}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {getStatusBadge(order.status)}
                                </td>
                                <td className="py-3 px-4">
                                  {order.pickupPartnerId ? (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                          {order.pickupPartnerId.fullName.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span>{order.pickupPartnerId.fullName}</span>
                                    </div>
                                  ) : (
                                    <Badge variant="outline">Not Assigned</Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-medium">₹{order.orderAmount}</td>
                                <td className="py-3 px-4 text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="py-3 px-4">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedOrder(order);
                                        setViewOrderDialog(true);
                                      }}>
                                        View Details
                                      </DropdownMenuItem>
                                      {!order.pickupPartnerId && order.status !== 'CANCELLED' && (
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedOrder(order);
                                          fetchPartners(order.mcpId._id);
                                          setAssignDialog(true);
                                        }}>
                                          Assign Partner
                                        </DropdownMenuItem>
                                      )}
                                      {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedOrder(order);
                                          setNewStatus(order.status);
                                          setStatusDialog(true);
                                        }}>
                                          Update Status
                                        </DropdownMenuItem>
                                      )}
                                      {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                        <DropdownMenuItem 
                                          className="text-destructive"
                                          onClick={() => {
                                            setSelectedOrder(order);
                                            setCancelDialog(true);
                                          }}
                                        >
                                          Cancel Order
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="grid">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No orders found</h3>
                        <p className="text-muted-foreground">
                          Try clearing your filters or creating a new order.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredOrders.map((order) => (
                          <Card key={order._id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium">{order._id.substring(0, 8)}...</p>
                                  {getStatusBadge(order.status)}
                                </div>
                                
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <p className="font-medium">{order.customerId?.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{order.customerId?.phone}</p>
                                  </div>
                                  <div className="mt-2">
                                    <div className="h-32 w-full border rounded overflow-hidden">
                                        <MapView location={order.location} isEditable={false} />
                                    </div>
                                    </div>
                                  
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">{order.location?.address}</p>
                                  </div>
                                  
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {formatDate(order.createdAt)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span className="font-medium">₹{order.orderAmount}</span>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Partner:</span>
                                    {order.pickupPartnerId ? (
                                      <div className="flex items-center gap-1">
                                        <Avatar className="h-5 w-5">
                                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {order.pickupPartnerId.fullName.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{order.pickupPartnerId.fullName}</span>
                                      </div>
                                    ) : (
                                      <Badge variant="outline" className="text-xs">Not Assigned</Badge>
                                    )}
                                </div>
                            </div>
                          </div>
                          <div className="p-4 bg-muted/50 flex justify-between border-t">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setViewOrderDialog(true);
                              }}
                            >
                              View Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!order.pickupPartnerId && order.status !== 'CANCELLED' && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedOrder(order);
                                    fetchPartners(order.mcpId._id);
                                    setAssignDialog(true);
                                  }}>
                                    Assign Partner
                                  </DropdownMenuItem>
                                )}
                                {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedOrder(order);
                                    setNewStatus(order.status);
                                    setStatusDialog(true);
                                  }}>
                                    Update Status
                                  </DropdownMenuItem>
                                )}
                                {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setCancelDialog(true);
                                    }}
                                  >
                                    Cancel Order
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {totalOrders} orders
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalOrders / ordersPerPage)))}
                  disabled={currentPage === Math.ceil(totalOrders / ordersPerPage)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  </div>
  
  {/* View Order Dialog */}
  {/* View Order Dialog */}
<Dialog open={viewOrderDialog} onOpenChange={setViewOrderDialog}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Order Details</DialogTitle>
      <DialogDescription>
        View complete information about this order
      </DialogDescription>
    </DialogHeader>
    
    {selectedOrder && (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Order ID: <span className="font-medium text-foreground">{selectedOrder._id}</span></p>
          {getStatusBadge(selectedOrder.status)}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Customer Information</h4>
          <div className="bg-muted/50 p-3 rounded-md">
            <p><span className="font-medium">Name:</span> {selectedOrder.customerId?.fullName}</p>
            <p><span className="font-medium">Phone:</span> {selectedOrder.customerId?.phone}</p>
            <p><span className="font-medium">Email:</span> {selectedOrder.customerId?.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Order Information</h4>
          <div className="bg-muted/50 p-3 rounded-md">
            <p><span className="font-medium">Amount:</span> ₹{selectedOrder.orderAmount}</p>
            <p><span className="font-medium">Location:</span> {selectedOrder.location?.address}</p>
            <p><span className="font-medium">Created:</span> {formatDate(selectedOrder.createdAt)}</p>
            {selectedOrder.completedAt && (
              <p><span className="font-medium">Completed:</span> {formatDate(selectedOrder.completedAt)}</p>
            )}
            {selectedOrder.cancelReason && (
              <p><span className="font-medium">Cancel Reason:</span> {selectedOrder.cancelReason}</p>
            )}
            <p><span className="font-medium">MicroEntrepreneur:</span> {selectedOrder.mcpId?.fullName}</p>
          </div>
        </div>
        
        {/* Add Map Component to view location */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pickup Location</h4>
          <div className="border rounded-md overflow-hidden">
            <MapView location={selectedOrder.location} isEditable={false} setLocation={undefined} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Pickup Partner Information</h4>
          <div className="bg-muted/50 p-3 rounded-md">
            {selectedOrder.pickupPartnerId ? (
              <>
                <p><span className="font-medium">Name:</span> {selectedOrder.pickupPartnerId?.fullName}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder.pickupPartnerId?.phone}</p>
              </>
            ) : (
              <p>No pickup partner assigned yet</p>
            )}
          </div>
        </div>
      </div>
    )}
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setViewOrderDialog(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  
  {/* Assign Partner Dialog */}
  <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Assign Pickup Partner</DialogTitle>
        <DialogDescription>
          Select a partner to handle this order
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="partner">Select Partner</Label>
          <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
            <SelectTrigger id="partner">
              <SelectValue placeholder="Select a partner" />
            </SelectTrigger>
            <SelectContent>
              {partners.map(partner => (
                <SelectItem key={partner.partner._id} value={partner.partner._id}>
                  {partner.partner.fullName} - {partner.partner.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setAssignDialog(false)}>
          Cancel
        </Button>
        <Button onClick={handleAssignOrder} disabled={!selectedPartnerId}>
          Assign Partner
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  {/* Update Status Dialog */}
  <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogDescription>
          Change the current status of this order
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="status">Select Status</Label>
          <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setStatusDialog(false)}>
          Cancel
        </Button>
        <Button onClick={handleUpdateStatus}>
          Update Status
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  {/* Cancel Order Dialog */}
  <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogDescription>
          Are you sure you want to cancel this order?
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Cancellation Reason</Label>
          <Textarea 
            id="reason" 
            placeholder="Please provide a reason for cancellation..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setCancelDialog(false)}>
          Back
        </Button>
        <Button variant="destructive" onClick={handleCancelOrder}>
          Cancel Order
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  {/* New Order Dialog */}
<Dialog open={newOrderDialog} onOpenChange={setNewOrderDialog}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Create New Order</DialogTitle>
      <DialogDescription>
        Fill in the details to create a new order
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Form inputs for creating a new order */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerId">Customer</Label>
          <Select 
            value={newOrderData.customerId} 
            onValueChange={(value) => setNewOrderData({...newOrderData, customerId: value})}
          >
            <SelectTrigger id="customerId">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {/* This would be populated with customer data */}
              <SelectItem value="customer-1">John Doe</SelectItem>
              <SelectItem value="customer-2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mcpId">Micro-Entrepreneur</Label>
          <Select 
            value={newOrderData.mcpId} 
            onValueChange={(value) => setNewOrderData({...newOrderData, mcpId: value})}
          >
            <SelectTrigger id="mcpId">
              <SelectValue placeholder="Select MCP" />
            </SelectTrigger>
            <SelectContent>
              {/* This would be populated with MCP data */}
              <SelectItem value="mcp-1">MCP 1</SelectItem>
              <SelectItem value="mcp-2">MCP 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Order Amount (₹)</Label>
        <Input 
          id="amount" 
          type="number" 
          placeholder="Enter amount"
          value={newOrderData.orderAmount}
          onChange={(e) => setNewOrderData({...newOrderData, orderAmount: parseFloat(e.target.value)})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Pickup Address</Label>
        <Textarea 
          id="address" 
          placeholder="Enter full address"
          value={newOrderData.location.address}
          onChange={(e) => setNewOrderData({
            ...newOrderData, 
            location: {
              ...newOrderData.location,
              address: e.target.value
            }
          })}
        />
      </div>
      
      {/* Add Map Component */}
      <div className="space-y-2">
        <Label>Set Location on Map</Label>
        <div className="border rounded-md overflow-hidden">
          <MapView 
            location={newOrderData.location} 
            setLocation={(location: any) => setNewOrderData({...newOrderData, location})} 
            isEditable={true}
          />
        </div>
        <p className="text-xs text-muted-foreground">Click on the map to set the pickup location</p>
      </div>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setNewOrderDialog(false)}>
        Cancel
      </Button>
      <Button onClick={handleCreateOrder}>
        Create Order
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</AppLayout>
);
};

export default Orders;