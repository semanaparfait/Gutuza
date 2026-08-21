'use client';

import React from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tractor, 
  HardHat, 
  Truck, 
  Building2, 
  Zap, 
  Wrench, 
  Briefcase,
  LayoutGrid
} from 'lucide-react';
import { CATEGORIES } from '../data/assetTypes';

interface HeroProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (loc: string) => void;
  onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  onSearch
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HardHat': return <HardHat className="w-4 h-4" />;
      case 'Truck': return <Truck className="w-4 h-4" />;
      case 'Tractor': return <Tractor className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Wrench': return <Wrench className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    // Primary #111a18 Hero Section
    <div >
      
      {/* Background Accent Glow */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" /> */}


    </div>
  );
};
