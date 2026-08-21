export interface Asset {
  id: string;
  title: string;
  // A built-in category name, or any free-text category a seller enters
  // via the "Other" option when listing an asset.
  category: string;
  type: 'Rent' | 'Sale' | 'Service';
  price: number;
  priceUnit: string;
  location: string;
  country: string;
  rating: number;
  reviewsCount: number;
  image: string;
  additionalImages: string[];
  description: string;
  specifications: Record<string, string>;
  owner: {
    name: string;
    avatar: string;
    company?: string;
    rating: number;
    verified: boolean;
    phone: string;
    responseTime: string;
    memberSince: string;
  };
  availability: string;
  featured: boolean;
  badge?: string;
  // Present on assets created through the "List an Asset" flow and stored
  // in Firestore — the uid of the seller who owns this listing.
  sellerId?: string;
  // Admin moderation state. New listings are created as 'pending' and only
  // appear in the public marketplace once an admin approves them. Absent
  // on any Firestore document written before this field existed — treated
  // as 'approved' by the data layer for backward compatibility.
  status?: 'pending' | 'approved' | 'rejected';
  // When this asset was created, as epoch milliseconds — populated for
  // Firestore-backed listings (used by the Admin Console to show "Submitted
  // 2h ago").
  createdAtMillis?: number;
}

// This file used to also export a MOCK_ASSETS array of sample listings for
// local development/demo purposes. It's been removed now that every part
// of the app reads real listings from Firestore (see lib/assetServices.ts)
// — keeping fake listings around risked them being mistaken for real data.
// The Asset interface and CATEGORIES taxonomy below are real/structural
// and still used throughout the app.

export const CATEGORIES = [
  { name: 'All Categories', icon: 'LayoutGrid', slug: 'all' },
  { name: 'Machinery', icon: 'HardHat', slug: 'Machinery' },
  { name: 'Vehicles', icon: 'Truck', slug: 'Vehicles' },
  { name: 'Agriculture', icon: 'Tractor', slug: 'Agriculture' },
  { name: 'Real Estate', icon: 'Building2', slug: 'Real Estate' },
  { name: 'Energy', icon: 'Zap', slug: 'Energy' },
  { name: 'Tools', icon: 'Wrench', slug: 'Tools' },
  { name: 'Services', icon: 'Briefcase', slug: 'Services' }
];
