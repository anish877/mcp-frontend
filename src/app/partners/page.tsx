"use client";
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  UserPlus, 
  Check, 
  X, 
  MoreHorizontal, 
  Filter,
  RefreshCw,
  Wallet 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
type Partner = {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  ordersCompleted: number;
  balance: number;
  address: string;
  role: 'collector' | 'delivery' | 'both';
  paymentType: 'commission' | 'fixed';
  paymentValue: number;
  joinDate: string;
};

const partnersData: Partner[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    status: 'active',
    ordersCompleted: 156,
    balance: 4500,
    address: 'Sector 12, Noida, UP',
    role: 'collector',
    paymentType: 'commission',
    paymentValue: 10,
    joinDate: '12 Jan 2023',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 8765432109',
    status: 'active',
    ordersCompleted: 89,
    balance: 2800,
    address: 'MG Road, Bangalore',
    role: 'both',
    paymentType: 'fixed',
    paymentValue: 50,
    joinDate: '05 Mar 2023',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 7654321098',
    status: 'inactive',
    ordersCompleted: 67,
    balance: 1200,
    address: 'Laxmi Nagar, Delhi',
    role: 'delivery',
    paymentType: 'commission',
    paymentValue: 8,
    joinDate: '27 Apr 2023',
  },
  {
    id: '4',
    name: 'Neha Singh',
    phone: '+91 6543210987',
    status: 'active',
    ordersCompleted: 102,
    balance: 3600,
    address: 'Vashi, Navi Mumbai',
    role: 'collector',
    paymentType: 'fixed',
    paymentValue: 60,
    joinDate: '18 May 2023',
  },
  {
    id: '5',
    name: 'Suresh Verma',
    phone: '+91 9876543211',
    status: 'active',
    ordersCompleted: 78,
    balance: 2100,
    address: 'Camp, Pune',
    role: 'delivery',
    paymentType: 'commission',
    paymentValue: 12,
    joinDate: '02 Jun 2023',
  },
  {
    id: '6',
    name: 'Anjali Reddy',
    phone: '+91 8765432108',
    status: 'inactive',
    ordersCompleted: 45,
    balance: 900,
    address: 'Banjara Hills, Hyderabad',
    role: 'both',
    paymentType: 'fixed',
    paymentValue: 55,
    joinDate: '14 Jul 2023',
  },
  {
    id: '7',
    name: 'Rajesh Gupta',
    phone: '+91 7654321097',
    status: 'active',
    ordersCompleted: 114,
    balance: 3100,
    address: 'Vasant Kunj, Delhi',
    role: 'collector',
    paymentType: 'commission',
    paymentValue: 10,
    joinDate: '23 Aug 2023',
  },
  {
    id: '8',
    name: 'Kavita Joshi',
    phone: '+91 6543210986',
    status: 'active',
    ordersCompleted: 93,
    balance: 2800,
    address: 'Andheri, Mumbai',
    role: 'delivery',
    paymentType: 'fixed',
    paymentValue: 50,
    joinDate: '09 Sep 2023',
  },
];

const Partners = () => {
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partnersData.filter(partner => {
    // Apply status filter
    if (filter !== 'all' && partner.status !== filter) return false;
    
    // Apply search filter
    if (searchTerm && !partner.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !partner.phone.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pickup Partners</h1>
            <p className="text-muted-foreground mt-1">Manage your collection partners</p>
          </div>
          
          <Dialog open={isAddPartnerOpen} onOpenChange={setIsAddPartnerOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>
                  Enter the details of your new pickup partner here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input id="address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collector">Collector</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Payment
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Select defaultValue="commission">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commission">Commission</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Value" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddPartnerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddPartnerOpen(false)}>
                  Add Partner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center flex-1 max-w-sm relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search partners..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilter('all')}>
                      All Partners
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('active')}>
                      Active Partners
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('inactive')}>
                      Inactive Partners
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b px-4 sm:px-6">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="p-0 sm:p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-4 font-medium text-muted-foreground text-xs sm:text-sm">Partner</th>
                        <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Status</th>
                        <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Role</th>
                        <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Orders</th>
                        <th className="hidden sm:table-cell py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Payment</th>
                        <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Balance</th>
                        <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPartners.map((partner) => (
                        <tr key={partner.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                                  {partner.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{partner.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{partner.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <Badge variant={partner.status === 'active' ? "success" : "destructive"} className="capitalize text-xs whitespace-nowrap">
                              {partner.status === 'active' ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              {partner.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 sm:px-4 capitalize text-xs sm:text-sm whitespace-nowrap">{partner.role}</td>
                          <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{partner.ordersCompleted}</td>
                          <td className="hidden sm:table-cell py-3 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                            {partner.paymentType === 'commission' 
                              ? `${partner.paymentValue}% Commission` 
                              : `₹${partner.paymentValue} Fixed`}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">₹{partner.balance}</td>
                          <td className="py-3 px-2 sm:px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuItem>Edit Partner</DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Wallet className="h-4 w-4 mr-2" />
                                  Transfer Funds
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="grid" className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPartners.map((partner) => (
                    <Card key={partner.id} className="overflow-hidden h-full flex flex-col">
                      <CardContent className="p-0 flex-1 flex flex-col">
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {partner.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{partner.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{partner.phone}</p>
                              </div>
                            </div>
                            <Badge variant={partner.status === 'active' ? "success" : "destructive"} className="capitalize whitespace-nowrap">
                              {partner.status}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="text-sm flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              <span className="capitalize font-medium">{partner.role}</span>
                            </div>
                            <div className="text-sm flex justify-between">
                              <span className="text-muted-foreground">Payment:</span>
                              <span className="font-medium">
                                {partner.paymentType === 'commission' 
                                  ? `${partner.paymentValue}% Commission` 
                                  : `₹${partner.paymentValue} Fixed`}
                              </span>
                            </div>
                            <div className="text-sm flex justify-between">
                              <span className="text-muted-foreground">Orders:</span>
                              <span className="font-medium">{partner.ordersCompleted}</span>
                            </div>
                            <div className="text-sm flex justify-between">
                              <span className="text-muted-foreground">Balance:</span>
                              <span className="font-medium">₹{partner.balance}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex border-t border-border mt-auto">
                          <Button variant="ghost" className="flex-1 rounded-none py-2 h-10">
                            Edit
                          </Button>
                          <Button variant="ghost" className="flex-1 rounded-none py-2 h-10 border-l border-border">
                            <Wallet className="h-4 w-4 mr-2" />
                            Fund
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Partners;