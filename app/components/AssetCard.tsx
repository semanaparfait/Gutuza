'use client';

import React from 'react';
import { 
  MapPin, 
  Star, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { Asset } from '../data/mockAssets';

interface AssetCardProps {
  asset: Asset;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (asset: Asset) => void;
  onBook: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSaved,
  onToggleSave,
  onSelect,
  onBook
}) => {
  return (
    // 60% Dominant Crisp White (#FFFFFF) Card with subtle border & shadow
    <div className="group relative bg-white  rounded-2xl border border-slate-200/90 dark:border-emerald-900/40 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Thumbnail */}
      <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={asset.image}
          alt={asset.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {/* 10% CTA / Highlight Pill */}
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
            asset.type === 'Rent' 
              ? 'bg-emerald-600' 
              : asset.type === 'Sale' 
              ? 'bg-blue-600' 
              : 'bg-purple-600'
          }`}>
            For {asset.type}
          </span>

          {asset.badge && (
            <span className="hidden px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#111a18]/90 text-emerald-400 backdrop-blur-md">
              {asset.badge}
            </span>
          )}
        </div>

        {/* Bookmark Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(asset.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isSaved 
              ? 'bg-rose-500 text-black shadow-md' 
              : 'bg-[#111a18]/60 text-black hover:bg-[#111a18]'
          }`}
          title={isSaved ? "Saved" : "Save asset"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price tag pill */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#111a18] rounded-xl text-black flex items-baseline gap-1 shadow-md">
          <span className="text-base font-black text-emerald-400">${asset.price}</span>
          <span className="text-[10px] text-slate-300">/ {asset.priceUnit}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 text-[10px]">
              {asset.category}
            </span>
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-[#111a18] dark:text-black font-bold">{asset.rating}</span>
              <span className="text-slate-400 text-[10px]">({asset.reviewsCount})</span>
            </div>
          </div>

          {/* 30% Deep Title */}
          <h3 
            onClick={() => onSelect(asset)}
            className="text-base font-bold text-[#111a18] dark:text-black line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {asset.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate">{asset.location}, {asset.country}</span>
          </div>
        </div>

        {/* Specifications snippet pill */}
        <div className="hidden flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-emerald-900/30">
          {Object.entries(asset.specifications).slice(0, 2).map(([key, val]) => (
            <span key={key} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-[#111a18] text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
              <span className="text-slate-400 dark:text-slate-500 font-normal">{key}:</span> {val}
            </span>
          ))}
        </div>

        {/* Owner Info & CTA Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/30 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <img
              src={asset.owner.avatar}
              alt={asset.owner.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-emerald-900/40"
            />
            <div className="text-[11px] leading-tight">
              <div className="flex items-center gap-1 font-bold text-[#111a18] dark:text-black truncate max-w-[100px]">
                {asset.owner.name}
                {asset.owner.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
              </div>
              <span className="text-[9px] text-slate-400">{asset.owner.responseTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(asset)}
              className="p-2 text-slate-600 hover:text-[#111a18] hover:bg-slate-100 rounded-xl transition-colors"
              title="Quick View Specs"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* 10% Call To Action Button (Emerald #059669) */}
            <button
              onClick={() => onBook(asset)}
              className="flex items-center gap-1 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              <span>{asset.type === 'Rent' ? 'Book' : asset.type === 'Sale' ? 'Buy' : 'Request'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
