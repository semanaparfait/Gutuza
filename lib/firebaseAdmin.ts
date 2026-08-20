// Server-only Firebase Admin setup. Used by API routes to verify a
// client's Firebase Auth ID token before trusting who they say they are
// (e.g. before letting them upload photos to Cloudflare R2 under their own
// seller id). NEVER import this file from a 'use client' component — the
// service account credentials must never reach the browser.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Lazily initialized so a missing env var only throws when an API route
// actually tries to verify a token, not at module-import/build time.
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Report exactly which var(s) are missing rather than a blanket message —
  // "all three" vs. "just one" points at very different problems (the env
  // file not being picked up at all, vs. one line having a typo).
  const missing: string[] = [];
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID) missing.push('FIREBASE_ADMIN_PROJECT_ID');
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
  if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase Admin env var(s): ${missing.join(', ')}. Set them in .env.local (at the project root) and fully restart \`npm run dev\` — env files are only read at server start.`
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
