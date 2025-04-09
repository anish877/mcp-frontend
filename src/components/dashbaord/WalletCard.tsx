
import React from 'react';
import { Wallet, PlusCircle, ArrowDownToLine, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

type WalletCardProps = {
  balance: number;
  currency?: string;
};

export function WalletCard({ balance, currency = "₹" }: WalletCardProps) {
    const router = useRouter()
  return (
    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary to-primary/80">
      <CardHeader className="text-primary-foreground pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Main Wallet</CardTitle>
          <Wallet className="h-5 w-5" />
        </div>
        <CardDescription className="text-primary-foreground/90">
          Available Balance
        </CardDescription>
      </CardHeader>
      <CardContent className="text-primary-foreground pb-2">
        <div className="text-3xl font-bold">{currency}{balance.toLocaleString()}</div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button variant="secondary" size="sm" className="flex-1" onClick={()=>router.push("/wallet")}>
          <MoveUpRight className="h-4 w-4 mr-1" />
          Go to Wallet
        </Button>
      </CardFooter>
    </Card>
  );
}