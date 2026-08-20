'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Login/signup now live at /login and /signup. Kept as a redirect so any
 * old links or bookmarks to /app/account still land somewhere useful.
 */
export default function LegacyAccountRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
