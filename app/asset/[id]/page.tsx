"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Heart,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Navbar } from "@/app/components/Navbar";
import { BookingModal } from "@/app/components/BookingModal";
import { ChatDrawer, type ChatContext } from "@/app/components/ChatDrawer";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { Asset } from "@/app/data/assetTypes";
import { getAssetById } from "@/lib/assetServices";

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = React.useState<Asset | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [activeImage, setActiveImage] = React.useState(0);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getAssetById(id)
      .then((loadedAsset) => {
        if (!cancelled) setAsset(loadedAsset);
      })
      .catch(() => {
        if (!cancelled) setLoadError("This asset could not be loaded right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingScreen label="Loading asset details..." />;

  if (!asset || loadError) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
          <h1 className="text-2xl font-black">Asset not found</h1>
          <p className="mt-2 text-sm text-slate-500">{loadError || "This listing may have been removed."}</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" /> Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  const images = [asset.image, ...(asset.additionalImages || [])].filter(Boolean);
  const chatContext: ChatContext = {
    assetId: asset.id,
    assetTitle: asset.title,
    assetImage: asset.image,
    sellerId: asset.sellerId || "",
    sellerName: asset.owner.name,
  };
  const actionLabel = asset.type === "Rent" ? "Request to Book" : asset.type === "Sale" ? "Request to Purchase" : "Request Service";

  return (
    <main className="min-h-screen bg-[#f7f8f8] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Browse all assets
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
              <div className="aspect-[5/3] overflow-hidden rounded-lg bg-slate-200 shadow-sm">
                <img src={images[activeImage] || asset.image} alt={asset.title} className="h-full w-full object-cover" />
              </div>
              <div className="order-last grid grid-cols-4 gap-2 md:order-none md:grid-cols-2">
                {images.slice(0, 6).map((image, index) => (
                  <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`aspect-[4/3] overflow-hidden rounded-xl border-2 bg-white ${activeImage === index ? "border-emerald-600" : "border-transparent"}`}>
                    <img src={image} alt={`${asset.title} view ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-b border-slate-200 py-7">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800">{asset.category}</span>
                <span className="rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">For {asset.type}</span>
                <button onClick={() => setIsSaved((saved) => !saved)} className="ml-auto inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-600">
                  <Heart className={`h-5 w-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} /> {isSaved ? "Saved" : "Save"}
                </button>
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{asset.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-emerald-600" /> {asset.location}, {asset.country}
                <span className="text-slate-300">•</span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {asset.rating} ({asset.reviewsCount} reviews)
              </div>
            </div>

            <section className="border-b border-slate-200 py-7">
              <h2 className="text-xl font-black">Key Specifications</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(asset.specifications || {}).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{key}</p>
                    <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                ))}
                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Availability</p>
                  <p className="mt-2 text-sm font-bold text-slate-900">{asset.availability}</p>
                </div>
              </div>
            </section>

            <section className="border-b border-slate-200 py-7">
              <h2 className="text-xl font-black">Description</h2>
              <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600">{asset.description || "No description provided for this asset."}</p>
            </section>

            <section className="border-b border-slate-200 py-7">
              <h2 className="text-xl font-black">Features & Attachments</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Object.keys(asset.specifications || {}).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feature}</div>
                ))}
              </div>
            </section>

            <section className="mt-7 flex flex-col items-start justify-between gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <img src={asset.owner.avatar} alt={asset.owner.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-100" />
                <div>
                  <div className="flex items-center gap-2"><h2 className="font-black">{asset.owner.name}</h2>{asset.owner.verified && <ShieldCheck className="h-4 w-4 text-emerald-600" />}</div>
                  <p className="mt-1 text-xs text-slate-500">{asset.owner.company || "Private Owner"} · Member since {asset.owner.memberSince}</p>
                  <p className="mt-1 text-xs font-bold text-emerald-700">★ {asset.owner.rating} · {asset.owner.responseTime} response</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700"><MessageSquare className="h-4 w-4" /> Contact Seller</button>
            </section>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-baseline gap-2"><span className="text-3xl font-black">RWF {asset.price.toLocaleString()}</span><span className="text-sm text-slate-500">/ {asset.priceUnit}</span></div>
              <p className="mt-2 text-xs text-slate-500">Final pricing and availability are confirmed by the seller.</p>
              <div className="my-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-3 text-xs"><div><p className="font-bold uppercase text-slate-400">Transaction</p><p className="mt-1 font-bold">{asset.type}</p></div><div><p className="font-bold uppercase text-slate-400">Location</p><p className="mt-1 font-bold">{asset.location}</p></div></div>
              <button onClick={() => setIsBookingOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-4 text-base font-black text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800"><Calendar className="h-5 w-5" /> {actionLabel}</button>
              <button onClick={() => setIsChatOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700 hover:border-emerald-600 hover:text-emerald-700"><MessageSquare className="h-4 w-4" /> Chat with Seller</button>
              <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-xs text-slate-600"><p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-emerald-600" /> {asset.availability} availability</p><p className="flex items-center gap-2"><Truck className="h-4 w-4 text-emerald-600" /> Delivery details confirmed after request</p><p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Assetify verified listing</p></div>
            </div>
          </aside>
        </div>
      </div>

      <BookingModal asset={isBookingOpen ? asset : null} onClose={() => setIsBookingOpen(false)} />
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} context={chatContext} />
    </main>
  );
}
