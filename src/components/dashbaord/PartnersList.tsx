"use client";
import React, { useEffect, useState } from 'react';
import { Eye, Search, RefreshCw, Loader, MoreHorizontal, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// Interface to match backend data structure
interface PartnerData {
  _id: string;
  partner: {
    fullName: string;
    phone: string;
    wallet: number;
  };
  status: string;
  commissionRate: number;
}

export function PartnersList(): React.ReactElement {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  // Fetch partners from backend
  const fetchPartners = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/partners`, { withCredentials: true });
      console.log(response);
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pickup partners. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Filter partners based on search term and show only first 5
  const filteredPartners = partners
    .filter(partner => 
      partner.partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.partner.phone.includes(searchTerm)
    )
    .slice(0, 5);

  const handleViewAll = (): void => {
    router.push('/partners');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
        <div>
          <CardTitle className="text-xl">Pickup Partners</CardTitle>
          <CardDescription>Manage your collection partners</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleViewAll}>
            <Eye className="h-4 w-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-6">
        {/* Search and Refresh */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search partners..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => fetchPartners()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Partners Table */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader className="h-6 w-6 text-primary animate-spin mr-2" />
              <span>Loading partners...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Partner</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Status</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Comission</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Balance</th>
                  <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground">
                      No pickup partners found
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((partner) => (
                    <tr key={partner._id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                              {partner.partner.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{partner.partner.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{partner.partner.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <Badge 
                          variant={partner.status.toLowerCase() === 'active' ? "success" : "destructive"} 
                          className="capitalize text-xs whitespace-nowrap"
                        >
                          {partner.status.toLowerCase() === 'active' ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {partner.status.toLocaleUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{partner.commissionRate}%</td>
                      <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">₹{partner.partner.wallet}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}