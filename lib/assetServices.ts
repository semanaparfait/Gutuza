// Firestore persistence for marketplace assets listed by sellers, plus the
// client-side call into our own /api/upload route for photo storage.
//
// Design notes:
// - `subscribeToSellerAssets` filters with a single `where("sellerId", "==", ...)`
//   clause and sorts client-side by `createdAt` instead of combining `where`
//   with an `orderBy` on a different field — that combination would require a
//   Firestore composite index to be created manually in the console.
// - Photos are uploaded to Cloudflare R2 (via the server-side /api/upload
//   route, see lib/r2.ts) before the Firestore write, so the Firestore
//   document only ever stores durable `https://...` URLs, never ephemeral
//   `blob:`/`URL.createObjectURL()` references (those only resolve inside
//   the browser tab that created them). The upload goes through our own
//   API route rather than straight to R2 from the browser because R2's S3
//   API needs a secret access key that can never be shipped to the client;
//   the route verifies the caller's Firebase ID token first so only a
//   signed-in user can upload, under their own uid.
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
  type QuerySnapshot,
  type DocumentData,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Asset } from '../app/data/mockAssets';

const ASSETS_COLLECTION = 'assets';

export type NewAssetInput = Omit<Asset, 'id' | 'image' | 'additionalImages' | 'sellerId'> & {
  sellerId: string;
};

// Generic gray "no image" placeholder — used whenever a Firestore asset
// document is missing its cover photo.
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
      '<rect width="100%" height="100%" fill="#e2e8f0"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#94a3b8">No Image</text>' +
      '</svg>'
  );

const DEFAULT_OWNER: Asset['owner'] = {
  name: 'Assetify Seller',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  rating: 5.0,
  verified: false,
  phone: '',
  responseTime: 'N/A',
  memberSince: 'Recently',
};

/**
 * Fills in safe defaults for any field missing from a raw Firestore asset
 * document. Firestore itself won't reject a document that's missing fields
 * our UI expects — e.g. a document created by hand in the console while
 * testing security rules — so every read goes through this rather than
 * trusting the document shape.
 */
function normalizeAssetDoc(id: string, data: DocumentData): Asset {
  const owner =
    data.owner && typeof data.owner === 'object'
      ? { ...DEFAULT_OWNER, ...data.owner }
      : DEFAULT_OWNER;

  return {
    id,
    title: typeof data.title === 'string' && data.title ? data.title : 'Untitled Asset',
    category: typeof data.category === 'string' && data.category ? data.category : 'General',
    type: data.type === 'Sale' || data.type === 'Service' ? data.type : 'Rent',
    price: typeof data.price === 'number' ? data.price : 0,
    priceUnit: typeof data.priceUnit === 'string' && data.priceUnit ? data.priceUnit : 'day',
    location: typeof data.location === 'string' && data.location ? data.location : 'Kigali',
    country: typeof data.country === 'string' && data.country ? data.country : 'Rwanda',
    rating: typeof data.rating === 'number' ? data.rating : 5.0,
    reviewsCount: typeof data.reviewsCount === 'number' ? data.reviewsCount : 0,
    image: typeof data.image === 'string' && data.image ? data.image : PLACEHOLDER_IMAGE,
    additionalImages: Array.isArray(data.additionalImages) ? data.additionalImages : [],
    description: typeof data.description === 'string' ? data.description : '',
    specifications:
      data.specifications && typeof data.specifications === 'object' ? data.specifications : {},
    owner,
    availability: typeof data.availability === 'string' && data.availability ? data.availability : 'Immediate',
    featured: !!data.featured,
    badge: typeof data.badge === 'string' ? data.badge : undefined,
    sellerId: typeof data.sellerId === 'string' ? data.sellerId : undefined,
  };
}

/**
 * Uploads each photo file to Cloudflare R2 (via /api/upload) and resolves
 * to the list of public URLs, in the same order as the input files. The
 * first URL is treated as the listing's cover image.
 *
 * `idToken` is the current user's Firebase Auth ID token (from
 * `await user.getIdToken()`) — the API route verifies it server-side
 * before uploading anything, so only a signed-in seller can call this.
 */
export async function uploadAssetPhotos(idToken: string, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.urls as string[];
}

/**
 * Writes a new asset listing document to Firestore, associated with the
 * seller who created it via `sellerId`. Returns the new document's id.
 */
export async function createAssetListing(
  input: NewAssetInput,
  photoUrls: string[]
): Promise<string> {
  const docRef = await addDoc(collection(db, ASSETS_COLLECTION), {
    ...input,
    image: photoUrls[0] || '',
    additionalImages: photoUrls.slice(1),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

function snapshotToAssets(snapshot: QuerySnapshot<DocumentData>): Asset[] {
  const withTimestamps = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as DocumentData & { createdAt?: Timestamp };
    const { createdAt, ...rest } = data;
    return {
      asset: normalizeAssetDoc(docSnap.id, rest),
      createdAtMillis: createdAt?.toMillis ? createdAt.toMillis() : 0,
    };
  });

  // Sort newest-first client-side (see module notes on avoiding a
  // composite index).
  withTimestamps.sort((a, b) => b.createdAtMillis - a.createdAtMillis);

  return withTimestamps.map((entry) => entry.asset);
}

/**
 * Subscribes to every asset listed on the marketplace, newest first.
 * Calls `callback` immediately with the current data and again on every
 * change. Call the returned function to unsubscribe.
 *
 * `onError` fires if the subscription itself fails — most commonly a
 * Firestore security-rules rejection (e.g. the `assets` collection's
 * "allow read: if true" rule hasn't been applied in the console yet).
 * Without this, a rejected read fails silently: `callback` simply never
 * fires again, so the UI just quietly keeps showing whatever it rendered
 * before (typically nothing live at all) with no error anywhere.
 */
export function subscribeToAllAssets(
  callback: (assets: Asset[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const assetsQuery = query(collection(db, ASSETS_COLLECTION));
  return onSnapshot(
    assetsQuery,
    (snapshot) => callback(snapshotToAssets(snapshot)),
    (error) => {
      console.error('subscribeToAllAssets failed:', error);
      onError?.(error);
    }
  );
}

/**
 * Subscribes to only the assets listed by one seller, newest first.
 * Call the returned function to unsubscribe. See `subscribeToAllAssets`
 * for why `onError` matters.
 */
export function subscribeToSellerAssets(
  sellerId: string,
  callback: (assets: Asset[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const assetsQuery = query(collection(db, ASSETS_COLLECTION), where('sellerId', '==', sellerId));
  return onSnapshot(
    assetsQuery,
    (snapshot) => callback(snapshotToAssets(snapshot)),
    (error) => {
      console.error('subscribeToSellerAssets failed:', error);
      onError?.(error);
    }
  );
}
