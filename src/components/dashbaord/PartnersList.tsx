
import React from 'react';
import { Check, X, MoreHorizontal, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Partner = {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  ordersCompleted: number;
  balance: number;
};

// Mock data for initial display
const partnersData: Partner[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    status: 'active',
    ordersCompleted: 156,
    balance: 4500,
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 8765432109',
    status: 'active',
    ordersCompleted: 89,
    balance: 2800,
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 7654321098',
    status: 'inactive',
    ordersCompleted: 67,
    balance: 1200,
  },
  {
    id: '4',
    name: 'Neha Singh',
    phone: '+91 6543210987',
    status: 'active',
    ordersCompleted: 102,
    balance: 3600,
  },
];

export function PartnersList() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 p-4 sm:p-6">
        <div>
          <CardTitle className="text-xl">Pickup Partners</CardTitle>
          <CardDescription>Manage your collection partners</CardDescription>
        </div>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          Add Partner
        </Button>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Partner</th>
                <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Status</th>
                <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Orders</th>
                <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm">Balance</th>
                <th className="py-3 px-2 sm:px-4 font-medium text-muted-foreground text-xs sm:text-sm w-10"></th>
              </tr>
            </thead>
            <tbody>
              {partnersData.map((partner) => (
                <tr key={partner.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-2 sm:px-4">
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
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">{partner.ordersCompleted}</td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium">₹{partner.balance}</td>
                  <td className="py-3 px-2 sm:px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Transfer Funds</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
