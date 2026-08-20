'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Tv,
  Home as HomeIcon,
  Tag,
  MapPin,
  ChevronRight,
  ChevronDown,
  User
} from 'lucide-react';
import { Asset } from '../data/mockAssets';

interface SellerDashboardProps {
  assets?: Asset[];
  onOpenListModal: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  assets = [],
  onOpenListModal,
  onSelectAsset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tools');
  const [viewAllSwaps, setViewAllSwaps] = useState<boolean>(false);
  const [viewAllWishlist, setViewAllWishlist] = useState<boolean>(false);

  // Mock Active Swaps matching the provided mockup design
  const activeSwapsData = [
    {
      id: 'swap-001',
      title: 'My Makita Power Drill',
      location: 'Kigali City',
      status: 'in_progress',
      statusLabel: 'Swap In Progress',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
      partner: {
        name: 'John D.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      },
    },
    {
      id: 'swap-002',
      title: 'Child Bicycle',
      location: 'Kigali City',
      status: 'listed',
      statusLabel: 'Listed for Swap/Sale',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80',
      partner: null,
      typeLabel: 'for Swap/Sale',
    },
  ];

  // Mock Wishlist & Alerts items matching the design mockup
  const wishlistData = [
    {
      id: 'wish-001',
      title: 'Mechanic Tools',
      location: 'Kigali City',
      tags: [
        { label: 'Swap', color: 'text-emerald-600' },
        { label: 'Rent', color: 'text-amber-700' },
      ],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
      typeLabel: 'for Swap/Sale',
    },
  ];

  const categories = [
    { id: 'tools', name: 'Tools', icon: Wrench },
    { id: 'electronics', name: 'Electronics', icon: Tv },
    { id: 'home', name: 'Home Goods', icon: HomeIcon },
    { id: 'hobbies', name: 'Hobbies', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid Layout: Left Sidebar & Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ================= LEFT SIDEBAR (Profile & Categories) ================= */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 text-center">
              {/* Profile Avatar */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-emerald-100 border-4 border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80"
                    alt="John D."
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <User className="w-14 h-14 text-emerald-700" />
                </div>
              </div>

              {/* User Name & Handle */}
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">John D.</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">@metify.combrom</p>

              {/* Profile Metrics Row */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">
                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">12</div>
                  <div className="text-xs font-semibold text-slate-500">Swaps</div>
                </div>

                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">4</div>
                  <div className="text-xs font-semibold text-slate-500">Listings</div>
                </div>

                <div className="px-2">
                  <div className="text-xs font-semibold text-slate-500 mb-0.5">User Rating</div>
                  <div className="text-xl font-black text-emerald-600 flex items-center justify-center gap-1">
                    4.8
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Categories Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4 px-1">Popular categories</h3>
              
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {/* Active Indicator Bar on Left */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-600 rounded-r-full" />
                      )}
                      <Icon className={`w-5 h-5 ${isActive ? 'text-slate-800' : 'text-slate-500'}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

          </aside>


          {/* ================= RIGHT MAIN DASHBOARD CONTENT ================= */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Top Summary Metrics Banner */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">12</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Total Swaps</div>
                </div>

                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">4</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Active Listings</div>
                </div>

                <div className="px-4">
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">User Rating</div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600">4.8</div>
                </div>
              </div>
            </div>

            {/* ACTIVE SWAPS Section */}
            <section className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  ACTIVE SWAPS
                </h3>
                <button
                  onClick={() => setViewAllSwaps(!viewAllSwaps)}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>View All</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${viewAllSwaps ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Active Swaps List */}
              <div className="space-y-3">
                {activeSwapsData.map((swap) => (
                  <div
                    key={swap.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
                  >
                    {/* Item Thumbnail & Basic Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={swap.image}
                          alt={swap.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {swap.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{swap.location}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="pt-0.5">
                          {swap.status === 'in_progress' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-[#15803D] text-white shadow-sm">
                              Swap In Progress
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border border-emerald-600 text-emerald-700 bg-emerald-50/40">
                              Listed for Swap/Sale
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Partner / Arrow Control */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {swap.partner ? (
                        <div className="flex items-center gap-2 bg-slate-50 sm:bg-transparent px-3 sm:px-0 py-1.5 sm:py-0 rounded-xl">
                          <span className="text-slate-400 font-bold text-sm">➡</span>
                          <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                            <img src={swap.partner.avatar} alt={swap.partner.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800">{swap.partner.name}</span>
                        </div>
                      ) : (
                        <div className="text-xs font-bold">
                          <span className="text-emerald-600">for Swap</span>
                          <span className="text-amber-700">/Sale</span>
                        </div>
                      )}

                      <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* WISHLIST & ALERTS Section */}
            <section className="space-y-4 pt-2">
              {/* Section Header */}
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  WISHLIST & ALERTS
                </h3>
                <button
                  onClick={() => setViewAllWishlist(!viewAllWishlist)}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>View All</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${viewAllWishlist ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Wishlist Items List */}
              <div className="space-y-3">
                {wishlistData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
                  >
                    {/* Item Thumbnail & Basic Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs font-bold">
                            {item.tags.map((t, idx) => (
                              <React.Fragment key={t.label}>
                                <span className={t.color}>{t.label}</span>
                                {idx < item.tags.length - 1 && <span className="text-slate-400">/</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Chevron & Link */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-xs font-bold">
                        <span className="text-emerald-600">for Swap</span>
                        <span className="text-amber-700">/Sale</span>
                      </div>

                      <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </main>

        </div>

      </div>
    </div>
  );
};
