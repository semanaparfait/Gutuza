'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Plus,
  Upload,
  Tag,
  DollarSign,
  MapPin,
  FileText,
  CheckCircle2,
  Sparkles,
  ImagePlus,
  AlertCircle,
  Loader2,
} from 'lucide-react';
// import { Asset, CATEGORIES } from '../data/mockAssets';
import { useAuth } from '@/context/AuthContext';
import { uploadAssetPhotos, createAssetListing, NewAssetInput } from '@/lib/assetServices';

interface ListAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingPhoto {
  file: File;
  previewUrl: string;
}

const MAX_PHOTOS = 5;

const SectionHeading: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-200 dark:border-slate-800">
    <span className="text-emerald-600 dark:text-emerald-400">{icon}</span>
    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </h4>
  </div>
);

export const ListAssetModal: React.FC<ListAssetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Machinery');
  const [customCategory, setCustomCategory] = useState('');
  // const [type, setType] = useState<Asset['type']>('Rent');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('day');
  const [location, setLocation] = useState('Kigali, Rwanda');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Kept in sync with `photos` so the unmount cleanup effect below always
  // revokes whatever is current, not a stale first-render value.
  const photosRef = useRef<PendingPhoto[]>([]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // Reset the form on close (called from the close button / "Done" button
  // below) so the next time the modal opens it's clean rather than showing
  // the last listing's data or success screen.
  const resetForm = () => {
    photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setTitle('');
    setCategory('Machinery');
    setCustomCategory('');
    // setType('Rent');
    setPrice('');
    setPriceUnit('day');
    setLocation('Kigali, Rwanda');
    setDescription('');
    setPhotos([]);
    setError('');
    setSuccess(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose();
  };

  // Revoke any remaining object URLs if the component itself unmounts.
  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  if (!isOpen) return null;

  const handleTypeChange = (value: Asset['type']) => {
    setType(value);
    if (value === 'Sale') setPriceUnit('total');
    else if (value === 'Service') setPriceUnit('project');
    else setPriceUnit('day');
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file later
    if (!files.length) return;

    const room = MAX_PHOTOS - photos.length;
    const toAdd: PendingPhoto[] = files.slice(0, room).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    if (toAdd.length) setError('');
    setPhotos((prev) => [...prev, ...toAdd]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be signed in as a seller to list an asset.');
      return;
    }

    if (photos.length === 0) {
      setError('Add at least one photo of your asset.');
      return;
    }

    const finalCategory = category === 'Other' ? customCategory.trim() : category;
    if (category === 'Other' && !finalCategory) {
      setError('Enter a category name.');
      return;
    }

    setError('');
    setSubmitting(true);

    const sellerName = profile?.fullName || user.displayName || 'Assetify Seller';

    let photoUrls: string[];
    try {
      const idToken = await user.getIdToken();
      photoUrls = await uploadAssetPhotos(idToken, photos.map((p) => p.file));
    } catch (err) {
      console.error('Failed to upload photos:', err);
      const detail = err instanceof Error ? err.message : '';
      setError(
        detail
          ? `Could not upload your photos: ${detail}`
          : 'Could not upload your photos. Check that the Cloudflare R2 environment variables are set on the server, then try again.'
      );
      setSubmitting(false);
      return;
    }

    try {
      const input: NewAssetInput = {
        sellerId: user.uid,
        title: title || 'New Equipment Asset',
        category: finalCategory,
        type,
        price: parseFloat(price) || 25000,
        priceUnit,
        location: location.split(',')[0]?.trim() || 'Kigali',
        country: location.split(',')[1]?.trim() || 'Rwanda',
        rating: 5.0,
        reviewsCount: 1,
        description: description || 'High performance asset available for verified instant booking.',
        specifications: {
          "Condition": "Excellent / Inspected",
          "Availability": "Immediate",
          "Verification": "Assetify Verified"
        },
        owner: {
          name: sellerName,
          company: sellerName,
          avatar: profile?.photoURL || user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          rating: 5.0,
          verified: true,
          phone: profile?.phoneNumber || "+250 788 100 200",
          responseTime: "< 5 mins",
          memberSince: "Today"
        },
        availability: "Immediate",
        featured: true,
        badge: "Newly Listed",
      };

      await createAssetListing(input, photoUrls);

      setSuccess(true);
    } catch (err) {
      console.error('Failed to save listing:', err);
      setError(
        'Your photos uploaded, but saving the listing failed — this usually means the Firestore security rules for the "assets" collection aren’t set yet. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">List Your Asset on Assetify</h3>
          </div>
          <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-white rounded-full disabled:opacity-40" disabled={submitting}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-7 max-h-[75vh] overflow-y-auto">

            {/* ===== Basic Details ===== */}
            <div className="space-y-4">
              <SectionHeading icon={<Tag className="w-3.5 h-3.5" />}>Basic Details</SectionHeading>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asset Title / Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Komatsu PC200 Excavator or Commercial Warehouse 300m²"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    {CATEGORIES.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                    <option value="Other">Other (specify)</option>
                  </select>
                  {category === 'Other' && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Type your category, e.g. Drone Equipment"
                      className="mt-2 w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Model *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value as Asset['type'])}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="Rent">For Rent</option>
                    <option value="Sale">For Sale</option>
                    <option value="Service">Offer Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ===== Pricing ===== */}
            <div className="space-y-3">
              <SectionHeading icon={<DollarSign className="w-3.5 h-3.5" />}>Pricing</SectionHeading>

              <div className={`grid gap-4 ${type === 'Rent' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price (RWF) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[11px] font-extrabold text-slate-400">
                      RWF
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="25,000"
                      className="w-full pl-12 pr-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {type === 'Rent' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Billing Period *
                    </label>
                    <select
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    >
                      <option value="hour">per hour</option>
                      <option value="day">per day</option>
                      <option value="week">per week</option>
                      <option value="month">per month</option>
                    </select>
                  </div>
                )}
              </div>

              {type !== 'Rent' && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {type === 'Sale'
                    ? 'Listed as a one-time sale price.'
                    : 'Listed as a fixed price for the whole project.'}
                </p>
              )}
            </div>

            {/* ===== Photos ===== */}
            <div className="space-y-3">
              <SectionHeading icon={<ImagePlus className="w-3.5 h-3.5" />}>Photos</SectionHeading>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {photos.map((photo, index) => (
                  <div
                    key={photo.previewUrl}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group"
                  >
                    <img src={photo.previewUrl} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded-md">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove photo"
                      disabled={submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-[9px] font-bold text-center px-1">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesSelected}
                      className="hidden"
                      disabled={submitting}
                    />
                  </label>
                )}
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {photos.length}/{MAX_PHOTOS} photos added. The first photo becomes the cover image.
              </p>
            </div>

            {/* ===== Location & Description ===== */}
            <div className="space-y-4">
              <SectionHeading icon={<FileText className="w-3.5 h-3.5" />}>Location & Description</SectionHeading>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  Location (City, Country) *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kigali, Rwanda"
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Asset Specifications & Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe key specs, condition, features, operator options, etc."
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Listing to Assetify</span>
                </>
              )}
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
              onClick={handleClose}
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
