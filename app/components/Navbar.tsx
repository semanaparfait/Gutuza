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
  Home,
  MapPin
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
  const [selectedType, setSelectedType] = React.useState("All");
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1B41] text-white border-b border-slate-800 shadow-md">
      {/* Primary Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => setActiveView("marketplace")}
              className="flex items-center gap-2 group text-left shrink-0"
            >
              <img
                src="/Logoo.svg"
                alt="Assetify Logo"
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveView("marketplace")}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeView === "marketplace"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Browse Market
              </button>
              <button
                onClick={() => setActiveView("seller")}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeView === "seller"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
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
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeView === "admin"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Home Navigation */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Home</span>
            </Link>

            {/* Primary Action: List an Asset Button */}
            <button
              onClick={onOpenListModal}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">List an Asset</span>
              <span className="sm:hidden">List</span>
            </button>

            {/* Saved Favorites Trigger */}
            <button
              className="relative p-2 sm:p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
              title="Saved Assets"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Direct Messages Chat Trigger */}
            <button
              onClick={onToggleChat}
              className="relative p-2 sm:p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
              title="Direct Messages"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar Link */}
            <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-800">
              <Link href="/app/account">
                <div className="flex items-center gap-1.5 px-2 py-1.5 sm:py-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors text-xs font-semibold">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Profile</span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setActiveView("marketplace");
                  setMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  activeView === "marketplace"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Market</span>
              </button>
              <button
                onClick={() => {
                  setActiveView("seller");
                  setMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  activeView === "seller"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Owner</span>
              </button>
              <button
                onClick={() => {
                  setActiveView("admin");
                  setMobileMenuOpen(false);
                  router.push("/app/admin");
                }}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  activeView === "admin"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Search & Filter Sub-Bar - Fully Responsive Grid/Flex */}
      <div className="bg-[#081432] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-4">
          
          {/* Search Input Field */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment, tools & machinery..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-700/80 rounded-xl text-xs text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
            />
          </div>

          {/* Location Selector Dropdown */}
          <div className="relative w-full md:w-48 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <select className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-700/80 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium appearance-none cursor-pointer">
              <option value="all">Any location</option>
              <option value="kigali">Kigali</option>
              <option value="gatenga">Gatenga</option>
              <option value="kicukiro">Kicukiro</option>
            </select>
          </div>

          {/* Listing Type Tabs (Horizontal Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 shrink-0">
            {["All", "Rent", "Sale", "Service"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedType === t
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-900/50 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800"
                }`}
              >
                {t === "All"
                  ? "All Listings"
                  : t === "Rent"
                    ? "For Rent"
                    : t === "Sale"
                      ? "For Sale"
                      : "Services"}
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
};
