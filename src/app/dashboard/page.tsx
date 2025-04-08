"use client";
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WalletCard } from '@/components/dashbaord/WalletCard';
import { StatCard } from '@/components/dashbaord/StatCard';
import { PartnersList } from '@/components/dashbaord/PartnersList';
import { OrdersChart } from '@/components/dashbaord/OrdersChart';
import { RecentTransactions } from '@/components/dashbaord/RecentTransaction';
import { ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your dashboard</p>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
          <WalletCard balance={45600} />
          
          <div className={`col-span-2 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
            <StatCard 
              title="Total Orders" 
              value="1,856" 
              icon={ShoppingBag}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Completed Orders" 
              value="1,643" 
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard 
              title="Pending Orders" 
              value="213" 
              icon={Clock}
              trend={{ value: 3, isPositive: false }}
            />
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          {/* <OrdersChart /> */}
          <RecentTransactions />
        </div>

        <PartnersList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;