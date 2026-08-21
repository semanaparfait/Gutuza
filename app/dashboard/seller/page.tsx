'use client';

import React, { useEffect, useState } from 'react';
import { Asset } from '../../data/assetTypes';
import { Navbar } from '../../components/Navbar';
import { SellerDashboard } from '../../components/SellerDashboard';
import { ListAssetModal } from '../../components/ListAssetModal';
import { AssetDetailModal } from '../../components/AssetDetailModal';
import { ChatDrawer } from '../../components/ChatDrawer';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useRoleGuard } from '@/lib/useRoleGuard';
import { subscribeToSellerAssets } from '@/lib/assetServices';

export default function SellerDashboardPage() {
  const { ready, user } = useRoleGuard('seller');

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Live subscription to just this seller's own listings, sourced from
  // Firestore so newly-published assets (via ListAssetModal) show up here
  // in real time without any local state juggling. If there's no user yet,
  // just skip subscribing — useRoleGuard already redirects unauthenticated
  // visitors away from this page, so there's nothing to reset here.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToSellerAssets(user.uid, setAssets);
    return () => unsubscribe();
  }, [user]);

  if (!ready) {
    return <LoadingScreen label="Loading your seller dashboard..." />;
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <Navbar onOpenListModal={() => setIsListModalOpen(true)} />

      <SellerDashboard
        assets={assets}
        onOpenListModal={() => setIsListModalOpen(true)}
        onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
      />

      {isListModalOpen && (
        <ListAssetModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
        />
      )}

      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
          onBook={() => {}}
          onChatWithOwner={() => setIsChatDrawerOpen(true)}
          isSaved={false}
          onToggleSave={() => {}}
        />
      )}

      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        targetOwner="John D."
      />
    </main>
  );
}
