'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This route has moved to /dashboard/admin. Kept as a redirect so any
 * old links or bookmarks to /app/admin still land somewhere useful.
 */
export default function LegacyAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return null;
}
