'use client';

import React from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  FileText,
  Activity
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [verifications, setVerifications] = React.useState([
    {
      id: 'KYC-881',
      ownerName: 'Kigali Heavy Equipment Ltd',
      assetType: 'CAT 320 Excavator',
      document: 'National Registration & Commercial Permit',
      submittedDate: '2 hours ago',
      status: 'Pending Review'
    },
    {
      id: 'KYC-882',
      ownerName: 'AgriTech Cooperative Rwanda',
      assetType: 'John Deere Tractor Fleet',
      document: 'Cooperative License & Insurance Policy',
      submittedDate: '5 hours ago',
      status: 'Pending Review'
    }
  ]);

  const handleVerify = (id: string) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'Verified' } : v));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Admin Header */}
      <div className="p-6 bg-[#111a18] text-white rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-black">Gutuza Governance & Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Platform oversight, host verification, escrow protection, and asset compliance.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold rounded-full border border-emerald-500/30">
          Super Admin Mode
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Monthly Marketplace GMV</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">$142,800</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+18.2% MoM</span>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Platform Commission Revenue</span>
            <Activity className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">$7,140</div>
          <span className="text-[10px] text-slate-400">5.0% Standard Take-rate</span>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Registered Hosts</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">1,248</div>
          <span className="text-[10px] text-purple-600 font-medium">96% Identity Verified</span>
        </div>

        <div className="p-5 bg-white dark:bg-[#192724] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Escrow Funds On Hold</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">$34,900</div>
          <span className="text-[10px] text-amber-600 font-medium">Protected in Bank Escrow</span>
        </div>

      </div>

      {/* Verification Queue Table */}
      <div className="bg-white dark:bg-[#192724] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Host Verification & Asset Compliance Queue
          </h3>
          <span className="text-xs text-amber-600 font-semibold">{verifications.filter(v => v.status === 'Pending Review').length} Pending Requests</span>
        </div>

        <div className="space-y-3">
          {verifications.map((v) => (
            <div
              key={v.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{v.ownerName}</span>
                  <span className="text-[11px] text-slate-500">({v.assetType})</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${v.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {v.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{v.document} • Submitted {v.submittedDate}</span>
                </div>
              </div>

              {v.status === 'Pending Review' && (
                <button
                  onClick={() => handleVerify(v.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Verification
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
