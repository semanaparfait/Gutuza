"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  PlusCircle,
  Heart,
  MessageSquare,
  User,
  ShieldCheck,
  LayoutDashboard,
  Store,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
interface NavbarProps {
  activeView: "marketplace" | "seller" | "admin";
  setActiveView: (view: "marketplace" | "seller" | "admin") => void;
  savedCount: number;
  onOpenListModal: () => void;
  onToggleChat: () => void;
  unreadChatCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  savedCount,
  onOpenListModal,
  onToggleChat,
  unreadChatCount,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  return (
    // Primary Navigation Bar (#111a18)
    <header className="sticky top-0 z-40 w-full bg-[#111a18] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveView("marketplace")}
              className="flex items-center gap-3 group text-left"
            >
              {/* 10% CTA / Highlight Accent (Emerald #059669) */}
              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    Gutuza
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/80 rounded-full border border-emerald-500/30 uppercase">
                    Rwanda
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block font-medium">
                  Digital Asset Marketplace
                </p>
              </div>
            </button>

            {/* View Switcher Navigation - 30% Charcoal styling with 10% Emerald Active */}
            <nav className="hidden lg:flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveView("marketplace")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeView === "marketplace"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <Store className="w-3.5 h-3.5" />
                Browse Market
              </button>
              <button
                onClick={() => setActiveView("seller")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeView === "seller"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Owner Portal
              </button>
              <button
                onClick={() => {
                  setActiveView("admin");
                  router.push("/app/admin");
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeView === "admin"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            </nav>
          </div>

          {/* Quick Header Search Bar (60% Crisp light input) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tractors, excavators, cold storage..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 10% Call to Action (CTA) Button */}
            <button
              onClick={onOpenListModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">List an Asset</span>
            </button>

            {/* Saved Favorites */}
            <button
              className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Saved Assets"
            >
              <Heart className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Direct Messages Chat Trigger */}
            <button
              onClick={onToggleChat}
              className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Direct Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center pl-2 border-l border-slate-700">
              <Link href="/app/account">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-xs border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-3">
            <div className="px-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 px-2">
              <button
                onClick={() => {
                  setActiveView("marketplace");
                  setMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-bold border ${activeView === "marketplace"
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-700 text-slate-300"
                  }`}
              >
                <Store className="w-4 h-4" />
                Market
              </button>
              <button
                onClick={() => {
                  setActiveView("seller");
                  setMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-bold border ${activeView === "seller"
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-700 text-slate-300"
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Owner
              </button>
              <button
                onClick={() => {
                  setActiveView("admin");
                  setMobileMenuOpen(false);
                  router.push("/app/admin");
                }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-bold border ${activeView === "admin"
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-slate-700 text-slate-300"
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
