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
  Wallet,
  Edit,
  Trash2,
  CreditCard,
  Loader
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
  DialogFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import verifyUserSession from '@/utils/verify';
import { useRouter } from 'next/navigation';

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

// Form data for editing a partner
interface EditPartnerFormData {
  fullName?: string;
  phone?: string;
  commissionRate?: number;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  status?: 'ACTIVE' | 'INACTIVE';
}

// Form data for transferring funds to a partner
interface TransferFundsFormData {
  amount: number;
  notes: string;
  paymentMethod: 'razorpay' | 'wallet';
}

const initialAddFormState: PartnerFormData = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  commissionRate: 0,
  commissionType: 'FIXED'
};

const initialEditFormState: EditPartnerFormData = {
  fullName: '',
  phone: '',
  commissionRate: 0,
  commissionType: 'FIXED',
  status: 'ACTIVE'
};

const initialTransferFormState: TransferFundsFormData = {
  amount: 0,
  notes: '',
  paymentMethod: 'wallet'
};

const Partners = () => {
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferFundsOpen, setIsTransferFundsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addFormData, setAddFormData] = useState<PartnerFormData>(initialAddFormState);
  const [editFormData, setEditFormData] = useState<EditPartnerFormData>(initialEditFormState);
  const [transferFormData, setTransferFormData] = useState<TransferFundsFormData>(initialTransferFormState);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPartnerDetails, setSelectedPartnerDetails] = useState<Partner | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const router = useRouter()

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const isVerified = await verifyUserSession();
      if (!isVerified) {
        router.push("/login");
      }
    };
    checkUserLoggedIn();
  }, []);

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

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/wallet/balance`, { withCredentials: true });
      setWalletBalance(response.data.data.balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Fetch single partner details
  const fetchPartnerDetails = async (partnerId: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/partners/${partnerId}`, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching partner details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partner details.',
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchWalletBalance();
    
    // Load Razorpay script when component mounts
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
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

  // Handle add form input changes
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle transfer form input changes
  const handleTransferInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setTransferFormData(prev => ({
      ...prev,
      [id]: id === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle payment method selection for transfer form
  const handlePaymentMethodChange = (value: string) => {
    setTransferFormData(prev => ({
      ...prev,
      paymentMethod: value as 'razorpay' | 'wallet'
    }));
  };

  // Handle commission type selection for add form
  const handleAddCommissionTypeChange = (value: string) => {
    setAddFormData(prev => ({
      ...prev,
      commissionType: value as 'PERCENTAGE' | 'FIXED'
    }));
  };

  // Handle commission type selection for edit form
  const handleEditCommissionTypeChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      commissionType: value as 'PERCENTAGE' | 'FIXED'
    }));
  };
  
  // Handle status change for edit form
  const handleEditStatusChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      status: value as 'ACTIVE' | 'INACTIVE'
    }));
  };

  // Add new partner
  const handleAddPartner = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/partners`, addFormData, {
        withCredentials: true
      });
      
      toast({
        title: 'Success',
        description: 'Partner added successfully',
      });
      
      // Refresh partner list
      fetchPartners();
      
      // Reset form and close dialog
      setAddFormData(initialAddFormState);
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

  // Open edit partner dialog and populate form
  const openEditPartnerDialog = async (partnerId: string) => {
    try {
      const partner = partners.find(p => p.partner._id === partnerId);
      if (partner) {
        setSelectedPartnerId(partnerId);
        // Get the latest partner details
        const details = await fetchPartnerDetails(partnerId);
        if (details) {
          setSelectedPartnerDetails(details);
          setEditFormData({
            fullName: details.partner.fullName,
            phone: details.partner.phone,
            commissionRate: details.relationship.commissionRate,
            commissionType: details.relationship.commissionType,
            status: details.relationship.status
          });
          setIsEditPartnerOpen(true);
        }
      }
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partner details for editing',
        variant: 'destructive',
      });
    }
  };

  // Open transfer funds dialog
  const openTransferFundsDialog = (partnerId: string) => {
    const partner = partners.find(p => p.partner._id === partnerId);
    if (partner) {
      setSelectedPartnerId(partnerId);
      setSelectedPartnerDetails(partner);
      setTransferFormData(initialTransferFormState);
      setIsTransferFundsOpen(true);
    }
  };

  // Update partner details
  const handleUpdatePartner = async () => {
    if (!selectedPartnerId) return;
    
    setIsSubmitting(true);
    try {
      await axios.put(`${BACKEND_URL}/partners/${selectedPartnerId}`, editFormData, {
        withCredentials: true
      });
      
      toast({
        title: 'Success',
        description: 'Partner updated successfully',
      });
      
      // Refresh partner list
      fetchPartners();
      
      // Reset form and close dialog
      setEditFormData(initialEditFormState);
      setIsEditPartnerOpen(false);
      setSelectedPartnerId(null);
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update partner',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setIsDeleteDialogOpen(true);
  };

  // Delete partner
  const handleDeletePartner = async () => {
    if (!selectedPartnerId) return;
    
    setIsSubmitting(true);
    try {
      await axios.delete(`${BACKEND_URL}/partners/${selectedPartnerId}`, {
        withCredentials: true
      });
      
      toast({
        title: 'Success',
        description: 'Partner removed successfully',
      });
      
      // Refresh partner list
      fetchPartners();
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setSelectedPartnerId(null);
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove partner',
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

  // Transfer funds to partner via wallet
  const handleWalletTransfer = async () => {
    if (!selectedPartnerId || !transferFormData.amount || transferFormData.amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than zero',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BACKEND_URL}/wallet/transfer`, {
        partnerId: selectedPartnerId,
        amount: transferFormData.amount,
        notes: transferFormData.notes
      }, {
        withCredentials: true
      });
      
      toast({
        title: 'Transfer Successful',
        description: `₹${transferFormData.amount} has been transferred to the partner`,
      });
      
      // Refresh partner list and wallet balance
      fetchPartners();
      fetchWalletBalance();
      
      // Reset form and close dialog
      setTransferFormData(initialTransferFormState);
      setIsTransferFundsOpen(false);
      setSelectedPartnerId(null);
    } catch (error) {
      console.error('Error transferring funds:', error);
      toast({
        title: 'Transfer Failed',
        description: 'Failed to transfer funds. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process Razorpay payment for partner funds transfer
  const handleRazorpayTransfer = async () => {
    if (!selectedPartnerId || !transferFormData.amount || transferFormData.amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than zero',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Step 1: Create Razorpay order for partner funding
      const orderResponse = await axios.post(
        `${BACKEND_URL}/wallet/razorpay/create-order`, 
        { 
          partnerId: selectedPartnerId,
          amount: transferFormData.amount,
          notes: transferFormData.notes
        }, 
        { withCredentials: true }
      );
      
      const { orderId, key, amount: amountInPaise, currency, transactionId, user } = orderResponse.data.data;
      
      // Step 2: Open Razorpay checkout
      const options = {
        key,
        amount: amountInPaise,
        currency,
        name: "MCP Nexus",
        description: `Fund Transfer to ${selectedPartnerDetails?.partner.fullName}`,
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
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId,
              partnerId: selectedPartnerId
            };
            
            const verifyResponse = await axios.post(
              `${BACKEND_URL}/wallet/razorpay/verify-payment`,
              paymentData,
              { withCredentials: true }
            );
            
            if (verifyResponse.data.success) {
              toast({
                title: "Payment Successful",
                description: `₹${transferFormData.amount} has been transferred to ${selectedPartnerDetails?.partner.fullName}`,
                variant: "success"
              });
              
              // Refresh partner list
              fetchPartners();
              
              // Close dialog and reset form
              setIsTransferFundsOpen(false);
              setTransferFormData(initialTransferFormState);
              setSelectedPartnerId(null);
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
            setIsSubmitting(false);
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
      setIsSubmitting(false);
    }
  };

  // Handle transfer funds based on selected payment method
  const handleTransferFunds = () => {
    if (transferFormData.paymentMethod === 'wallet') {
      handleWalletTransfer();
    } else {
      handleRazorpayTransfer();
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
          
          {/* Add Partner Dialog */}
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
                    value={addFormData.fullName}
                    onChange={handleAddInputChange}
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
                    value={addFormData.email}
                    onChange={handleAddInputChange}
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
                    value={addFormData.password}
                    onChange={handleAddInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input 
                    id="phone" 
                    className="col-span-3"
                    value={addFormData.phone}
                    onChange={handleAddInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Payment
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Select 
                      value={addFormData.commissionType}
                      onValueChange={handleAddCommissionTypeChange}
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
                      value={addFormData.commissionRate}
                      onChange={handleAddInputChange}
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
          
          {/* Edit Partner Dialog */}
          <Dialog open={isEditPartnerOpen} onOpenChange={setIsEditPartnerOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Partner</DialogTitle>
                <DialogDescription>
                  Update the details of your pickup partner.
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
                    value={editFormData.fullName}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input 
                    id="phone" 
                    className="col-span-3"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="payment" className="text-right">
                    Payment
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Select 
                      value={editFormData.commissionType}
                      onValueChange={handleEditCommissionTypeChange}
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
                      value={editFormData.commissionRate}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={editFormData.status}
                    onValueChange={handleEditStatusChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditPartnerOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdatePartner} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Partner'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Transfer Funds Dialog */}
          <Dialog open={isTransferFundsOpen} onOpenChange={setIsTransferFundsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Transfer Funds</DialogTitle>
                <DialogDescription>
                  Send funds to {selectedPartnerDetails?.partner.fullName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="p-3 border border-border rounded-lg bg-muted/50 mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedPartnerDetails?.partner.fullName.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPartnerDetails?.partner.fullName}</p>
                        <p className="text-xs text-muted-foreground">{selectedPartnerDetails?.partner.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Current Balance</p>
                      <p className="font-medium">₹{selectedPartnerDetails?.partner.wallet || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-2 text-muted-foreground">₹</span>
                    <Input 
                      id="amount" 
                      type="number"
                      className="pl-7" 
                      placeholder="Enter amount"
                      value={transferFormData.amount || ''}
                      onChange={handleTransferInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="paymentMethod" className="text-right">
                    Pay using
                  </Label>
                  <Select 
                    value={transferFormData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          Wallet Balance (₹{walletBalance})
                        </div>
                      </SelectItem>
                      <SelectItem value="razorpay">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Razorpay
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    className="col-span-3"
                    placeholder="Optional notes"
                    value={transferFormData.notes}
                    onChange={handleTransferInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTransferFundsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleTransferFunds} 
                  disabled={isSubmitting || !transferFormData.amount || transferFormData.amount <= 0}
                >
                  {isSubmitting ? 'Processing...' : 'Transfer Funds'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Partner Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the partner account
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeletePartner}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search partners..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                <SelectItem value="ACTIVE">Active Only</SelectItem>
                <SelectItem value="INACTIVE">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => fetchPartners()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Partner List */}
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Partner</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Contact</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Commission</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Balance</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <Loader className="h-6 w-6 text-primary animate-spin mr-2" />
                        <span>Loading partners...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-muted-foreground">
                      No partners found
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((item) => (
                    <tr 
                      key={item.partner._id} 
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {item.partner.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.partner.fullName}</p>
                            <p className="text-xs text-muted-foreground">{item.partner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{item.partner.phone}</td>
                      <td className="p-4 align-middle">
                        {item.commissionType === 'PERCENTAGE' 
                          ? `${item.commissionRate}%` 
                          : `₹${item.commissionRate}`}
                      </td>
                      <td className="p-4 align-middle">₹{item.partner.wallet || 0}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={item.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openTransferFundsDialog(item.partner._id)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openEditPartnerDialog(item.partner._id)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updatePartnerStatus(
                                  item.partner._id, 
                                  item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                                )}
                              >
                                {item.status === 'ACTIVE' ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => openDeleteDialog(item.partner._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Partners;