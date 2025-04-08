"use client";
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WalletCard } from '@/components/dashbaord/WalletCard';
import { StatCard } from '@/components/dashbaord/StatCard';
import { PartnersList } from '@/components/dashbaord/PartnersList';
import { OrdersChart } from '@/components/dashbaord/OrdersChart';
import { RecentTransactions } from '@/components/dashbaord/RecentTransaction';
import { ShoppingBag, TrendingUp, Clock, Backpack } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import { BACKEND_URL } from '@/config';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [balance,setBalance] = useState(0)
  useEffect(()=>{
    const fetchDashboard = async ()=>{
    const walletbalance  = await axios.get(BACKEND_URL+"/wallet/balance",{withCredentials:true})
    const orderDetails = await axios.get(BACKEND_URL+"/order",{withCredentials:true})
    setBalance(walletbalance.data.data.balance)
    console.log(walletbalance,orderDetails)
    }
    fetchDashboard()
  },[])
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your dashboard</p>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
          <WalletCard balance={balance} />
          
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
          <OrdersChart />
          <RecentTransactions />
        </div>

        <PartnersList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;