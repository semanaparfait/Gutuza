'use client';

import React from 'react';
import {
  Building2,
  Search,
  MapPin,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Map as MapIcon,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Filter,
  X
} from 'lucide-react';

import { MOCK_ASSETS, Asset, CATEGORIES } from './data/mockAssets';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AssetCard } from './components/AssetCard';
import { AssetDetailModal } from './components/AssetDetailModal';
import { BookingModal } from './components/BookingModal';
import { ListAssetModal } from './components/ListAssetModal';
import { ChatDrawer } from './components/ChatDrawer';
import { subscribeToAllAssets } from '@/lib/assetServices';

export default function Home() {
  // Main State — real listings from Firestore (published via the "List an
  // Asset" flow) merged with the curated MOCK_ASSETS so the marketplace
  // never looks empty for a brand new project.
  const [liveAssets, setLiveAssets] = React.useState<Asset[]>([]);

  React.useEffect(() => {
    const unsubscribe = subscribeToAllAssets(setLiveAssets);
    return () => unsubscribe();
  }, []);

  const assets = React.useMemo(() => [...liveAssets, ...MOCK_ASSETS], [liveAssets]);

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [locationFilter, setLocationFilter] = React.useState<string>('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'map'>('grid');
  const [maxPrice, setMaxPrice] = React.useState<number>(3000);

  // Modals & Drawers State
  const [savedAssetIds, setSavedAssetIds] = React.useState<string[]>(['assetify-001']);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = React.useState<Asset | null>(null);
  const [selectedAssetForBooking, setSelectedAssetForBooking] = React.useState<Asset | null>(null);
  const [isListModalOpen, setIsListModalOpen] = React.useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = React.useState<boolean>(false);
  const [chatTargetOwner, setChatTargetOwner] = React.useState<string>('Jean-Paul Habimana');

  // Bookmark Toggle Handler
  const toggleSaveAsset = (id: string) => {
    setSavedAssetIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Chat Trigger
  const handleChatWithOwner = (ownerName: string) => {
    setChatTargetOwner(ownerName);
    setIsChatDrawerOpen(true);
  };

  // Filtering Logic
  const filteredAssets = assets.filter((ast) => {
    // Category filter
    if (selectedCategory !== 'all' && ast.category !== selectedCategory) {
      return false;
    }
    // Transaction Type filter
    if (selectedType !== 'All' && ast.type !== selectedType) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ast.title.toLowerCase().includes(q);
      const matchDesc = ast.description.toLowerCase().includes(q);
      const matchCategory = ast.category.toLowerCase().includes(q);
      const matchOwner = ast.owner.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchOwner) {
        return false;
      }
    }
    // Location filter
    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase();
      const matchLoc = ast.location.toLowerCase().includes(loc) || ast.country.toLowerCase().includes(loc);
      if (!matchLoc) return false;
    }
    // Price filter
    if (ast.price > maxPrice) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-200  font-sans">

      {/* Top Navbar */}
      <Navbar
        savedCount={savedAssetIds.length}
        onOpenListModal={() => setIsListModalOpen(true)}
        onToggleChat={() => setIsChatDrawerOpen(!isChatDrawerOpen)}
        unreadChatCount={1}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />


      {/* Main Container Views */}
      <main className="flex-1">

        <div>
            {/* Hero Banner */}
            <Hero
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              onSearch={() => { }}
            />

            {/* Marketplace Grid & Controls Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

              {/* Filter Controls Bar */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-[#0B1B41] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

                {/* Result Counter & Active Pill */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Showing <span className="text-white  font-extrabold">{filteredAssets.length}</span> Assets Available
                  </span>
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-emerald-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                {/* Price Slider & View Toggles */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">

                  {/* Price Slider */}
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Max Rate:</span>
                    <input
                      type="range"
                      min="50"
                      max="3000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-28 accent-emerald-500"
                    />
                    <span className="font-bold text-slate-900 dark:text-white min-w-[50px]">${maxPrice}</span>
                  </div>

                  {/* View Switcher (Grid | List | Map) */}
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                          ? 'bg-white dark:bg-[#192724] text-emerald-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                          ? 'bg-white dark:bg-[#192724] text-emerald-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      title="List View"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'map'
                          ? 'bg-white dark:bg-[#192724] text-emerald-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      title="Map View"
                    >
                      <MapIcon className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

              {/* Main Content Area depending on View Mode */}
              {viewMode === 'map' ? (
                /* Interactive Map View Representation */
                <div className="relative w-full h-[550px] bg-[#111a18] rounded-3xl border border-slate-800 overflow-hidden flex items-center justify-center p-6 text-white text-center">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="relative z-10 max-w-md space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-pulse">
                      <MapIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black">Interactive Geospatial Asset Radar</h3>
                    <p className="text-xs text-slate-300">
                      Locate active Caterpillar excavators, John Deere tractors, cold storage facilities, and fleet trucks pinned across Kigali, Musanze, and regional hubs.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
                      >
                        Return to Grid View
                      </button>
                    </div>
                  </div>
                </div>
              ) : filteredAssets.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                  }`}>
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      isSaved={savedAssetIds.includes(asset.id)}
                      onToggleSave={toggleSaveAsset}
                      onSelect={(ast) => setSelectedAssetForDetail(ast)}
                      onBook={(ast) => setSelectedAssetForBooking(ast)}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state when no assets match filter */
                <div className="text-center py-20 bg-white dark:bg-[#192724] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Assets Match Your Search</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try adjusting your filters, clearing keywords, or selecting a broader category.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedType('All');
                      setSearchQuery('');
                      setLocationFilter('');
                      setMaxPrice(3000);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

            </section>
        </div>

      </main>

      {/* Global Interactive Modals */}
      <AssetDetailModal
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        onBook={(ast) => {
          setSelectedAssetForDetail(null);
          setSelectedAssetForBooking(ast);
        }}
        onChatWithOwner={(owner) => {
          setSelectedAssetForDetail(null);
          handleChatWithOwner(owner);
        }}
        isSaved={selectedAssetForDetail ? savedAssetIds.includes(selectedAssetForDetail.id) : false}
        onToggleSave={toggleSaveAsset}
      />

      <BookingModal
        asset={selectedAssetForBooking}
        onClose={() => setSelectedAssetForBooking(null)}
      />

      <ListAssetModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />

      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        targetOwner={chatTargetOwner}
      />

      {/* Professional Footer */}
      <footer className="bg-[#0B1B41] text-slate-400 border-t border-slate-800 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-32   flex items-center justify-center p-0.5 shadow-md">
                  <img src="/Logoo.svg" alt="Assetify Logo" className="w-full h-full object-contain" />
                </div>
                
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empowering individuals, farmers, and business owners across Africa to monetize underutilized machinery, land, and tools.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Core Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Heavy Machinery & Excavators</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Agricultural Tractors & Implements</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cold Storage Warehouses</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">4x4 Utility & Freight Trucks</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform Guarantees</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Assetify Bank Escrow Protection</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Verified Host KYC & Inspections</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Comprehensive Asset Insurance</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">24/7 Field Operator Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Regional Network</h4>
              <div className="space-y-2 text-slate-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Kigali, Rwanda (HQ)
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  Cross-border East Africa
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  support@assetify.com
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Assetify Digital Marketplace. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-300">Security Escrow</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
