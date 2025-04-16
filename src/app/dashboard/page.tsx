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
import { useRouter } from 'next/navigation';
import verifyUserSession from '@/utils/verify';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dateRange, setDateRange] = useState<{startDate?: string, endDate?: string}>({});

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const isVerified = await verifyUserSession();
      if (!isVerified) {
        router.push("/login");
      }
    };
    checkUserLoggedIn();
  }, []);
  
  const refreshStats = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '5');
      
      const response = await axios.get(`${BACKEND_URL}/wallet/transaction?${params.toString()}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = (transactionId) => {
    if (transactionId) {
      router.push(`/wallet?transaction=${transactionId}`);
    } else {
      router.push('/wallet');
    }
  };
  
  useEffect(() => {
    const fetchDashboard = async () => {
      const walletbalance = await axios.get(BACKEND_URL+"/wallet/balance", {withCredentials: true})
      setBalance(walletbalance.data.data.balance)
    }
    fetchDashboard()
  }, [])
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your dashboard</p>
        </div>
        
        {/* First row: Wallet + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Wallet card takes 4 columns on md screens */}
          <div className="md:col-span-4">
            <WalletCard balance={balance} />
          </div>
          
          {/* Stats section takes 8 columns on md screens */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
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
        </div>

        {/* Second row: Charts + Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrdersChart />
          <RecentTransactions 
            transactions={transactions} 
            loading={isLoading}
            maxItems={5}
            onViewAll={handleViewAll} 
          />
        </div>

        {/* Third row: Partners */}
        <PartnersList />
      </div>
    </AppLayout>
  );
};

export default Dashboard;