'use client';

import React, { useState } from 'react';
import { MOCK_ASSETS, Asset } from '../../data/mockAssets';
import { Navbar } from '../../components/Navbar';
import { SellerDashboard } from '../../components/SellerDashboard';
import { ListAssetModal } from '../../components/ListAssetModal';
import { AssetDetailModal } from '../../components/AssetDetailModal';
import { ChatDrawer } from '../../components/ChatDrawer';
import {PlusCircle} from 'lucide-react'
import Link from "next/link";


import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function OwnerPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [activeView, setActiveView] = useState<'marketplace' | 'seller' | 'admin' | 'swaps'>('seller');
    const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B1B41] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const handleAddAsset = (newAsset: Asset) => {
        setAssets(prev => [newAsset, ...prev]);
    };

    return (
        <main className="min-h-screen bg-[#f3f4f6]">
            <header className="sticky flex items-center justify-between px-6 py-4 top-0 z-40 w-full bg-[#0B1B41] text-white border-b border-slate-800 shadow-md">
                <div>
                    <Link
                        href='/' 
                        className="flex items-center gap-2 group text-left shrink-0"
                    >
                        <img
                            src="/Logoo.svg"
                            alt="Assetify Logo"
                            className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>
                <div className='flex gap-4 items-center'>
                    <button
                        // onClick={onOpenListModal}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] shrink-0"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">List an Asset</span>
                        <span className="sm:hidden">List</span>
                    </button>
                    <div className='flex items-center gap-4'>
                        <div>
                            <img src="https://i.pinimg.com/736x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg" alt="" className='w-10 h-10 rounded-full'/>
                        </div>
                        <div>
                            <h2>Semana shema </h2>
                            <h4 className='text-emerald-600'>Dubai market</h4>
                        </div>
                    </div>
                </div>
            </header>


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
                    onBook={() => { }}
                    onChatWithOwner={() => setIsChatDrawerOpen(true)}
                    isSaved={false}
                    onToggleSave={() => { }}
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