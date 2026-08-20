// POST /api/upload
//
// Accepts multipart/form-data with one or more `files` entries plus a
// `Authorization: Bearer <Firebase ID token>` header. Verifies the token
// server-side (so a caller can't upload "as" a seller they aren't), then
// pushes each file to Cloudflare R2 under assets/<uid>/... and returns the
// public URLs. Firestore only ever stores these URLs — never the raw file.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';
import { uploadToR2 } from '@/lib/r2';

const MAX_FILES = 5;
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB per photo

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (err) {
    console.error('Failed to verify ID token:', err);
    // This catch fires for two very different problems: a genuinely bad/expired
    // token, OR the Firebase Admin SDK itself failing to initialize (missing env
    // vars, a malformed private key, a project ID mismatch). Those need very
    // different fixes, so surface the real message outside of production
    // instead of always saying "invalid token" — that phrasing sends people
    // down the wrong troubleshooting path when the actual issue is server config.
    const detail = err instanceof Error ? err.message : String(err);
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Invalid or expired auth token'
        : `Invalid or expired auth token — ${detail}`;
    return NextResponse.json({ error: message }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `You can upload at most ${MAX_FILES} photos` }, { status: 400 });
  }

  try {
    const urls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: `"${file.name}" is not an image` }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `"${file.name}" is larger than 8MB` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const key = `assets/${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

      const url = await uploadToR2(key, buffer, file.type);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Upload to R2 failed:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
