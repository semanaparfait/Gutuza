export interface Asset {
  id: string;
  title: string;
  category: 'Machinery' | 'Vehicles' | 'Real Estate' | 'Agriculture' | 'Tools' | 'Services' | 'Energy';
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
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: "gutuza-001",
    title: "Caterpillar 320 Hydraulic Excavator (20-Ton)",
    category: "Machinery",
    type: "Rent",
    price: 350,
    priceUnit: "day",
    location: "Kigali Industrial Zone",
    country: "Rwanda",
    rating: 4.9,
    reviewsCount: 28,
    image: "https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Heavy-duty 2022 CAT 320 excavator available for short-term construction and mining contracts. Comes with experienced certified operator and fuel management options.",
    specifications: {
      "Operating Weight": "22,500 kg",
      "Engine Power": "174 HP",
      "Bucket Capacity": "1.2 m³",
      "Fuel Included": "Optional",
      "Operator Provided": "Yes (Certified)"
    },
    owner: {
      name: "Jean-Paul Habimana",
      company: "Kigali Heavy Equipment Ltd",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 4.95,
      verified: true,
      phone: "+250 788 123 456",
      responseTime: "< 15 mins",
      memberSince: "Jan 2023"
    },
    availability: "Immediate",
    featured: true,
    badge: "Verified Machinery"
  },
  {
    id: "gutuza-002",
    title: "John Deere 6120M Agricultural Tractor + Implements",
    category: "Agriculture",
    type: "Rent",
    price: 180,
    priceUnit: "day",
    location: "Musanze Agriculture Hub",
    country: "Rwanda",
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1530267981608-bc70a31963b6?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "120HP 4WD John Deere tractor complete with 3-disc plough, rotavator, and seed drill attachment. Ideal for commercial seasonal plowing and harvesting.",
    specifications: {
      "Horsepower": "120 HP",
      "Drive": "4WD",
      "Attachments": "Plough, Rotavator included",
      "Fuel Tank": "205 L",
      "Min Booking": "2 Days"
    },
    owner: {
      name: "AgriTech Cooperative Rwanda",
      company: "AgriTech Co-op",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 4.88,
      verified: true,
      phone: "+250 789 987 654",
      responseTime: "< 1 hour",
      memberSince: "Mar 2022"
    },
    availability: "Available Next Week",
    featured: true,
    badge: "High Demand"
  },
  {
    id: "gutuza-003",
    title: "Commercial Cold Storage & Logistics Hub (500 SqM)",
    category: "Real Estate",
    type: "Rent",
    price: 1200,
    priceUnit: "month",
    location: "Kigali Special Economic Zone",
    country: "Rwanda",
    rating: 5.0,
    reviewsCount: 14,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Temperature-controlled warehouse (-18°C to +4°C) designed for perishable produce, pharmaceutical goods, and food distributors with 24/7 backup power.",
    specifications: {
      "Total Area": "500 sq meters",
      "Temperature Range": "-18°C to +8°C",
      "Loading Docks": "2 Hydraulic Docks",
      "Security": "CCTV + 24/7 Guards",
      "Backup Power": "250 kVA Auto-Generator"
    },
    owner: {
      name: "Divine Muhire",
      company: "Apex Logistics & Storage",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      verified: true,
      phone: "+250 785 112 233",
      responseTime: "< 30 mins",
      memberSince: "Nov 2021"
    },
    availability: "Immediate",
    featured: true,
    badge: "Prime Location"
  },
  {
    id: "gutuza-004",
    title: "Toyota Hilux GD-6 4x4 Double Cab Utility Truck",
    category: "Vehicles",
    type: "Rent",
    price: 90,
    priceUnit: "day",
    location: "Downtown Kigali",
    country: "Rwanda",
    rating: 4.9,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Rugged 2023 4x4 Toyota Hilux ready for site visits, field research, and tough terrain across Rwanda and regional borders. Self-drive or chauffeur options.",
    specifications: {
      "Engine": "2.8L Turbo Diesel",
      "Transmission": "Automatic 4WD",
      "Capacity": "5 Passengers + Cargo Bed",
      "Insurance": "Comprehensive Included",
      "Mileage Limit": "Unlimited within Rwanda"
    },
    owner: {
      name: "Eric Ndayishimiye",
      company: "Safari Drive Fleet",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 4.91,
      verified: true,
      phone: "+250 788 445 566",
      responseTime: "< 10 mins",
      memberSince: "Feb 2022"
    },
    availability: "Immediate",
    featured: false
  },
  {
    id: "gutuza-005",
    title: "Cummins 150 kVA Silent Industrial Generator",
    category: "Energy",
    type: "Rent",
    price: 140,
    priceUnit: "day",
    location: "Bugesera Commercial Area",
    country: "Rwanda",
    rating: 4.7,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [],
    description: "Reliable, soundproof 150 kVA diesel generator for outdoor events, construction sites, emergency backup, or factory testing. Includes ATS panel.",
    specifications: {
      "Output": "150 kVA / 120 kW",
      "Fuel Type": "Diesel",
      "Noise Level": "68 dB at 7 meters",
      "Delivery": "Truck crane delivery available",
      "ATS": "Automatic Transfer Switch Included"
    },
    owner: {
      name: "PowerGrid Solutions",
      company: "PowerGrid Ltd",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      rating: 4.82,
      verified: true,
      phone: "+250 782 990 011",
      responseTime: "< 20 mins",
      memberSince: "Jul 2022"
    },
    availability: "Immediate",
    featured: false
  },
  {
    id: "gutuza-006",
    title: "Professional Drone Surveying & Mapping Service",
    category: "Services",
    type: "Service",
    price: 450,
    priceUnit: "project",
    location: "Kigali / Nationwide",
    country: "Rwanda",
    rating: 5.0,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "High-accuracy RTK drone aerial surveying, 3D topographical mapping, agricultural health monitoring, and construction progress modeling.",
    specifications: {
      "Equipment": "DJI Matrice 300 RTK + LiDAR",
      "Accuracy": "Sub-centimeter (GCP validated)",
      "Deliverables": "CAD / GIS Orthomosaic / Point Cloud",
      "Turnaround": "48 Hours",
      "Permits": "RCAA Drone Flight Permits Handled"
    },
    owner: {
      name: "Aline Uwase",
      company: "GeoAero Analytics",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      verified: true,
      phone: "+250 783 778 899",
      responseTime: "< 15 mins",
      memberSince: "May 2023"
    },
    availability: "Book 2 Days Ahead",
    featured: true,
    badge: "Top Rated Service"
  },
  {
    id: "gutuza-007",
    title: "Scaffolding & Structural Formwork Package (1000 SqM)",
    category: "Tools",
    type: "Rent",
    price: 250,
    priceUnit: "week",
    location: "Nyarugenge, Kigali",
    country: "Rwanda",
    rating: 4.6,
    reviewsCount: 11,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [],
    description: "Heavy steel frame ringlock scaffolding system certified for multi-story building construction. Includes safety boards, couplers, and jack bases.",
    specifications: {
      "Total Coverage": "Up to 1,000 sq meters",
      "System Type": "Steel Ringlock",
      "Safety Cert": "ISO 9001 / BS standard",
      "Transport": "Pickup or On-site Delivery"
    },
    owner: {
      name: "BuildFast Rwanda",
      company: "BuildFast Supplies",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
      rating: 4.7,
      verified: true,
      phone: "+250 788 000 111",
      responseTime: "< 2 hours",
      memberSince: "Aug 2022"
    },
    availability: "Immediate",
    featured: false
  },
  {
    id: "gutuza-008",
    title: "Solar Powered Irrigation Pump System (5 HP)",
    category: "Agriculture",
    type: "Sale",
    price: 2400,
    priceUnit: "unit",
    location: "Rwamagana District",
    country: "Rwanda",
    rating: 4.9,
    reviewsCount: 23,
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80",
    additionalImages: [],
    description: "Complete off-grid agricultural solar pumping kit with 5HP brushless submersible pump, 3kW mono-solar array, mounting racks, and smart controller.",
    specifications: {
      "Pump Capacity": "30,000 Liters / Hour",
      "Max Head": "80 Meters",
      "Solar Panel Array": "3.2 kW Tier-1 Monocrystalline",
      "Warranty": "3 Years Pump / 25 Years Panels"
    },
    owner: {
      name: "SunAgri Innovations",
      company: "SunAgri Africa",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
      rating: 4.93,
      verified: true,
      phone: "+250 781 223 344",
      responseTime: "< 30 mins",
      memberSince: "Oct 2021"
    },
    availability: "In Stock (3 Units)",
    featured: false,
    badge: "Eco-Friendly"
  }
];

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
