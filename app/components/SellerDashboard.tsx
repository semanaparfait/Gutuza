'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Tv,
  Home as HomeIcon,
  Tag,
  ChevronRight,
  PlusCircle,
  User,
  MessageCircle,
  Clock3,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Asset } from '../data/mockAssets';
import { useAuth } from '@/context/AuthContext';
import { subscribeToSellerConversations, type Conversation } from '@/lib/chatServices';
import { ChatDrawer } from './ChatDrawer';

interface SellerDashboardProps {
  assets?: Asset[];
  onOpenListModal: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

const STATUS_META: Record<
  NonNullable<Asset['status']>,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: { label: 'Pending Review', icon: Clock3, className: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Live on Marketplace', icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'bg-rose-100 text-rose-700' },
};

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  assets = [],
  onOpenListModal,
  onSelectAsset,
}) => {
  const { user, profile } = useAuth();
  const displayName = profile?.fullName || user?.displayName || 'Assetify Seller';
  const avatarUrl = profile?.photoURL || user?.photoURL || '';

  const [selectedCategory, setSelectedCategory] = useState<string>('tools');

  // Real breakdown of this seller's own listings by moderation status —
  // used in place of the "Swaps"/"User Rating" stats that used to sit here
  // (there's no swap feature or rating system in this app; those were
  // hardcoded placeholder numbers, not real data).
  const liveCount = assets.filter((a) => (a.status || 'approved') === 'approved').length;
  const pendingCount = assets.filter((a) => a.status === 'pending').length;

  // MESSAGES — real buyer conversations about this seller's listings.
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSellerConversations(
      user.uid,
      setConversations,
      (err) => setConversationsError(
        err.message.toLowerCase().includes('permission')
          ? 'Messages aren’t loading — the Firestore security rules for the "conversations" collection may not be applied yet.'
          : 'Messages aren’t loading right now.'
      )
    );
    return () => unsubscribe();
  }, [user]);

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

            {/* Primary CTA: List a new asset on the marketplace */}
            <button
              onClick={onOpenListModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-2xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-5 h-5" />
              List a New Asset
            </button>

            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 text-center">
              {/* Profile Avatar */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-emerald-100 border-4 border-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-emerald-700" />
                  )}
                </div>
              </div>

              {/* User Name & Handle */}
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{displayName}</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">{profile?.email || user?.email || 'Seller on Assetify'}</p>

              {/* Profile Metrics Row — real breakdown of this seller's own listings */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">
                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">{assets.length}</div>
                  <div className="text-xs font-semibold text-slate-500">Listings</div>
                </div>

                <div className="px-2">
                  <div className="text-xl font-extrabold text-emerald-600">{liveCount}</div>
                  <div className="text-xs font-semibold text-slate-500">Live</div>
                </div>

                <div className="px-2">
                  <div className="text-xl font-extrabold text-amber-600">{pendingCount}</div>
                  <div className="text-xs font-semibold text-slate-500">Pending</div>
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
            
            {/* Top Summary Metrics Banner — real breakdown of this seller's own listings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">{assets.length}</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Total Listings</div>
                </div>

                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{liveCount}</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Live on Marketplace</div>
                </div>

                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">{pendingCount}</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Pending Review</div>
                </div>
              </div>
            </div>

            {/* MY LISTINGS Section — real listings this seller has published, live from Firestore */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  MY LISTINGS
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  {assets.length} {assets.length === 1 ? 'listing' : 'listings'}
                </span>
              </div>

              {assets.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-500">
                    You haven&apos;t listed any assets yet.
                  </p>
                  <button
                    onClick={onOpenListModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all active:scale-[0.98]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    List Your First Asset
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assets.map((asset) => {
                    const meta = STATUS_META[asset.status || 'approved'];
                    const StatusIcon = meta.icon;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => onSelectAsset?.(asset)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center gap-4 text-left hover:border-emerald-400 hover:shadow-md transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={asset.image}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{asset.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-emerald-600 truncate">{asset.category}</span>
                            <span>•</span>
                            <span className="capitalize">{asset.type}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            RWF {asset.price.toLocaleString()}
                            <span className="text-slate-400 font-medium"> / {asset.priceUnit}</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* MESSAGES Section — real buyer conversations, live from Firestore */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  MESSAGES
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                </span>
              </div>

              {conversationsError ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-800">
                  {conversationsError}
                </div>
              ) : conversations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No buyer messages yet. They&apos;ll show up here as soon as someone reaches out about one of your listings.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center gap-4 text-left hover:border-emerald-400 hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center">
                        {conv.assetImage ? (
                          <img src={conv.assetImage} alt={conv.assetTitle} className="w-full h-full object-cover" />
                        ) : (
                          <MessageCircle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{conv.buyerName}</h4>
                          <span className="text-xs text-slate-400 truncate">on {conv.assetTitle}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </section>

          </main>

        </div>

      </div>

      <ChatDrawer
        isOpen={!!activeConversation}
        onClose={() => setActiveConversation(null)}
        context={
          activeConversation
            ? {
                assetId: activeConversation.assetId,
                assetTitle: activeConversation.assetTitle,
                assetImage: activeConversation.assetImage,
                sellerId: activeConversation.sellerId,
                sellerName: activeConversation.sellerName,
              }
            : null
        }
        viewAsBuyer={
          activeConversation
            ? { id: activeConversation.buyerId, name: activeConversation.buyerName }
            : undefined
        }
      />
    </div>
  );
};
