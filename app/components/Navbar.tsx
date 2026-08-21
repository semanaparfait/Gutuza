"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
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
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  savedCount?: number;
  onOpenListModal?: () => void;
  onToggleChat?: () => void;
  unreadChatCount?: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const ROLE_LABEL: Record<string, string> = {
  buyer: "My Dashboard",
  seller: "Seller Dashboard",
  admin: "Admin Panel",
};

export const Navbar: React.FC<NavbarProps> = ({
  savedCount = 0,
  onOpenListModal,
  onToggleChat,
  unreadChatCount = 0,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState("All");
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  const isMarketplace = pathname === "/";
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  // While the profile is still hydrating we send people to /dashboard,
  // which itself waits and routes to the correct role once it's ready.
  const dashboardHref = profile ? `/dashboard/${profile.role}` : "/dashboard";
  const dashboardLabel = profile ? ROLE_LABEL[profile.role] ?? "My Dashboard" : "My Dashboard";
  const DashboardIcon = profile?.role === "admin" ? ShieldCheck : LayoutDashboard;

  return (
    <header className="sticky top-0 z-40 w-full dark:bg-[#111a18] dark:border-b dark:border-slate-800 dark:shadow-md">
      {/* Primary Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">

          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2 group text-left shrink-0">
              <img
                src="/Logoo.svg"
                alt="Assetify Logo"
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isMarketplace
                    ? "bg-green-900 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Browse Market
              </Link>
              {user && (
                <Link
                  href={dashboardHref}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isDashboard
                      ? "bg-green-900 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  <DashboardIcon className="w-3.5 h-3.5" />
                  {dashboardLabel}
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">

            {/* Saved Favorites Trigger */}


            {/* Direct Messages Chat Trigger */}
            <button
              onClick={() => onToggleChat?.()}
              className="relative p-2 sm:p-2.5  rounded-xl transition-colors shrink-0 "
              title="Direct Messages"
            >
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5  font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* User Profile & Auth Controls */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link href={dashboardHref} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30 text-xs font-bold">
                      {profile?.photoURL ? (
                        <img src={profile.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-white  transition-colors">
                        {profile?.fullName || user.displayName || 'User'}
                      </span>
                      <span className="text-[10px] font-semibold text-white  uppercase tracking-wider">
                        {profile?.role || 'Member'}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={async () => {
                      await logout();
                      router.push('/');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden sm:inline-flex px-3.5 py-1.5 border border-slate-700 hover:border-brand-500 hover:text-brand-400 text-slate-200 font-bold text-xs rounded-xl transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
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
            <div className={`grid gap-2 ${user ? "grid-cols-2" : "grid-cols-3"}`}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isMarketplace
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Market</span>
              </Link>

              {user ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    isDashboard
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <DashboardIcon className="w-4 h-4" />
                  <span>{profile?.role === "admin" ? "Admin" : profile?.role === "seller" ? "Seller" : "My Space"}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border bg-brand-600 border-brand-600 text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>Log In</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-bold border bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>


    </header>
  );
};
