'use client';

import React, { useState } from 'react';
import { MOCK_ASSETS, Asset } from '../data/mockAssets';
import { Navbar } from '../components/Navbar';
import { SellerDashboard } from '../components/SellerDashboard';
import { ListAssetModal } from '../components/ListAssetModal';
import { AssetDetailModal } from '../components/AssetDetailModal';
import { ChatDrawer } from '../components/ChatDrawer';

export default function OwnerPage() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [activeView, setActiveView] = useState<'marketplace' | 'seller' | 'admin' | 'swaps'>('seller');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddAsset = (newAsset: Asset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6]">


      <SellerDashboard
        assets={assets}
        onOpenListModal={() => setIsListModalOpen(true)}
        onSelectAsset={(asset) => setSelectedAssetForDetail(asset)}
      />

      {/* List Asset Modal */}
      {isListModalOpen && (
        <ListAssetModal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          onAddAsset={handleAddAsset}
        />
      )}

      {/* Asset Detail Modal */}
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

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        targetOwner="John D."
      />
    </main>
  );
}
