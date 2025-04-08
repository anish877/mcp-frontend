"use client";
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Settings as SettingsIcon, 
  Save, 
  Clock, 
  MapPin, 
  Shield 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences</p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <TabsList className="flex flex-col h-auto bg-card p-1 lg:p-2 space-y-1">
                <TabsTrigger value="profile" className="justify-start px-4 py-2 h-10">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start px-4 py-2 h-10">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="payment" className="justify-start px-4 py-2 h-10">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start px-4 py-2 h-10">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="justify-start px-4 py-2 h-10">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Preferences
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="lg:w-3/4">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="sm:w-1/4 flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24">
                          <AvatarFallback className="text-xl">MCP</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                      
                      <div className="sm:w-3/4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="MCP Admin" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue="admin@mcpnexus.com" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue="+91 9876543210" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input id="company" defaultValue="MCP Nexus Pvt Ltd" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue="42, Business Park, Tech Hub" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" defaultValue="Bangalore" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" defaultValue="Karnataka" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" defaultValue="560001" />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button>Update Password</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Login Sessions</h3>
                      <div className="space-y-2">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Shield className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Current Session</p>
                                <div className="flex items-center text-sm text-muted-foreground gap-2">
                                  <span>Chrome on Windows</span>
                                  <span>•</span>
                                  <span>Bangalore, India</span>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-mcp-green/10 text-mcp-green hover:bg-mcp-green/20">
                              Active Now
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Log Out of All Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Credit & Debit Cards</h3>
                      <div className="p-4 border border-border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">HDFC Credit Card</p>
                              <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
                            </div>
                          </div>
                          <Badge variant="outline">Default</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Expires 09/25
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive">Remove</Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add New Card
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Bank Accounts</h3>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">SBI Bank Account</p>
                              <p className="text-sm text-muted-foreground">Account ending in 5678</p>
                            </div>
                          </div>
                          <Badge variant="outline">Default</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add New Bank Account
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">UPI IDs</h3>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-16 bg-muted rounded-md flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Primary UPI</p>
                              <p className="text-sm text-muted-foreground">mcp@ybl</p>
                            </div>
                          </div>
                          <Badge variant="outline">Verified</Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add New UPI ID
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">App Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Notifications about order status changes
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Payment Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Notifications about payments and wallet activities
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Partner Activities</p>
                            <p className="text-sm text-muted-foreground">
                              Updates about partner actions and performance
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">System Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Important system announcements and updates
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Daily Summary</p>
                            <p className="text-sm text-muted-foreground">
                              Receive a daily summary of activities
                            </p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Report</p>
                            <p className="text-sm text-muted-foreground">
                              Receive weekly performance reports
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Important Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Critical notifications and high-priority alerts
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">SMS Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Critical Alerts</p>
                            <p className="text-sm text-muted-foreground">
                              Receive SMS for critical system alerts
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Status</p>
                            <p className="text-sm text-muted-foreground">
                              Receive SMS for order status changes
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                    <CardDescription>Customize your system settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Regional Settings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Time Zone</Label>
                          <Select defaultValue="Asia/Kolkata">
                            <SelectTrigger id="timezone">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">US Eastern (EST)</SelectItem>
                              <SelectItem value="Europe/London">UK (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date-format">Date Format</Label>
                          <Select defaultValue="dd/MM/yyyy">
                            <SelectTrigger id="date-format">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select defaultValue="INR">
                            <SelectTrigger id="currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                              <SelectItem value="USD">US Dollar ($)</SelectItem>
                              <SelectItem value="EUR">Euro (€)</SelectItem>
                              <SelectItem value="GBP">British Pound (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger id="language">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                              <SelectItem value="te">Telugu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Order Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto-assign Orders</p>
                            <p className="text-sm text-muted-foreground">
                              Automatically assign orders to available partners
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="assignment-logic">Assignment Logic</Label>
                          <Select defaultValue="proximity">
                            <SelectTrigger id="assignment-logic">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="proximity">By Proximity</SelectItem>
                              <SelectItem value="load">By Partner Load</SelectItem>
                              <SelectItem value="efficiency">By Efficiency Rating</SelectItem>
                              <SelectItem value="round-robin">Round Robin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Appearance</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select defaultValue="light">
                            <SelectTrigger id="theme">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="system">System Default</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Compact Mode</p>
                            <p className="text-sm text-muted-foreground">
                              Display more content with reduced spacing
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
