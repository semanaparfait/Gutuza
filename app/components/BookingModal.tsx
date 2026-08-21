'use client';

import React from 'react';
import {
  X,
  Calendar,
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Truck,
  UserCheck
} from 'lucide-react';
import { Asset } from '../data/assetTypes';
import { useAuth } from '@/context/AuthContext';
import { createBooking } from '@/lib/bookingServices';

interface BookingModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ asset, onClose }) => {
  const { user } = useAuth();

  const [startDate, setStartDate] = React.useState('2026-08-05');
  const [endDate, setEndDate] = React.useState('2026-08-08');
  const [includeOperator, setIncludeOperator] = React.useState(true);
  const [includeInsurance, setIncludeInsurance] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState<'momo' | 'card' | 'bank'>('momo');
  const [bookingConfirmed, setBookingConfirmed] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  if (!asset) return null;

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1000 * 60 * 60 * 24, end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const basePrice = asset.price * days;
  const operatorFee = includeOperator ? 40 * days : 0;
  const insuranceFee = includeInsurance ? 25 * days : 0;
  const serviceFee = Math.round(basePrice * 0.05); // 5% Assetify platform fee
  const totalPrice = basePrice + operatorFee + insuranceFee + serviceFee;

  // Writes a real booking document to Firestore instead of just faking a
  // confirmation screen — this used to set bookingConfirmed=true with no
  // Firestore write at all, showing a made-up "#ASSETIFY-XXXXXX" reference
  // and claiming funds were "securely held in escrow" and that SMS/WhatsApp
  // confirmations were on their way, none of which was actually happening.
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setSubmitError('Please sign in to complete a booking.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newId = await createBooking({
        asset,
        buyerId: user.uid,
        startDate,
        endDate,
        days,
        includeOperator,
        includeInsurance,
        paymentMethod,
        basePrice,
        operatorFee,
        insuranceFee,
        serviceFee,
        totalPrice,
      });
      setBookingId(newId);
      setBookingConfirmed(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not create this booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {bookingConfirmed ? 'Booking Confirmed' : `Book ${asset.title}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!bookingConfirmed ? (
          <form onSubmit={handleConfirm} className="p-6 space-y-6">

            {/* Asset Summary Pill */}
            <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={asset.image}
                alt={asset.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {asset.title}
                </h4>
                <p className="text-[11px] text-slate-500">{asset.location} • ${asset.price} / {asset.priceUnit}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Owner: {asset.owner.name}</p>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Add-on Services Checkboxes */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Optional Add-on Protection & Services
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Certified Operator</div>
                    <div className="text-[10px] text-slate-400">Includes licensed heavy machine operator</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeOperator}
                  onChange={(e) => setIncludeOperator(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Assetify Damage Insurance</div>
                    <div className="text-[10px] text-slate-400">Covers equipment damage & third-party liability</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Payment Option (Escrow Protected)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${paymentMethod === 'momo'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile Money
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${paymentMethod === 'bank'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Bank Escrow
                </button>
              </div>
            </div>

            {/* Total Price Calculation Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Rate (${asset.price} x {days} days)</span>
                <span>${basePrice}</span>
              </div>
              {includeOperator && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Operator Service ($40 x {days} days)</span>
                  <span>${operatorFee}</span>
                </div>
              )}
              {includeInsurance && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Asset Insurance ($25 x {days} days)</span>
                  <span>${insuranceFee}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Escrow Fee (5%)</span>
                <span>${serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                <span>Total Amount Due</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">${totalPrice}</span>
              </div>
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
                {submitError}
              </div>
            )}

            {/* Confirm Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Sending Request…' : `Confirm & Pay $${totalPrice}`}</span>
            </button>

          </form>
        ) : (
          /* Confirmation View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Booking Request Sent Successfully!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Booking ref <strong>#{bookingId}</strong>. It&apos;s recorded as pending — the owner, {asset.owner.name}, can confirm it from their seller dashboard.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 inline mr-1" />
              You can track this booking&apos;s status from your dashboard at any time.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
            >
              Back to Marketplace
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
