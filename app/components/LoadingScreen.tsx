'use client';

import React from 'react';

export const LoadingScreen: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#0B1B41] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      {label && <p className="text-xs font-semibold text-slate-300">{label}</p>}
    </div>
  );
};
