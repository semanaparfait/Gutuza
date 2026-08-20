'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This route has moved to /dashboard/seller. Kept as a redirect so any
 * old links or bookmarks to /app/owner still land somewhere useful.
 */
export default function LegacyOwnerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/seller');
  }, [router]);

  return null;
}
