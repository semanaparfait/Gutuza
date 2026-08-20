'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '../components/LoadingScreen';

/**
 * Central "landing pad" after login. Waits for the auth profile to
 * hydrate, then sends the user to the dashboard that matches their role.
 */
export default function DashboardIndex() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (profile) {
      router.replace(`/dashboard/${profile.role}`);
    }
  }, [loading, user, profile, router]);

  return <LoadingScreen label="Taking you to your dashboard..." />;
}
