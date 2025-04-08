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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock notification data
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'partner' | 'system';
  priority: 'low' | 'medium' | 'high';
  date: string;
  read: boolean;
  actionRequired?: boolean;
};

const notificationsData: Notification[] = [
  {
    id: '1',
    title: 'Order Completed',
    message: 'Order #ORD-001234 has been completed successfully by Rahul Sharma.',
    type: 'order',
    priority: 'low',
    date: '2023-04-06 14:30',
    read: false,
  },
  {
    id: '2',
    title: 'Low Balance Alert',
    message: 'Your wallet balance is below ₹1,000. Please add funds to continue operations.',
    type: 'payment',
    priority: 'high',
    date: '2023-04-06 10:15',
    read: false,
    actionRequired: true,
  },
  {
    id: '3',
    title: 'Partner Deactivated',
    message: 'Amit Kumar has been deactivated due to inactivity.',
    type: 'partner',
    priority: 'medium',
    date: '2023-04-05 16:45',
    read: true,
  },
  {
    id: '4',
    title: 'Payment Successful',
    message: 'Successfully added ₹10,000 to your wallet via bank transfer.',
    type: 'payment',
    priority: 'low',
    date: '2023-04-04 09:20',
    read: true,
  },
  {
    id: '5',
    title: 'New Order Assigned',
    message: 'Order #ORD-001237 has been auto-assigned to Priya Patel.',
    type: 'order',
    priority: 'medium',
    date: '2023-04-04 08:45',
    read: true,
  },
  {
    id: '6',
    title: 'System Maintenance',
    message: 'The system will undergo maintenance on April 10, 2023, from 2 AM to 4 AM.',
    type: 'system',
    priority: 'high',
    date: '2023-04-03 15:10',
    read: true,
  },
  {
    id: '7',
    title: 'Partner Low Balance',
    message: 'Neha Singh\'s wallet balance is low. Consider adding funds.',
    type: 'partner',
    priority: 'medium',
    date: '2023-04-02 13:45',
    read: false,
    actionRequired: true,
  },
  {
    id: '8',
    title: 'Weekly Report',
    message: 'Your weekly performance report for Mar 27 - Apr 2 is now available.',
    type: 'system',
    priority: 'low',
    date: '2023-04-01 10:00',
    read: false,
  },
];

const Notifications = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState(notificationsData);
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    return true;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
    switch (type) {
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
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">Stay updated with important activities</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Mark All as Read
            </Button>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">All Notifications</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
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
                  <p className="text-2xl font-bold text-mcp-blue">{unreadCount}</p>
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
                  <p className="text-2xl font-bold text-mcp-yellow">
                    {notifications.filter(n => n.actionRequired).length}
                  </p>
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
                  <p className="text-2xl font-bold text-mcp-red">
                    {notifications.filter(n => n.priority === 'high').length}
                  </p>
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
                value={filter} 
                onValueChange={value => setFilter(value as 'all' | 'unread' | 'read')}
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
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`relative p-4 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'bg-background border-border' 
                        : 'bg-muted border-primary/20'
                    }`}
                  >
                    {!notification.read && (
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
                            {new Date(notification.date).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
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
                    {filter === 'unread' 
                      ? 'You have read all your notifications' 
                      : filter === 'read' 
                        ? 'You don\'t have any read notifications yet' 
                        : 'You don\'t have any notifications yet'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when orders are created, updated, or completed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications for payment transactions and low balance alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Partner Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Updates about partner activities, status changes, and performance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    System maintenance, updates, and important announcements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a copy of important notifications via email
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get SMS alerts for high-priority notifications
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Notifications;
