
import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Clock, Check, AlertCircle, Bell, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'error' | 'info';

type ToastProps = {
  title: string;
  description: string;
  type: ToastType;
};

export const showToast = ({ title, description, type }: ToastProps) => {
  const icon = getToastIcon(type);
  
  toast({
    title: (
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded-full ${getToastBgColor(type)}`}>
          {icon}
        </div>
        <span>{title}</span>
      </div>
    ) as any, // Type assertion to fix the type error
    description,
    variant: type === 'error' ? 'destructive' : 'default',
  });
};

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <Check className="h-4 w-4 text-mcp-green" />;
    case 'warning':
      return <Clock className="h-4 w-4 text-mcp-yellow" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-mcp-red" />;
    case 'info':
    default:
      return <Bell className="h-4 w-4 text-primary" />;
  }
};

const getToastBgColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-mcp-green/10';
    case 'warning':
      return 'bg-mcp-yellow/10';
    case 'error':
      return 'bg-mcp-red/10';
    case 'info':
    default:
      return 'bg-primary/10';
  }
};

// Demo component to show toast notifications for demonstration
export const ToastDemo = () => {
  useEffect(() => {
    // Show a welcome toast when the app loads
    setTimeout(() => {
      showToast({
        title: 'Welcome back!',
        description: 'You have 3 new notifications',
        type: 'info',
      });
    }, 1000);
    
    // Show a success toast after a delay
    setTimeout(() => {
      showToast({
        title: 'Order Completed',
        description: 'Order #ORD-001234 was successfully completed',
        type: 'success',
      });
    }, 3000);
    
    // Show a warning toast after a delay
    setTimeout(() => {
      showToast({
        title: 'Low Balance Alert',
        description: 'Your wallet balance is below ₹1,000',
        type: 'warning',
      });
    }, 5000);
  }, []);
  
  return null;
};