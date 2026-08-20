'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Safety net: some accounts still carry the legacy "owner" role value
 * (pre-dating the buyer/seller/admin rename), which briefly produced a
 * /dashboard/owner link before AuthContext started normalizing roles.
 * Redirect it straight to the real seller dashboard.
 */
export default function LegacyDashboardOwnerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/seller');
  }, [router]);

  return null;
}
