'use client';

import React from 'react';
import {
  X,
  Plus,
  Upload,
  Building2,
  DollarSign,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Asset, CATEGORIES } from '../data/mockAssets';

interface ListAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAsset: (newAsset: Asset) => void;
}

export const ListAssetModal: React.FC<ListAssetModalProps> = ({
  isOpen,
  onClose,
  onAddAsset
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<Asset['category']>('Machinery');
  const [type, setType] = React.useState<Asset['type']>('Rent');
  const [price, setPrice] = React.useState('200');
  const [priceUnit, setPriceUnit] = React.useState('day');
  const [location, setLocation] = React.useState('Kigali, Rwanda');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&w=1000&q=80');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created: Asset = {
      id: `gutuza-${Date.now()}`,
      title: title || 'New Equipment Asset',
      category,
      type,
      price: parseFloat(price) || 150,
      priceUnit,
      location: location.split(',')[0] || 'Kigali',
      country: location.split(',')[1]?.trim() || 'Rwanda',
      rating: 5.0,
      reviewsCount: 1,
      image: imageUrl,
      additionalImages: [],
      description: description || 'High performance asset available for verified instant booking.',
      specifications: {
        "Condition": "Excellent / Inspected",
        "Availability": "Immediate",
        "Verification": "Gutuza Verified"
      },
      owner: {
        name: "Current User",
        company: "Monetized Assets Ltd",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 5.0,
        verified: true,
        phone: "+250 788 100 200",
        responseTime: "< 5 mins",
        memberSince: "Today"
      },
      availability: "Immediate",
      featured: true,
      badge: "Newly Listed"
    };

    onAddAsset(created);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">List Your Asset on Gutuza</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Asset Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Asset Title / Name *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Komatsu PC200 Excavator or Commercial Warehouse 300m²"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Category & Listing Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Asset['category'])}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.filter(c => c.slug !== 'all').map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Transaction Model *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Asset['type'])}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rent">For Rent</option>
                  <option value="Sale">For Sale</option>
                  <option value="Service">Offer Service</option>
                </select>
              </div>
            </div>

            {/* Price & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Billing Period / Unit *
                </label>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="day">per day</option>
                  <option value="hour">per hour</option>
                  <option value="week">per week</option>
                  <option value="month">per month</option>
                  <option value="total">total price</option>
                  <option value="project">per project</option>
                </select>
              </div>
            </div>

            {/* Location & Photo URL */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location (City, Country) *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kigali, Rwanda"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Photo URL *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Asset Specifications & Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe key specs, condition, features, operator options, etc."
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Listing to Gutuza</span>
            </button>

          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Listing Published Successfully!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your asset is now discoverable across Africa. Customers can search, view specifications, and place booking orders directly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
