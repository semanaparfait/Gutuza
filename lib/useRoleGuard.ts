'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserProfile } from '@/context/AuthContext';

/**
 * Protects a dashboard route so only a signed-in user with the matching
 * `role` can see it. Anyone else is redirected:
 *  - not signed in           -> /login
 *  - signed in, wrong role   -> their own /dashboard/<role>
 *
 * Usage:
 *   const { ready } = useRoleGuard('seller');
 *   if (!ready) return <LoadingScreen />;
 */
export function useRoleGuard(requiredRole: UserProfile['role']) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Profile is still hydrating from Firestore right after auth resolves.
    if (!profile) return;

    if (profile.role !== requiredRole) {
      router.replace(`/dashboard/${profile.role}`);
    }
  }, [loading, user, profile, requiredRole, router]);

  const ready = !loading && !!user && !!profile && profile.role === requiredRole;

  return { ready, user, profile };
}
