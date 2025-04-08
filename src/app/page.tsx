"use client";
import { useEffect } from 'react';
import { ToastDemo } from '@/components/notifications/ToastNotification';
import { useRouter } from 'next/navigation';

const Index = () => {
  const navigate = useRouter();

  useEffect(() => {
    navigate.push('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loading MCP Nexus...</h1>
        <p className="text-muted-foreground mt-2">Please wait while we set up your dashboard</p>
      </div>
      {/* Toast demo component for initial notifications */}
      <ToastDemo />
    </div>
  );
};

export default Index;