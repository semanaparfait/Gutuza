export interface Asset {
  id: string;
  title: string;
  // A built-in category name, or any free-text category a seller enters
  // via the "Other" option when listing an asset.
  category: string;
  type: "Rent" | "Sale" | "Service";
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
  sellerId?: string;
  status?: "pending" | "approved" | "rejected";
  // Set by an admin when rejecting a listing (e.g. an illegal or prohibited
  // item, misleading info, poor photos). Shown to the seller on their
  // dashboard so they know what to fix or why the listing was declined.
  // Cleared automatically if the listing is later approved or reset to pending.
  rejectionReason?: string;
  createdAtMillis?: number;
}

export const CATEGORIES = [
  { name: "All Categories", icon: "LayoutGrid", slug: "all" },
  { name: "Machinery", icon: "HardHat", slug: "Machinery" },
  { name: "Vehicles", icon: "Truck", slug: "Vehicles" },
  { name: "Agriculture", icon: "Tractor", slug: "Agriculture" },
  { name: "Real Estate", icon: "Building2", slug: "Real Estate" },
  { name: "Energy", icon: "Zap", slug: "Energy" },
  { name: "Tools", icon: "Wrench", slug: "Tools" },
  { name: "Services", icon: "Briefcase", slug: "Services" },
];
