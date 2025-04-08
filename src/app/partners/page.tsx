"use client";
import React, { useEffect, useState } from 'react';
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
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Interface to match backend data structure
interface Partner {
  relationshipId: string;
  partner: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'ACTIVE' | 'INACTIVE';
    wallet: number;
  };
  commissionRate: number;
  commissionType: 'PERCENTAGE' | 'FIXED';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// Form data for adding a new partner
interface PartnerFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  commissionRate: number;
  commissionType: 'PERCENTAGE' | 'FIXED';
}

const initialFormState: PartnerFormData = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  commissionRate: 0,
  commissionType: 'FIXED'
};

const Partners = () => {
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<PartnerFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch partners from backend
  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/partners`, { withCredentials: true });
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partners. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Filter partners based on search and status filter
  const filteredPartners = partners.filter(partner => {
    // Apply status filter
    if (filter !== 'all' && partner.status !== filter) return false;
    
    // Apply search filter (to name, email or phone)
    if (searchTerm && !partner.partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !partner.partner.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !partner.partner.phone.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle commission type selection
  const handleCommissionTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      commissionType: value as 'PERCENTAGE' | 'FIXED'
    }));
  };

  // Add new partner
  const handleAddPartner = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/partners`, formData, {
        withCredentials: true
      });
      
      toast({
        title: 'Success',
        description: 'Partner added successfully',
      });
      
      // Refresh partner list
      fetchPartners();
      
      // Reset form and close dialog
      setFormData(initialFormState);
      setIsAddPartnerOpen(false);
    } catch (error) {
      console.error('Error adding partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to add partner',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update partner status
  const updatePartnerStatus = async (partnerId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      await axios.put(`${BACKEND_URL}/partners/${partnerId}`, { status }, {
        withCredentials: true
      });
      
      toast({
        title: 'Success',
        description: `Partner ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
      });
      
      // Refresh partner list
      fetchPartners();
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update partner status',
        variant: 'destructive',
      });
    }
  };

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
                  <Label htmlFor="fullName" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="fullName" 
                    className="col-span-3" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email"
                    className="col-span-3"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input 
                    id="password" 
                    type="password"
                    className="col-span-3"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input 
                    id="phone" 
                    className="col-span-3"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Payment
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Select 
                      value={formData.commissionType}
                      onValueChange={handleCommissionTypeChange}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                        <SelectItem value="FIXED">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      id="commissionRate"
                      type="number" 
                      placeholder="Value" 
                      value={formData.commissionRate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddPartnerOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddPartner} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Partner'}
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
                    <DropdownMenuItem onClick={() => setFilter('ACTIVE')}>
                      Active Partners
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('INACTIVE')}>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Loading partners...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="py-3 px-4 font-medium text-muted-foreground text-xs sm:text-sm">Partner</th>
                          <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Status</th>
                          <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Email</th>
                          <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Orders</th>
                          <th className="hidden sm:table-cell py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Payment</th>
                          <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Balance</th>
                          <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPartners.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                              No partners found. Add a new partner to get started.
                            </td>
                          </tr>
                        ) : (
                          filteredPartners.map((partnerData) => (
                            <tr key={partnerData.relationshipId} className="border-b border-border hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                                      {partnerData.partner.fullName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{partnerData.partner.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{partnerData.partner.phone}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 sm:px-4">
                                <Badge variant={partnerData.status === 'ACTIVE' ? "success" : "destructive"} className="capitalize text-xs whitespace-nowrap">
                                  {partnerData.status === 'ACTIVE' ? (
                                    <Check className="h-3 w-3 mr-1" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  {partnerData.status.toLowerCase()}
                                </Badge>
                              </td>
                              <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{partnerData.partner.email}</td>
                              <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">-</td>
                              <td className="hidden sm:table-cell py-3 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                                {partnerData.commissionType === 'PERCENTAGE' 
                                  ? `${partnerData.commissionRate}% Commission` 
                                  : `₹${partnerData.commissionRate} Fixed`}
                              </td>
                              <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">₹{partnerData.partner.wallet || 0}</td>
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
                                    <DropdownMenuItem 
                                      className={partnerData.status === 'ACTIVE' ? "text-destructive" : "text-green-600"}
                                      onClick={() => updatePartnerStatus(
                                        partnerData.partner._id, 
                                        partnerData.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                      )}
                                    >
                                      {partnerData.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="grid" className="p-4 sm:p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Loading partners...</p>
                    </div>
                  </div>
                ) : filteredPartners.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No partners found. Add a new partner to get started.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPartners.map((partnerData) => (
                      <Card key={partnerData.relationshipId} className="overflow-hidden h-full flex flex-col">
                        <CardContent className="p-0 flex-1 flex flex-col">
                          <div className="p-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {partnerData.partner.fullName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium truncate">{partnerData.partner.fullName}</p>
                                  <p className="text-sm text-muted-foreground truncate">{partnerData.partner.phone}</p>
                                </div>
                              </div>
                              <Badge variant={partnerData.status === 'ACTIVE' ? "success" : "destructive"} className="capitalize whitespace-nowrap">
                                {partnerData.status.toLowerCase()}
                              </Badge>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium">{partnerData.partner.email}</span>
                              </div>
                              <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Payment:</span>
                                <span className="font-medium">
                                  {partnerData.commissionType === 'PERCENTAGE' 
                                    ? `${partnerData.commissionRate}% Commission` 
                                    : `₹${partnerData.commissionRate} Fixed`}
                                </span>
                              </div>
                              <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Orders:</span>
                                <span className="font-medium">-</span>
                              </div>
                              <div className="text-sm flex justify-between">
                                <span className="text-muted-foreground">Balance:</span>
                                <span className="font-medium">₹{partnerData.partner.wallet || 0}</span>
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
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Partners;