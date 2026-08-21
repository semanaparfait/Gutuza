"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  PlusCircle,
  User,
  MessageCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  BarChart3,
  WalletCards,
  TrendingUp,
  MessageSquareText,
  Camera,
  Edit3,
  Save,
  Loader2,
} from "lucide-react";
import { Asset } from "../data/assetTypes";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToSellerConversations,
  type Conversation,
} from "@/lib/chatServices";
import { ChatDrawer } from "./ChatDrawer";
import { uploadAssetPhotos } from "@/lib/assetServices";

interface SellerDashboardProps {
  assets?: Asset[];
  onOpenListModal: () => void;
  onSelectAsset?: (asset: Asset) => void;
}

const STATUS_META: Record<
  NonNullable<Asset["status"]>,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "bg-amber-100 text-amber-700",
  },
  approved: {
    label: "Live on Marketplace",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-rose-100 text-rose-700",
  },
};

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  assets = [],
  onOpenListModal,
  onSelectAsset,
}) => {
  const { user, profile, updateProfile } = useAuth();
  const displayName =
    profile?.fullName || user?.displayName || "Assetify Seller";
  const avatarUrl = profile?.photoURL || user?.photoURL || "";

  // Real breakdown of this seller's own listings by moderation status —
  // used in place of the "Swaps"/"User Rating" stats that used to sit here
  // (there's no swap feature or rating system in this app; those were
  // hardcoded placeholder numbers, not real data).
  const liveCount = assets.filter(
    (a) => (a.status || "approved") === "approved",
  ).length;
  const pendingCount = assets.filter((a) => a.status === "pending").length;
  const listedValue = assets.reduce((total, asset) => total + asset.price, 0);
  const averagePrice = assets.length ? Math.round(listedValue / assets.length) : 0;
  const liveRate = assets.length ? Math.round((liveCount / assets.length) * 100) : 0;
  const rentalCount = assets.filter((asset) => asset.type === "Rent").length;
  const saleCount = assets.filter((asset) => asset.type === "Sale").length;

  // MESSAGES — real buyer conversations about this seller's listings.
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null,
  );
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    whatsappNumber: "",
    sex: "",
    location: "",
    bio: "",
    website: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const openProfileEditor = () => {
    setProfileForm({
      fullName: profile?.fullName || "",
      companyName: profile?.companyName || "",
      phoneNumber: profile?.phoneNumber || "",
      whatsappNumber: profile?.whatsappNumber || "",
      sex: profile?.sex || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
    });
    setProfilePhoto(null);
    setProfilePhotoPreview(profile?.photoURL || user?.photoURL || "");
    setProfileError("");
    setIsProfileEditorOpen(true);
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    setProfileError("");
    try {
      let photoURL = profile?.photoURL || user.photoURL || "";
      if (profilePhoto) {
        const [uploadedPhoto] = await uploadAssetPhotos(
          await user.getIdToken(),
          [profilePhoto],
        );
        if (uploadedPhoto) photoURL = uploadedPhoto;
      }
      await updateProfile({ ...profileForm, photoURL });
      setIsProfileEditorOpen(false);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Could not save your profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSellerConversations(
      user.uid,
      setConversations,
      (err) =>
        setConversationsError(
          err.message.toLowerCase().includes("permission")
            ? 'Messages aren’t loading — the Firestore security rules for the "conversations" collection may not be applied yet.'
            : "Messages aren’t loading right now.",
        ),
    );
    return () => unsubscribe();
  }, [user]);

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
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-900 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
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
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {displayName}
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-6">
                {profile?.email || user?.email || "Seller on Assetify"}
              </p>

              {/* Profile Metrics Row — real breakdown of this seller's own listings */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4">
                <div className="px-2">
                  <div className="text-xl font-extrabold text-slate-900">
                    {assets.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Listings
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-xl font-extrabold text-emerald-600">
                    {liveCount}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Live
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-xl font-extrabold text-amber-600">
                    {pendingCount}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    Pending
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openProfileEditor}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <Edit3 className="w-4 h-4" /> Complete seller profile
            </button>

            {isProfileEditorOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
                <form onSubmit={saveProfile} className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Complete your seller profile</h3>
                      <p className="mt-1 text-xs text-slate-500">Help buyers know who they are dealing with.</p>
                    </div>
                    <button type="button" onClick={() => setIsProfileEditorOpen(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-900" aria-label="Close profile editor">×</button>
                  </div>

                  <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-emerald-100 ring-4 ring-slate-100">
                      {profilePhotoPreview ? <img src={profilePhotoPreview} alt="Profile preview" className="h-full w-full object-cover" /> : <User className="m-5 h-10 w-10 text-emerald-700" />}
                      <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-emerald-700 p-2 text-white shadow-sm" title="Upload profile picture">
                        <Camera className="h-3.5 w-3.5" />
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setProfilePhoto(file); setProfilePhotoPreview(URL.createObjectURL(file)); } }} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">Upload a clear photo so buyers can recognize your business.</p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ["fullName", "Full name", "e.g. Jean Uwase"],
                      ["companyName", "Company / business name", "e.g. Kigali Equipment Ltd"],
                      ["phoneNumber", "Phone number", "+250 788 000 000"],
                      ["whatsappNumber", "WhatsApp number", "+250 788 000 000"],
                      ["location", "Exact location", "Street, district, city, country"],
                      ["website", "Website (optional)", "https://example.com"],
                    ].map(([field, label, placeholder]) => (
                      <label key={field} className="text-xs font-bold text-slate-700">
                        {label}
                        <input value={profileForm[field as keyof typeof profileForm]} onChange={(event) => setProfileForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={placeholder} required={field !== "website"} className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                      </label>
                    ))}
                    <label className="text-xs font-bold text-slate-700">Sex
                      <select value={profileForm.sex} onChange={(event) => setProfileForm((current) => ({ ...current, sex: event.target.value }))} required className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
                        <option value="">Select sex</option><option value="Female">Female</option><option value="Male">Male</option><option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </label>
                    <label className="text-xs font-bold text-slate-700 sm:col-span-2">About you / your business
                      <textarea value={profileForm.bio} onChange={(event) => setProfileForm((current) => ({ ...current, bio: event.target.value }))} rows={3} placeholder="Tell buyers about your experience, services, and response times." className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
                    </label>
                  </div>

                  {profileError && <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{profileError}</p>}
                  <button disabled={profileSaving} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-60">
                    {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {profileSaving ? "Saving profile..." : "Save profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Portfolio Statistics */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Portfolio overview</h3>
                  <p className="text-xs text-slate-500 mt-1">Live performance of your assets</p>
                </div>
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <WalletCards className="w-4 h-4 text-emerald-600 mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Listed value</p>
                  <p className="mt-1 text-lg font-black text-slate-900">RWF {listedValue.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <TrendingUp className="w-4 h-4 text-blue-600 mb-3" />
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Average price</p>
                  <p className="mt-1 text-lg font-black text-slate-900">RWF {averagePrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Live approval rate</span>
                  <span className="font-black text-emerald-700">{liveRate}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${liveRate}%` }} />
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{rentalCount} rental{rentalCount === 1 ? "" : "s"}</span>
                  <span>{saleCount} sale{saleCount === 1 ? "" : "s"}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquareText className="w-3.5 h-3.5" /> {conversations.length} chats</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN DASHBOARD CONTENT ================= */}
          <main className="lg:col-span-8 space-y-6">
            {/* Top Summary Metrics Banner — real breakdown of this seller's own listings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {assets.length}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    Total Listings
                  </div>
                </div>

                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
                    {liveCount}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    Live on Marketplace
                  </div>
                </div>

                <div className="px-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">
                    {pendingCount}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    Pending Review
                  </div>
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
                  {assets.length} {assets.length === 1 ? "listing" : "listings"}
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
                    const meta = STATUS_META[asset.status || "approved"];
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
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {asset.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-emerald-600 truncate">
                              {asset.category}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{asset.type}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-800">
                            RWF {asset.price.toLocaleString()}
                            <span className="text-slate-400 font-medium">
                              {" "}
                              / {asset.priceUnit}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {meta.label}
                          </span>
                          {asset.status === "rejected" &&
                            asset.rejectionReason && (
                              <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2 py-1 mt-1 leading-snug">
                                <span className="font-bold">Why: </span>
                                {asset.rejectionReason}
                              </p>
                            )}
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
                  {conversations.length}{" "}
                  {conversations.length === 1
                    ? "conversation"
                    : "conversations"}
                </span>
              </div>

              {conversationsError ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-800">
                  {conversationsError}
                </div>
              ) : conversations.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No buyer messages yet. They&apos;ll show up here as soon as
                    someone reaches out about one of your listings.
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
                          <img
                            src={conv.assetImage}
                            alt={conv.assetTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <MessageCircle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {conv.buyerName}
                          </h4>
                          <span className="text-xs text-slate-400 truncate">
                            on {conv.assetTitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {conv.lastMessage || "No messages yet"}
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
            ? {
                id: activeConversation.buyerId,
                name: activeConversation.buyerName,
              }
            : undefined
        }
      />
    </div>
  );
};
