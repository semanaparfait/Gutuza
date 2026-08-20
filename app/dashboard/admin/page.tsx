'use client';

import React from 'react';
import { Navbar } from '../../components/Navbar';
import { AdminDashboard } from '../../components/AdminDashboard';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useRoleGuard } from '@/lib/useRoleGuard';

export default function AdminDashboardPage() {
  const { ready } = useRoleGuard('admin');

  if (!ready) {
    return <LoadingScreen label="Loading the admin console..." />;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07120f]">
      <Navbar />
      <AdminDashboard />
    </main>
  );
}
