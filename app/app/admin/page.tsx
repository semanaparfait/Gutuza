'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminDashboard } from "../../components/AdminDashboard";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (profile?.role !== "admin") {
        router.push("/");
      }
    }
  }, [loading, user, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1B41] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#07120f]">
      <AdminDashboard />
    </main>
  );
}
