"use client";
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Bell, 
  Check, 
  Clock, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import verifyUserSession from '@/utils/verify';
import { useRouter } from 'next/navigation';

// Types matching the backend model
type Notification = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  actionRequired: boolean;
  referenceId?: string;
  createdAt: string;
};

type NotificationStats = {
  total: number;
  unread: number;
  highPriority: number;
  actionRequired: number;
  typeCounts: {
    [key: string]: number;
  };
};

type PaginationData = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

// API services for notification interactions
const apiServices = {
  // Fetch notifications with filters
  async getNotifications(
    page = 1, 
    limit = 10, 
    filter?: { isRead?: boolean; type?: string; priority?: string; actionRequired?: boolean }
  ) {
    let url = BACKEND_URL+`/notifications?page=${page}&limit=${limit}`;
    
    if (filter) {
      if (filter.isRead !== undefined) url += `&isRead=${filter.isRead}`;
      if (filter.type) url += `&type=${filter.type}`;
      if (filter.priority) url += `&priority=${filter.priority}`;
      if (filter.actionRequired !== undefined) url += `&actionRequired=${filter.actionRequired}`;
    }
    
    const response = await axios.get(url,{withCredentials:true});
    console.log(response)
    if (!response.data.success) {
      throw new Error( 'Failed to fetch notifications');
    }
    
    return response.data.data;
  },
  
  // Mark a single notification as read
  async markAsRead(id: string) {
    const response = await axios.patch(BACKEND_URL+`/notifications/${id}/read`,{},{withCredentials:true});
    
    const data = response;
    
    if (!data) {
      throw new Error('Failed to mark notification as read');
    }
    
    return data.data;
  },
  
  // Mark all notifications as read for a user
  async markAllAsRead() {
    const response = await axios.patch(BACKEND_URL+'/notifications/read-all',{},{withCredentials:true});
    
    const data = response
    
    if (!data) {
      throw new Error('Failed to mark all notifications as read');
    }
    
    return data.data;
  },
  
  // Get notification statistics
  async getNotificationStats() {
    const response = await axios.get(BACKEND_URL+`/notifications/stats`,{withCredentials:true});
    console.log(response)
    
    if (!response.data.success) {
      throw new Error('Failed to fetch notification stats');
    }
    
    return response.data.data as NotificationStats;
  }
};

const Notifications = () => {
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    highPriority: 0,
    actionRequired: 0,
    typeCounts: {}
  });
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  // Fetch notifications based on current filter
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isRead = filterType === 'all' ? undefined : filterType === 'read';
      
      const { notifications, pagination } = await apiServices.getNotifications(
        1,
        10,
        { isRead }
      );
      console.log(notifications,pagination)
      setNotifications(notifications);
      setPagination(pagination);
      
      // Also refresh stats when notifications are loaded
      await fetchStats();
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch notification statistics
  const fetchStats = async () => {
    try {
      const statsData = await apiServices.getNotificationStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load notification stats:', err);
    }
  };
  
  // Load data on component mount and when filter changes
  useEffect(() => {
    fetchNotifications();
  }, [filterType]);
  
  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await apiServices.markAsRead(id);
      
      // Update local state
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      
      // Refresh stats
      await fetchStats();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await apiServices.markAllAsRead();
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      
      // Refresh stats
      await fetchStats();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };
  
  // Navigate to next/previous page
  const changePage = (direction: 'next' | 'prev') => {
    if (direction === 'next' && pagination.page < pagination.pages) {
      setPagination({ ...pagination, page: pagination.page + 1 });
    } else if (direction === 'prev' && pagination.page > 1) {
      setPagination({ ...pagination, page: pagination.page - 1 });
    }
  };
  
  // Get appropriate icon based on notification type and priority
  const getNotificationIcon = (type: string, priority: Notification['priority']) => {
    switch (type.toLowerCase()) {
      case 'order':
        return <Check className="h-5 w-5 text-mcp-green" />;
      case 'payment':
        return <Wallet className="h-5 w-5 text-primary" />;
      case 'partner':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case 'system':
        return priority === 'high' 
          ? <AlertCircle className="h-5 w-5 text-mcp-red" />
          : <Info className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">Stay updated with important activities</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={markAllAsRead} 
              disabled={stats.unread === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark All as Read
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">All Notifications</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-mcp-blue">{stats.unread}</p>
                </div>
                <div className="p-2 bg-mcp-blue/10 rounded-full">
                  <Bell className="h-5 w-5 text-mcp-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Action Required</p>
                  <p className="text-2xl font-bold text-mcp-yellow">{stats.actionRequired}</p>
                </div>
                <div className="p-2 bg-mcp-yellow/10 rounded-full">
                  <AlertCircle className="h-5 w-5 text-mcp-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-mcp-red">{stats.highPriority}</p>
                </div>
                <div className="p-2 bg-mcp-red/10 rounded-full">
                  <AlertCircle className="h-5 w-5 text-mcp-red" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Notification Center</CardTitle>
                <CardDescription>View and manage your notifications</CardDescription>
              </div>
              
              <Tabs 
                defaultValue="all" 
                value={filterType} 
                onValueChange={value => setFilterType(value as 'all' | 'unread' | 'read')}
                className="w-[300px]"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading notifications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-mcp-red">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <p>{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      className={`relative p-4 rounded-lg border transition-colors ${
                        notification.isRead 
                          ? 'bg-background border-border' 
                          : 'bg-muted border-primary/20'
                      }`}
                    >
                      {!notification.isRead && (
                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          notification.priority === 'high' 
                            ? 'bg-mcp-red/10' 
                            : notification.priority === 'medium'
                              ? 'bg-mcp-yellow/10'
                              : 'bg-muted'
                        }`}>
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            {notification.priority === 'high' && (
                              <Badge variant="destructive">High Priority</Badge>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="warning">Action Required</Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </p>
                            
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification._id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No notifications found</h3>
                    <p className="text-muted-foreground mt-1">
                      {filterType === 'unread' 
                        ? 'You have read all your notifications' 
                        : filterType === 'read' 
                          ? 'You don\'t have any read notifications yet' 
                          : 'You don\'t have any notifications yet'}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {notifications.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {notifications.length} of {pagination.total} notifications
                </p>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => changePage('prev')}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm mx-2">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => changePage('next')}
                    disabled={pagination.page >= pagination.pages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;