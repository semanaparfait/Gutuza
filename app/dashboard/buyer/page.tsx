'use client';

import React from 'react';
import { Navbar } from '../../components/Navbar';
import { BuyerDashboard } from '../../components/BuyerDashboard';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useRoleGuard } from '@/lib/useRoleGuard';

export default function BuyerDashboardPage() {
  const { ready } = useRoleGuard('buyer');

  if (!ready) {
    return <LoadingScreen label="Loading your dashboard..." />;
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <Navbar />
      <BuyerDashboard />
    </main>
  );
}
