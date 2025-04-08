
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  ShoppingBag, 
  Bell, 
  Settings,
  LogOut,
  LogIn
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const location = usePathname();
  const path = location;
  
  // In a real app, you would check if user is authenticated here
  const isLoggedIn = true;
  
  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader>
        <div className="px-2 py-2">
          <h1 className="text-xl font-bold text-sidebar-foreground truncate">MCP Nexus</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path === '/'}
                  tooltip="Dashboard"
                >
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path.startsWith('/partners')}
                  tooltip="Partners"
                >
                  <Link href="/partners">
                    <Users />
                    <span>Partners</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path.startsWith('/wallet')}
                  tooltip="Wallet"
                >
                  <Link href="/wallet">
                    <Wallet />
                    <span>Wallet</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path.startsWith('/orders')}
                  tooltip="Orders"
                >
                  <Link href="/orders">
                    <ShoppingBag />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path.startsWith('/notifications')}
                  tooltip="Notifications"
                >
                  <Link href="/notifications">
                    <Bell />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={path.startsWith('/settings')}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          {isLoggedIn ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Logout"
              >
                <Link href="/login">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={path.startsWith('/login')}
                tooltip="Login"
              >
                <Link href="/login">
                  <LogIn />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}