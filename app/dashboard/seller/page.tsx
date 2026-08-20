'use client';

import React, { useState } from 'react';
import { MOCK_ASSETS, Asset } from '../../data/mockAssets';
import { Navbar } from '../../components/Navbar';
import { SellerDashboard } from '../../components/SellerDashboard';
import { ListAssetModal } from '../../components/ListAssetModal';
import { AssetDetailModal } from '../../components/AssetDetailModal';
import { ChatDrawer } from '../../components/ChatDrawer';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useRoleGuard } from '@/lib/useRoleGuard';

export default function SellerDashboardPage() {
  const { ready } = useRoleGuard('seller');

  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  if (!ready) {
    return <LoadingScreen label="Loading your seller dashboard..." />;
  }

  const handleAddAsset = (newAsset: Asset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

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
          onAddAsset={handleAddAsset}
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
