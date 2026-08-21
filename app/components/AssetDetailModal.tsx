'use client';

import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Heart
} from 'lucide-react';
import { Asset } from '../data/mockAssets';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  onBook: (asset: Asset) => void;
  onChatWithOwner: (asset: Asset) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onBook,
  onChatWithOwner,
  isSaved,
  onToggleSave
}) => {
  if (!asset) return null;

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const images = [asset.image, ...(asset.additionalImages || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111a18]/70 backdrop-blur-sm overflow-y-auto">
      {/* 60% Crisp White Modal Background */}
      <div className="relative w-full max-w-4xl bg-white text-[#111a18] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-300">
              For {asset.type}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Asset ID: {asset.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(asset.id)}
              className={`p-2 rounded-full border transition-all ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-[#111a18] hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Gallery */}
            <div className="md:col-span-7 space-y-3">
              <div className="relative w-full h-72 sm:h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={images[activeImageIndex]}
                  alt={asset.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview & Booking Box */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="ml-1 text-[#111a18] font-bold">{asset.rating}</span>
                  </div>
                  <span>•</span>
                  <span className="text-slate-500">{asset.reviewsCount} verified reviews</span>
                </div>

                <h2 className="text-xl font-black text-[#111a18] leading-snug">
                  {asset.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{asset.location}, {asset.country}</span>
                </div>

                {/* Price Box */}
                <div className="py-3 px-4 bg-white rounded-xl border border-slate-200 flex items-baseline justify-between shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold">Rate:</span>
                  <div>
                    <span className="text-2xl font-black text-emerald-600">${asset.price}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {asset.priceUnit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Availability: <strong>{asset.availability}</strong></span>
                </div>
              </div>

              {/* 10% Call to Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => onBook(asset)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{asset.type === 'Rent' ? 'Book Asset Now' : asset.type === 'Sale' ? 'Purchase Asset' : 'Request Service'}</span>
                </button>

                <button
                  onClick={() => onChatWithOwner(asset)}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-[#111a18] font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chat with Owner</span>
                </button>
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#111a18] uppercase tracking-wider">
              Asset Overview & Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              {asset.description}
            </p>
          </div>

          {/* Specs */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#111a18] uppercase tracking-wider">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(asset.specifications || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">{key}</span>
                  <span className="text-xs font-bold text-[#111a18]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Box (30% Charcoal header card) */}
          <div className="p-5 bg-[#111a18] text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={asset.owner.avatar}
                alt={asset.owner.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-white">{asset.owner.name}</h4>
                  {asset.owner.verified && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{asset.owner.company || 'Private Owner'} • Member since {asset.owner.memberSince}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-300">
                  <span>Rating: <strong>{asset.owner.rating} / 5.0</strong></span>
                  <span>Response: <strong>{asset.owner.responseTime}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onChatWithOwner(asset)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Host</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
