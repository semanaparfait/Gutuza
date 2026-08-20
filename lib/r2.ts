// Server-only helper for uploading files to a Cloudflare R2 bucket via its
// S3-compatible API. NEVER import this from a 'use client' component — the
// R2 access keys must never reach the browser. All uploads go through the
// /api/upload route instead, which is the only thing that imports this.
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 env vars. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in .env.local.'
    );
  }

  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return cachedClient;
}

/**
 * Uploads a single file's bytes to the configured R2 bucket under `key`
 * and returns its public URL (built from R2_PUBLIC_URL, e.g. the bucket's
 * r2.dev subdomain or a connected custom domain).
 */
export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrlBase = process.env.R2_PUBLIC_URL;

  if (!bucket || !publicUrlBase) {
    throw new Error(
      'Missing R2 env vars. Set R2_BUCKET_NAME and R2_PUBLIC_URL in .env.local.'
    );
  }

  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${publicUrlBase.replace(/\/$/, '')}/${key}`;
}
