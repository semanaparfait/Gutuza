// Firestore persistence for asset bookings made by buyers.
//
// Mirrors the conventions in assetServices.ts:
// - Every booking stores a denormalized snapshot of the asset (title,
//   image, location, price, priceUnit, seller name) at the moment of
//   booking. This is deliberate, not laziness: an asset's price or photos
//   can change (or the listing can be removed) after a booking is made,
//   and a booking record should keep showing what the buyer actually
//   agreed to, not whatever the live listing looks like today.
// - `subscribeToBuyerBookings` filters with a single `where("buyerId", "==", ...)`
//   clause and sorts client-side by `createdAt`, avoiding the need for a
//   manually-created Firestore composite index (same reasoning as
//   `subscribeToSellerAssets` in assetServices.ts).
// - `normalizeBookingDoc` fills in safe defaults for any field a raw
//   document is missing, so a malformed/hand-edited doc can't crash the UI.
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

const BOOKINGS_COLLECTION = 'bookings';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentMethod = 'momo' | 'card' | 'bank';

export interface Booking {
  id: string;
  assetId: string;
  // null when the booked asset predates sellerId (the static MOCK_ASSETS
  // catalog) rather than being a real Firestore listing.
  sellerId: string | null;
  buyerId: string;
  assetSnapshot: {
    title: string;
    image: string;
    location: string;
    price: number;
    priceUnit: string;
    ownerName: string;
  };
  startDate: string;
  endDate: string;
  days: number;
  includeOperator: boolean;
  includeInsurance: boolean;
  paymentMethod: PaymentMethod;
  basePrice: number;
  operatorFee: number;
  insuranceFee: number;
  serviceFee: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: unknown;
}

export interface CreateBookingInput {
  asset: Asset;
  buyerId: string;
  startDate: string;
  endDate: string;
  days: number;
  includeOperator: boolean;
  includeInsurance: boolean;
  paymentMethod: PaymentMethod;
  basePrice: number;
  operatorFee: number;
  insuranceFee: number;
  serviceFee: number;
  totalPrice: number;
}

/**
 * Writes a new booking document to Firestore. Returns the new document's id
 * (used to show the buyer a real booking reference instead of a fake one).
 */
export async function createBooking(input: CreateBookingInput): Promise<string> {
  const { asset, buyerId, ...pricing } = input;

  const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
    assetId: asset.id,
    sellerId: asset.sellerId ?? null,
    buyerId,
    assetSnapshot: {
      title: asset.title,
      image: asset.image,
      location: asset.location,
      price: asset.price,
      priceUnit: asset.priceUnit,
      ownerName: asset.owner?.name || 'Assetify Seller',
    },
    ...pricing,
    status: 'pending' as BookingStatus,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

const DEFAULT_ASSET_SNAPSHOT: Booking['assetSnapshot'] = {
  title: 'Untitled Asset',
  image: '',
  location: 'Kigali',
  price: 0,
  priceUnit: 'day',
  ownerName: 'Assetify Seller',
};

function normalizeBookingDoc(id: string, data: DocumentData): Booking {
  const assetSnapshot =
    data.assetSnapshot && typeof data.assetSnapshot === 'object'
      ? { ...DEFAULT_ASSET_SNAPSHOT, ...data.assetSnapshot }
      : DEFAULT_ASSET_SNAPSHOT;

  return {
    id,
    assetId: typeof data.assetId === 'string' ? data.assetId : '',
    sellerId: typeof data.sellerId === 'string' ? data.sellerId : null,
    buyerId: typeof data.buyerId === 'string' ? data.buyerId : '',
    assetSnapshot,
    startDate: typeof data.startDate === 'string' ? data.startDate : '',
    endDate: typeof data.endDate === 'string' ? data.endDate : '',
    days: typeof data.days === 'number' ? data.days : 1,
    includeOperator: !!data.includeOperator,
    includeInsurance: !!data.includeInsurance,
    paymentMethod:
      data.paymentMethod === 'card' || data.paymentMethod === 'bank' ? data.paymentMethod : 'momo',
    basePrice: typeof data.basePrice === 'number' ? data.basePrice : 0,
    operatorFee: typeof data.operatorFee === 'number' ? data.operatorFee : 0,
    insuranceFee: typeof data.insuranceFee === 'number' ? data.insuranceFee : 0,
    serviceFee: typeof data.serviceFee === 'number' ? data.serviceFee : 0,
    totalPrice: typeof data.totalPrice === 'number' ? data.totalPrice : 0,
    status: data.status === 'confirmed' || data.status === 'cancelled' ? data.status : 'pending',
    createdAt: data.createdAt,
  };
}

function snapshotToBookings(snapshot: QuerySnapshot<DocumentData>): Booking[] {
  const withTimestamps = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as DocumentData & { createdAt?: Timestamp };
    return {
      booking: normalizeBookingDoc(docSnap.id, data),
      createdAtMillis: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
    };
  });

  // Sort newest-first client-side (see module notes on avoiding a composite index).
  withTimestamps.sort((a, b) => b.createdAtMillis - a.createdAtMillis);

  return withTimestamps.map((entry) => entry.booking);
}

/**
 * Subscribes to every booking made by one buyer, newest first. Calls
 * `callback` immediately with the current data and again on every change.
 * Call the returned function to unsubscribe.
 */
export function subscribeToBuyerBookings(
  buyerId: string,
  callback: (bookings: Booking[]) => void
): Unsubscribe {
  const bookingsQuery = query(collection(db, BOOKINGS_COLLECTION), where('buyerId', '==', buyerId));
  return onSnapshot(bookingsQuery, (snapshot) => callback(snapshotToBookings(snapshot)));
}
