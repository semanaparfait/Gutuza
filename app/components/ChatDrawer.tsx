'use client';

import React from 'react';
import { X, Send, ShieldCheck, User } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetOwner: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  targetOwner
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: targetOwner || 'Jean-Paul Habimana',
      text: `Hello! Thanks for reaching out regarding the asset listing. How can I assist you with availability or delivery specs?`,
      time: '10:14 AM',
      isMe: false
    }
  ]);
  const [inputText, setInputText] = React.useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'You',
      text: inputText,
      time: '10:16 AM',
      isMe: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate owner auto reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: targetOwner || 'Jean-Paul Habimana',
          text: `Got it! I can deliver the equipment directly to your site with a certified operator. Feel free to place the booking request on Assetify to lock in the dates.`,
          time: '10:17 AM',
          isMe: false
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-[#192724] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">

      {/* Drawer Header */}
      <div className="p-4 bg-[#111a18] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span>{targetOwner || 'Jean-Paul Habimana'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-emerald-400">Online • Verified Host</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-[#111a18]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.isMe
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-[#192724] text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#192724] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to owner..."
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
