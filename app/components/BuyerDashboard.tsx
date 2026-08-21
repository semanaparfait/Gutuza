"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  ChevronRight,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { Asset } from "../data/assetTypes";
import { useAuth } from "@/context/AuthContext";
import { subscribeToBuyerBookings, type Booking } from "@/lib/bookingServices";

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }
  const startLabel = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} - ${endLabel}`;
}

export const BuyerDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  const displayName =
    profile?.fullName || user?.displayName || "Assetify Member";
  const avatarUrl = profile?.photoURL || user?.photoURL || "";
  const memberSince = profile?.createdAt ? "Assetify Member" : "New Member";

  // Real bookings from Firestore — written by BookingModal when a buyer
  // confirms a booking. Empty until the buyer has actually booked something.
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  React.useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    const unsubscribe = subscribeToBuyerBookings(user.uid, setBookings);
    return () => unsubscribe();
  }, [user]);

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const totalSpent = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // Saved/wishlist assets aren't backed by a real collection yet — there's
  // no `savedAssets` Firestore data to read, so this genuinely starts empty
  // rather than being seeded with sample listings. Saving from the
  // marketplace isn't wired up to persist anywhere yet either (see the
  // project notes) — this is a real, honest empty state, not a stand-in.
  const savedAssets: Asset[] = [];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 text-center">
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

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {displayName}
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {profile?.email || user?.email}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-6">
                <ShieldCheck className="w-3 h-3" />
                Buyer • {memberSince}
              </span>

              <div className="grid grid-cols-2 divide-x divide-slate-200 border-t border-slate-100 pt-4">
                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">
                    {activeBookings.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Bookings
                  </div>
                </div>
                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">
                    {savedAssets.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Saved
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-2">
              <h3 className="text-base font-bold text-slate-900 mb-2 px-1">
                Quick actions
              </h3>
              <Link
                href="/"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <Search className="w-5 h-5 text-slate-500" />
                <span>Browse the Marketplace</span>
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left">
                <MessageSquare className="w-5 h-5 text-slate-500" />
                <span>Messages with Owners</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left">
                <Heart className="w-5 h-5 text-slate-500" />
                <span>Wishlist & Alerts</span>
              </button>
            </div>
          </aside>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <main className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {activeBookings.length}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    Active Bookings
                  </div>
                </div>
                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {savedAssets.length}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    Saved Assets
                  </div>
                </div>
                <div className="px-4">
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">
                    Total Spent
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                    ${totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* MY BOOKINGS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  My Active Bookings
                </h3>
              </div>

              {activeBookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-500">
                    You haven&apos;t booked any assets yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4" />
                    Browse the Marketplace
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={booking.assetSnapshot.image}
                            alt={booking.assetSnapshot.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight line-clamp-1">
                            {booking.assetSnapshot.title}
                          </h4>

                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{booking.assetSnapshot.location}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {formatDateRange(
                                booking.startDate,
                                booking.endDate,
                              )}
                            </span>
                          </div>

                          <div className="pt-0.5">
                            {booking.status === "confirmed" ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-[#15803D] text-white shadow-sm">
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border border-amber-500 text-amber-700 bg-amber-50/60">
                                Awaiting Owner Approval
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-sm font-bold text-slate-900">
                          ${booking.totalPrice.toLocaleString()}
                        </span>
                        <button className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SAVED / WISHLIST */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm sm:text-base font-extrabold uppercase text-slate-800 tracking-wide">
                  Saved Assets
                </h3>
                <Link
                  href="/"
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <span>Browse More</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {savedAssets.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-500">
                    You haven&apos;t saved any assets yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all active:scale-[0.98]"
                  >
                    <Search className="w-4 h-4" />
                    Browse the Marketplace
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={asset.image}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight line-clamp-1">
                            {asset.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{asset.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-sm font-bold text-slate-900">
                          ${asset.price}/{asset.priceUnit}
                        </span>
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* CTA Banner */}
            <section className="bg-[#0B1B41] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">
                  Looking for something specific?
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Browse thousands of verified assets available to rent, buy, or
                  swap near you.
                </p>
              </div>
              <Link
                href="/"
                className="shrink-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                Explore Marketplace
              </Link>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
