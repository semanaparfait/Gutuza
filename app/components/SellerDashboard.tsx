'use client';

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Eye,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Asset } from '../data/mockAssets';

interface SellerDashboardProps {
  assets: Asset[];
  onOpenListModal: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  assets,
  onOpenListModal,
  onSelectAsset
}) => {
  const [requests, setRequests] = React.useState([
    {
      id: 'REQ-901',
      assetTitle: 'Caterpillar 320 Hydraulic Excavator',
      customer: 'Kigali Infrastructure Development Group',
      duration: '4 Days (Aug 5 - Aug 9)',
      amount: '$1,400',
      status: 'Pending Approval'
    },
    {
      id: 'REQ-902',
      assetTitle: 'John Deere 6120M Agricultural Tractor',
      customer: 'Musanze Farm Collective',
      duration: '3 Days (Aug 10 - Aug 13)',
      amount: '$540',
      status: 'Approved'
    }
  ]);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Declined' } : r));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#111a18] via-[#111a18] to-emerald-950 rounded-3xl border border-slate-800 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black">Asset Owner Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Verified Host
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your machinery, properties, and vehicle fleet across Africa.
          </p>
        </div>

        <button
          onClick={onOpenListModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">$18,450</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+24.5% vs last month</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Active Asset Listings</span>
            <Package className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{assets.length}</div>
          <span className="text-[10px] text-slate-400">100% verified status</span>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pending Bookings</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {requests.filter(r => r.status === 'Pending Approval').length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Requires action</span>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Asset Uptime Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">99.2%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Top Tier Host</span>
        </div>

      </div>

      {/* Booking Requests Queue */}
      <div className="bg-white dark:bg-[#192724] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Incoming Booking & Service Requests
        </h3>

        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{req.assetTitle}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${req.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : req.status === 'Declined'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Customer: {req.customer} • {req.duration}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{req.amount}</span>

                {req.status === 'Pending Approval' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listed Assets Portfolio Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Your Listed Assets Portfolio
          </h3>
          <span className="text-xs text-slate-500">{assets.length} Assets Registered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((ast) => (
            <div key={ast.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={ast.image} alt={ast.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{ast.title}</h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">${ast.price} / {ast.priceUnit}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectAsset(ast)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
