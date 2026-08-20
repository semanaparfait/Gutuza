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

import { Asset, CATEGORIES } from './data/mockAssets';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AssetCard } from './components/AssetCard';
import { AssetDetailModal } from './components/AssetDetailModal';
import { BookingModal } from './components/BookingModal';
import { ListAssetModal } from './components/ListAssetModal';
import { ChatDrawer } from './components/ChatDrawer';
import { subscribeToAllAssets } from '@/lib/assetServices';

export default function Home() {
  // Main State — real listings from Firestore, published via the "List an
  // Asset" flow. The marketplace used to merge these with a curated
  // MOCK_ASSETS catalog so it never looked empty for a brand-new project;
  // per request, it now shows only real data — an empty catalog renders its
  // own "No Assets Listed Yet" state below instead of falling back to
  // sample listings.
  const [liveAssets, setLiveAssets] = React.useState<Asset[]>([]);
  const [liveAssetsError, setLiveAssetsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToAllAssets(
      (assets) => {
        setLiveAssetsError(null);
        setLiveAssets(assets);
      },
      (err) => {
        // Most likely cause: the Firestore security rules for the "assets"
        // collection reject this read (e.g. not applied yet, or a signed-out
        // visitor isn't covered by them). Since the marketplace no longer
        // falls back to a sample catalog, a failed read means an empty grid,
        // so this needs to be visible rather than silent.
        setLiveAssetsError(
          err.message.toLowerCase().includes('permission')
            ? 'Live listings aren’t loading — the Firestore security rules for the "assets" collection may not be applied yet.'
            : `Live listings aren’t loading (${err.message}).`
        );
      }
    );
    return () => unsubscribe();
  }, []);

  const assets = liveAssets;

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [locationFilter, setLocationFilter] = React.useState<string>('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'map'>('grid');

  // The "Max Rate" slider was previously hardcoded to a 50–3000 range sized
  // for the old MOCK_ASSETS catalog's USD-scale prices ($50–$3000). Real
  // listings are priced in RWF (a modest listing defaults to 25,000 if left
  // blank), so a hardcoded max of 3000 would silently filter out every real
  // listing whose raw price number exceeds it — the asset would still be in
  // `assets`, just never reaching `filteredAssets`. The slider's ceiling is
  // derived from the actual prices present instead of a fixed number, with
  // 3000 only as the floor/fallback before any real listings have loaded.
  // `priceFilterTouched` makes sure that once someone actually drags the
  // slider, new listings loading in afterward don't silently override their
  // choice.
  const priceCeiling = React.useMemo(() => {
    const prices = assets.map((a) => a.price).filter((p) => Number.isFinite(p));
    return prices.length ? Math.max(3000, ...prices) : 3000;
  }, [assets]);
  const [maxPrice, setMaxPrice] = React.useState<number>(3000);
  const [priceFilterTouched, setPriceFilterTouched] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!priceFilterTouched) {
      setMaxPrice(priceCeiling);
    }
  }, [priceCeiling, priceFilterTouched]);

  // Modals & Drawers State
  // Previously seeded with 'assetify-001', a MOCK_ASSETS id — now that the
  // mock catalog is gone from this page, that id would never match a real
  // asset, so it starts empty instead of silently doing nothing.
  const [savedAssetIds, setSavedAssetIds] = React.useState<string[]>([]);
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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">

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

              {/* Live listings error — surfaced instead of failing silently */}
              {liveAssetsError && (
                <div className="flex items-start gap-2 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <span>{liveAssetsError}</span>
                </div>
              )}

              {/* Filter Controls Bar */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-brand-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

                {/* Result Counter & Active Pill */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Showing <span className="text-white  font-extrabold">{filteredAssets.length}</span> Assets Available
                  </span>
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-800/80 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-brand-900">
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
                      max={priceCeiling}
                      step={Math.max(50, Math.round(priceCeiling / 100 / 50) * 50)}
                      value={maxPrice}
                      onChange={(e) => {
                        setPriceFilterTouched(true);
                        setMaxPrice(Number(e.target.value));
                      }}
                      className="w-28 accent-brand-600"
                    />
                    <span className="font-bold text-slate-900 dark:text-white min-w-[50px]">${maxPrice}</span>
                  </div>

                  {/* View Switcher (Grid | List | Map) */}
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                          ? 'bg-white dark:bg-[#192724] text-brand-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                          ? 'bg-white dark:bg-[#192724] text-brand-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      title="List View"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'map'
                          ? 'bg-white dark:bg-[#192724] text-brand-600 shadow-sm'
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
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#1f5eff_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="relative z-10 max-w-md space-y-4">
                    <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto border border-brand-500/40 animate-pulse">
                      <MapIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black font-display">Interactive Geospatial Asset Radar</h3>
                    <p className="text-xs text-slate-300">
                      Locate active Caterpillar excavators, John Deere tractors, cold storage facilities, and fleet trucks pinned across Kigali, Musanze, and regional hubs.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20"
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
              ) : assets.length === 0 ? (
                /* Nothing has been listed in Firestore yet — distinct from
                   "filters matched nothing" below, since there's no mock
                   catalog anymore to guarantee the grid is never empty. */
                <div className="text-center py-20 bg-white dark:bg-[#192724] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Assets Listed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Be the first to list machinery, land, or tools on Assetify.
                  </p>
                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    List an Asset
                  </button>
                </div>
              ) : (
                /* Real listings exist, but none match the current filters */
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
                      setPriceFilterTouched(false);
                      setMaxPrice(priceCeiling);
                    }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
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
      <footer className="bg-brand-900 text-slate-400 border-t border-slate-800 text-xs py-12">
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
                <li><a href="#" className="hover:text-brand-400 transition-colors">Heavy Machinery & Excavators</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Agricultural Tractors & Implements</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Cold Storage Warehouses</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">4x4 Utility & Freight Trucks</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Platform Guarantees</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Assetify Bank Escrow Protection</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Verified Host KYC & Inspections</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Comprehensive Asset Insurance</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">24/7 Field Operator Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Regional Network</h4>
              <div className="space-y-2 text-slate-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  Kigali, Rwanda (HQ)
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  Cross-border East Africa
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-400" />
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
