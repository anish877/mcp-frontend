import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Package, Check, Clock, TrendingUp, X, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { Button } from '@/components/ui/button';

type OrderStats = {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  textColor?: string;
  iconBgColor?: string;
};

/**
 * Individual Stat Card Component
 */
export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className,
  textColor = "text-foreground", 
  iconBgColor = "bg-primary/10"
}: StatCardProps) {
  return (
    <div className={cn("dashboard-card p-6 rounded-lg border bg-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={cn("text-2xl font-bold mt-1", textColor)}>{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last week</span>
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-full", iconBgColor)}>
          <Icon className={cn("h-5 w-5", textColor)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Order Statistics Grid Component with Backend Integration
 */
export function OrderStatsGrid({ 
  initialStats,
  dateRange,
  refreshTrigger
}: { 
  initialStats?: OrderStats,
  dateRange?: {startDate?: string, endDate?: string},
  refreshTrigger?: number
}) {
  const [stats, setStats] = useState<OrderStats>(initialStats || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0
  });
  const [isLoading, setIsLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Calculate week-over-week trends (example implementation)
  const [trends, setTrends] = useState<{
    total: { value: number, isPositive: boolean },
    completed: { value: number, isPositive: boolean },
    inProgress: { value: number, isPositive: boolean },
    pending: { value: number, isPositive: boolean },
    cancelled: { value: number, isPositive: boolean }
  }>({
    total: { value: 0, isPositive: true },
    completed: { value: 0, isPositive: true },
    inProgress: { value: 0, isPositive: true },
    pending: { value: 0, isPositive: false },
    cancelled: { value: 0, isPositive: false }
  });

  // Fetch order statistics from backend
  const fetchOrderStats = async () => {
    setIsLoading(true);
    try {
      let url = `${BACKEND_URL}/orders/stats`;
      
      // Add date range filters if provided
      const queryParams = [];
      if (dateRange?.startDate) {
        queryParams.push(`startDate=${dateRange.startDate}`);
      }
      if (dateRange?.endDate) {
        queryParams.push(`endDate=${dateRange.endDate}`);
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      
      // If you don't have a dedicated stats endpoint, you can calculate from orders
      const response = await axios.get(`${BACKEND_URL}/orders`, { withCredentials: true });
      
      if (response.data.success) {
        const ordersData = response.data.data;
        
        // Calculate statistics
        const calculatedStats = {
          total: ordersData.length,
          completed: ordersData.filter((order: { status: string }) => order.status === 'COMPLETED').length,
          inProgress: ordersData.filter((order: { status: string }) => order.status === 'IN_PROGRESS').length,
          pending: ordersData.filter((order: { status: string }) => order.status === 'PENDING').length,
          cancelled: ordersData.filter((order: { status: string }) => order.status === 'CANCELLED').length
        };
        
        setStats(calculatedStats);
        
        // Fetch previous week's data for trend calculation
        // This is simplified - in a real implementation you would fetch data from last week
        // For demo, we're simulating trends with random values
        fetchTrendData();
      } else {
        throw new Error('Failed to fetch order statistics');
      }
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Example function to fetch trend data (previous period comparison)
  const fetchTrendData = async () => {
    // In a real implementation, you would fetch data from last week
    // For demo purposes, we'll simulate with random values
    setTrends({
      total: { value: Math.floor(Math.random() * 20), isPositive: Math.random() > 0.3 },
      completed: { value: Math.floor(Math.random() * 25), isPositive: Math.random() > 0.2 },
      inProgress: { value: Math.floor(Math.random() * 30), isPositive: Math.random() > 0.5 },
      pending: { value: Math.floor(Math.random() * 15), isPositive: Math.random() > 0.6 },
      cancelled: { value: Math.floor(Math.random() * 10), isPositive: Math.random() > 0.7 }
    });
  };

  // Fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchOrderStats();
  }, [dateRange, refreshTrigger]);

  const handleRefresh = () => {
    fetchOrderStats();
  };

  // Format the last refresh time
  const formatLastRefresh = () => {
    return lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground">
          Last updated: {formatLastRefresh()}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
          {isLoading ? "Updating..." : "Refresh"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value={isLoading ? "..." : stats.total}
          icon={Package}
          className="bg-card"
          iconBgColor="bg-primary/10"
          textColor="text-primary"
          trend={trends.total}
        />
        
        <StatCard
          title="Completed"
          value={isLoading ? "..." : stats.completed}
          icon={Check}
          iconBgColor="bg-green-100"
          textColor="text-green-600"
          trend={trends.completed}
        />
        
        <StatCard
          title="In Progress"
          value={isLoading ? "..." : stats.inProgress}
          icon={TrendingUp}
          iconBgColor="bg-blue-100"
          textColor="text-blue-600"
          trend={trends.inProgress}
        />
        
        <StatCard
          title="Pending"
          value={isLoading ? "..." : stats.pending}
          icon={Clock}
          iconBgColor="bg-amber-100"
          textColor="text-amber-600"
          trend={trends.pending}
        />
        
        <StatCard
          title="Cancelled"
          value={isLoading ? "..." : stats.cancelled}
          icon={X}
          iconBgColor="bg-red-100"
          textColor="text-red-600"
          trend={trends.cancelled}
        />
      </div>
    </div>
  );
}
