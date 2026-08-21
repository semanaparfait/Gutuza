'use client';

import React from 'react';
import { X, Send, ShieldCheck, User, Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  getOrCreateConversation,
  subscribeToMessages,
  sendMessage,
  type ChatMessage,
} from '@/lib/chatServices';

export interface ChatContext {
  assetId: string;
  assetTitle: string;
  assetImage: string;
  sellerId: string;
  sellerName: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // What the conversation is about. `null` means no specific asset/seller
  // context is available yet (e.g. opened from the navbar's generic
  // message icon rather than from an asset's detail view).
  context: ChatContext | null;
  // When set, the signed-in user is viewing this specific buyer's thread —
  // the seller's use case, opened from their "Messages" list. When omitted,
  // the signed-in user IS the buyer — the common case of opening chat from
  // an asset's detail view.
  viewAsBuyer?: { id: string; name: string };
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  context,
  viewAsBuyer,
}) => {
  const { user, profile } = useAuth();

  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [loadError, setLoadError] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const isSellerView = !!viewAsBuyer;
  const buyerId = viewAsBuyer?.id ?? user?.uid ?? '';
  const buyerName = viewAsBuyer?.name ?? profile?.fullName ?? user?.displayName ?? 'Buyer';
  const otherPartyName = isSellerView ? buyerName : (context?.sellerName || 'Seller');
  const myName = isSellerView ? (profile?.fullName || context?.sellerName || 'Seller') : buyerName;

  // Set up (or reset) the conversation whenever the drawer opens with a new
  // asset/buyer context. Deliberately does nothing (no crash, no Firestore
  // call) when the context is incomplete — see the empty states below.
  React.useEffect(() => {
    if (!isOpen || !context || !context.sellerId || !buyerId || !user) {
      setConversationId(null);
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoadError('');

    getOrCreateConversation({
      assetId: context.assetId,
      assetTitle: context.assetTitle,
      assetImage: context.assetImage,
      buyerId,
      buyerName,
      sellerId: context.sellerId,
      sellerName: context.sellerName,
    })
      .then((id) => {
        if (cancelled) return;
        setConversationId(id);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to open conversation:', err);
        setLoadError('Could not open this conversation. Please try again.');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, context?.assetId, context?.sellerId, buyerId, user?.uid]);

  React.useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = subscribeToMessages(
      conversationId,
      setMessages,
      (err) => setLoadError(err.message.toLowerCase().includes('permission')
        ? 'Messages aren’t loading — the Firestore security rules for the "conversations" collection may not be applied yet.'
        : 'Messages aren’t loading right now.')
    );
    return () => unsubscribe();
  }, [conversationId]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || !user || sending) return;

    const text = inputText;
    setInputText('');
    setSending(true);
    try {
      await sendMessage(conversationId, user.uid, myName, text);
    } catch (err) {
      console.error('Failed to send message:', err);
      setLoadError('Your message didn’t send. Please try again.');
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const canChat = !!context && !!context.sellerId && !!user;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col">

      {/* Drawer Header */}
      <div className="p-4 bg-brand-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span>{canChat ? otherPartyName : 'Messages'}</span>
              {canChat && <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />}
            </div>
            {context?.assetTitle && (
              <span className="text-[10px] text-slate-400 line-clamp-1">{context.assetTitle}</span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {!user ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <MessageCircle className="w-8 h-8" />
            <p className="text-xs font-semibold max-w-[220px]">Sign in to chat with the seller.</p>
          </div>
        ) : !context ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <MessageCircle className="w-8 h-8" />
            <p className="text-xs font-semibold max-w-[220px]">Open an asset and tap &quot;Chat with Owner&quot; to start a conversation.</p>
          </div>
        ) : !context.sellerId ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <MessageCircle className="w-8 h-8" />
            <p className="text-xs font-semibold max-w-[220px]">Chat isn&apos;t available for this sample listing.</p>
          </div>
        ) : loadError ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-amber-600">
            <p className="text-xs font-semibold max-w-[240px]">{loadError}</p>
          </div>
        ) : !conversationId ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <MessageCircle className="w-8 h-8" />
            <p className="text-xs font-semibold max-w-[220px]">No messages yet — say hello!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-900 rounded-bl-none border border-slate-200 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.senderName}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={canChat ? `Message ${otherPartyName}...` : 'Chat unavailable'}
          disabled={!canChat || !conversationId}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canChat || !conversationId || sending || !inputText.trim()}
          className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

    </div>
  );
};
