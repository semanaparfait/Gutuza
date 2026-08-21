"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Building2,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  MessageCircle,
  Calendar,
  Search,
  AlertTriangle,
  Loader2,
  MapPin,
} from "lucide-react";
import { subscribeToAllAssets, updateAssetStatus } from "@/lib/assetServices";
import { subscribeToAllUsers } from "@/lib/userServices";
import { subscribeToAllBookings, type Booking } from "@/lib/bookingServices";
import {
  subscribeToAllConversations,
  subscribeToMessages,
  type Conversation,
  type ChatMessage,
} from "@/lib/chatServices";
import type { Asset } from "../data/assetTypes";
import type { UserProfile } from "@/context/AuthContext";

type Tab = "verification" | "assets" | "users" | "bookings" | "conversations";
type AssetFilter = "all" | "pending" | "approved" | "rejected";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "verification", label: "Verification", icon: ClipboardCheck },
  { id: "assets", label: "All Assets", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
];

function timeAgo(millis?: number): string {
  if (!millis) return "Unknown time";
  const diff = Date.now() - millis;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatJoined(value: unknown): string {
  const anyVal = value as { toDate?: () => Date } | undefined;
  if (anyVal && typeof anyVal.toDate === "function") {
    return anyVal.toDate().toLocaleDateString();
  }
  return "Unknown";
}

const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-800">
    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
    <span>{message}</span>
  </div>
);

// Common reasons an admin rejects a listing — "Illegal or prohibited item"
// is deliberately first since that's the most important case to get right.
// "Other" lets the admin write a specific, free-text explanation instead.
const REJECTION_REASONS = [
  "Illegal or prohibited item",
  "Misleading or inaccurate information",
  "Poor quality or unclear photos",
  "Duplicate listing",
  "Incorrect category, price, or pricing unit",
  "Other",
] as const;

const RejectAssetModal: React.FC<{
  asset: Asset;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}> = ({ asset, submitting, onCancel, onConfirm }) => {
  const [preset, setPreset] = React.useState<string>(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = React.useState("");

  const reason = preset === "Other" ? customReason.trim() : preset;
  const canSubmit = reason.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-base font-bold text-slate-900">Reject listing</h3>
          <p className="text-xs text-slate-500 mt-1.5">
            Tell the seller of <span className="font-bold text-slate-700">&ldquo;{asset.title}&rdquo;</span> what&apos;s
            wrong so they know why it was declined and, where possible, how to fix it.
          </p>
        </div>

        <div className="space-y-2">
          {REJECTION_REASONS.map((r) => (
            <label
              key={r}
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="radio"
                name="rejection-reason"
                checked={preset === r}
                onChange={() => setPreset(r)}
                className="accent-rose-600"
              />
              {r}
            </label>
          ))}
        </div>

        {preset === "Other" && (
          <textarea
            autoFocus
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            rows={3}
            placeholder="Describe what's wrong with this listing..."
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => canSubmit && onConfirm(reason)}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Reject &amp; Notify Seller
          </button>
        </div>
      </div>
    </div>
  );
};

const TONE_CLASSES: Record<string, { bg: string; icon: string }> = {
  amber: { bg: "bg-amber-50", icon: "text-amber-500" },
  brand: { bg: "bg-brand-50", icon: "text-brand-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-500" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-500" },
};

const MetricCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  tone: keyof typeof TONE_CLASSES;
}> = ({ label, value, icon: Icon, tone }) => {
  const t = TONE_CLASSES[tone];
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-semibold">{label}</span>
        <div className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${t.icon}`} />
        </div>
      </div>
      <div className="text-2xl font-black text-slate-900">{value.toLocaleString()}</div>
    </div>
  );
};

const VerificationQueue: React.FC<{
  assets: Asset[];
  error: string | null;
  moderatingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  sellerLabel: (sellerId: string | null | undefined, fallback: string) => string;
}> = ({ assets, error, moderatingId, onApprove, onReject, sellerLabel }) => {
  if (error) return <ErrorBanner message={error} />;

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">All caught up</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No listings are waiting for review right now. New submissions will appear here first, before they go live on the marketplace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-0">
            <div className="h-48 md:h-full bg-slate-100">
              <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase text-white bg-brand-600">
                      For {asset.type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{asset.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{asset.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {asset.location}, {asset.country}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-slate-900">RWF {asset.price.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">/ {asset.priceUnit}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                {asset.description || "No description provided."}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Listed by <span className="font-bold text-slate-800">{sellerLabel(asset.sellerId, asset.owner.name)}</span>
                  {" • "}Submitted {timeAgo(asset.createdAtMillis)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReject(asset.id)}
                    disabled={moderatingId === asset.id}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(asset.id)}
                    disabled={moderatingId === asset.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {moderatingId === asset.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ASSET_STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const AssetsTable: React.FC<{
  assets: Asset[];
  error: string | null;
  filter: AssetFilter;
  onFilterChange: (f: AssetFilter) => void;
  moderatingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  sellerLabel: (sellerId: string | null | undefined, fallback: string) => string;
}> = ({ assets, error, filter, onFilterChange, moderatingId, onApprove, onReject, sellerLabel }) => {
  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">All Assets ({assets.length})</h3>
        <div className="flex items-center gap-1.5">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500">No assets match this filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-bold">Asset</th>
                <th className="px-5 py-3 font-bold">Seller</th>
                <th className="px-5 py-3 font-bold">Price</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const status = asset.status || "approved";
                return (
                  <tr key={asset.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={asset.image}
                          alt={asset.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-[220px]">{asset.title}</div>
                          <div className="text-slate-400 text-[10px]">
                            {asset.category} • {asset.type}
                          </div>
                          {status === "rejected" && asset.rejectionReason && (
                            <div className="text-rose-600 text-[10px] font-semibold mt-0.5 truncate max-w-[220px]">
                              Reason: {asset.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-semibold">
                      {sellerLabel(asset.sellerId, asset.owner.name)}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-800">RWF {asset.price.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${ASSET_STATUS_BADGE[status]}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {status !== "approved" && (
                          <button
                            onClick={() => onApprove(asset.id)}
                            disabled={moderatingId === asset.id}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {status !== "rejected" && (
                          <button
                            onClick={() => onReject(asset.id)}
                            disabled={moderatingId === asset.id}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ROLE_BADGE: Record<string, string> = {
  buyer: "bg-slate-100 text-slate-600",
  seller: "bg-brand-100 text-brand-700",
  admin: "bg-purple-100 text-purple-700",
};

const UsersTable: React.FC<{ users: UserProfile[]; error: string | null }> = ({ users, error }) => {
  const [search, setSearch] = React.useState("");

  if (error) return <ErrorBanner message={error} />;

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">All Users ({users.length})</h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email..."
            className="pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-500">No users match your search.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <th className="px-5 py-3 font-bold">User</th>
                <th className="px-5 py-3 font-bold">Contact</th>
                <th className="px-5 py-3 font-bold">Role</th>
                <th className="px-5 py-3 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center overflow-hidden font-bold text-[11px] shrink-0">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.fullName} className="w-full h-full object-cover" />
                        ) : (
                          u.fullName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-bold text-slate-900">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <div>{u.email || "—"}</div>
                    {u.phoneNumber && <div className="text-slate-400 text-[10px]">{u.phoneNumber}</div>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${ROLE_BADGE[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{formatJoined(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const BOOKING_STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-200 text-slate-600",
};

const BookingsTable: React.FC<{
  bookings: Booking[];
  error: string | null;
  usersById: Map<string, UserProfile>;
}> = ({ bookings, error, usersById }) => {
  if (error) return <ErrorBanner message={error} />;

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-xs text-slate-500">
        No bookings have been made yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">All Bookings ({bookings.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
              <th className="px-5 py-3 font-bold">Asset</th>
              <th className="px-5 py-3 font-bold">Buyer</th>
              <th className="px-5 py-3 font-bold">Seller</th>
              <th className="px-5 py-3 font-bold">Dates</th>
              <th className="px-5 py-3 font-bold">Total</th>
              <th className="px-5 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const buyer = usersById.get(b.buyerId);
              const seller = b.sellerId ? usersById.get(b.sellerId) : undefined;
              return (
                <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.assetSnapshot.image}
                        alt={b.assetSnapshot.title}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{b.assetSnapshot.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-semibold">{buyer?.fullName || "Unknown Buyer"}</td>
                  <td className="px-5 py-3 text-slate-600 font-semibold">
                    {seller?.fullName || b.assetSnapshot.ownerName}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {b.startDate} → {b.endDate}
                  </td>
                  <td className="px-5 py-3 font-bold text-slate-800">RWF {b.totalPrice.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${BOOKING_STATUS_BADGE[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConversationsPanel: React.FC<{
  conversations: Conversation[];
  error: string | null;
  selected: Conversation | null;
  onSelect: (c: Conversation) => void;
}> = ({ conversations, error, selected, onSelect }) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [messagesError, setMessagesError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!selected) {
      setMessages([]);
      return;
    }
    setMessagesError(null);
    const unsubscribe = subscribeToMessages(selected.id, setMessages, (err) => setMessagesError(err.message));
    return () => unsubscribe();
  }, [selected]);

  if (error) return <ErrorBanner message={error} />;

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-xs text-slate-500">
        No conversations have started yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden max-h-[600px] overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full text-left p-4 border-b border-slate-100 last:border-0 transition-colors ${
              selected?.id === c.id ? "bg-brand-50" : "hover:bg-slate-50"
            }`}
          >
            <div className="text-xs font-bold text-slate-900 truncate">
              {c.buyerName} ↔ {c.sellerName}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{c.assetTitle}</div>
            <div className="text-[11px] text-slate-500 truncate mt-1">{c.lastMessage || "No messages yet"}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 flex flex-col max-h-[600px]">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 text-slate-400 p-10">
            <MessageCircle className="w-8 h-8" />
            <p className="text-xs font-semibold">Select a conversation to read the thread.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-900">
                {selected.buyerName} ↔ {selected.sellerName}
              </div>
              <div className="text-[11px] text-slate-400">Re: {selected.assetTitle}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messagesError ? (
                <ErrorBanner message={messagesError} />
              ) : messages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center pt-6">No messages in this thread yet.</p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.senderId === selected.buyerId ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                        m.senderId === selected.buyerId
                          ? "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                          : "bg-brand-600 text-white rounded-br-none"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{m.senderName}</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Read-only — admins can review conversations but don&apos;t send messages here.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const router = useRouter();

  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [assetsError, setAssetsError] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [usersError, setUsersError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [bookingsError, setBookingsError] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [conversationsError, setConversationsError] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState<Tab>("verification");
  const [assetsFilter, setAssetsFilter] = React.useState<AssetFilter>("all");
  const [moderatingId, setModeratingId] = React.useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  // The asset currently being rejected via the reason modal below — null
  // means the modal is closed. Reject is never a single click: an admin
  // must pick or write a reason first, so the seller always learns why.
  const [rejectingAsset, setRejectingAsset] = React.useState<Asset | null>(null);

  React.useEffect(() => {
    const permissionMsg = (err: Error, collectionName: string) =>
      err.message.toLowerCase().includes("permission")
        ? `Couldn't load ${collectionName} — the Firestore security rules may not grant admin accounts read access yet.`
        : `Couldn't load ${collectionName} (${err.message}).`;

    const unsubscribers = [
      subscribeToAllAssets(setAssets, (err) => setAssetsError(permissionMsg(err, "assets"))),
      subscribeToAllUsers(setUsers, (err) => setUsersError(permissionMsg(err, "users"))),
      subscribeToAllBookings(setBookings, (err) => setBookingsError(permissionMsg(err, "bookings"))),
      subscribeToAllConversations(setConversations, (err) =>
        setConversationsError(permissionMsg(err, "conversations"))
      ),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  const usersById = React.useMemo(() => {
    const map = new Map<string, UserProfile>();
    users.forEach((u) => map.set(u.uid, u));
    return map;
  }, [users]);

  const pendingAssets = React.useMemo(() => assets.filter((a) => a.status === "pending"), [assets]);
  const approvedCount = React.useMemo(() => assets.filter((a) => (a.status || "approved") === "approved").length, [
    assets,
  ]);

  const filteredAssets = React.useMemo(() => {
    if (assetsFilter === "all") return assets;
    return assets.filter((a) => (a.status || "approved") === assetsFilter);
  }, [assets, assetsFilter]);

  const handleModerate = async (assetId: string, status: "approved" | "rejected", rejectionReason?: string) => {
    setModeratingId(assetId);
    try {
      await updateAssetStatus(assetId, status, rejectionReason);
    } catch (err) {
      console.error("Failed to update asset status:", err);
    } finally {
      setModeratingId(null);
    }
  };

  // Reject is a two-step flow: clicking "Reject" (from either the
  // Verification queue or the All Assets table) opens the reason modal
  // instead of rejecting immediately; the actual status update only
  // happens once the admin picks/writes a reason and confirms.
  const handleRequestReject = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) setRejectingAsset(asset);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!rejectingAsset) return;
    await handleModerate(rejectingAsset.id, "rejected", reason);
    setRejectingAsset(null);
  };

  const sellerLabel = React.useCallback(
    (sellerId: string | null | undefined, fallback: string) => {
      if (!sellerId) return fallback;
      const u = usersById.get(sellerId);
      return u ? u.fullName : fallback;
    },
    [usersById]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Admin Header */}
      <div className="p-6 bg-brand-900 text-white rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display">Assetify Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xl">
            Review and verify new listings before they go live, and oversee every user, booking, and conversation on the platform.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/10 shrink-0 transition-colors"
        >
          <Building2 className="w-4 h-4 text-brand-400" />
          Back to Marketplace
        </button>
      </div>

      {/* Metrics Row — real counts, not simulated figures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Pending Review" value={pendingAssets.length} icon={Clock3} tone="amber" />
        <MetricCard label="Live Listings" value={approvedCount} icon={Building2} tone="brand" />
        <MetricCard label="Registered Users" value={users.length} icon={Users} tone="purple" />
        <MetricCard label="Total Bookings" value={bookings.length} icon={Calendar} tone="emerald" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge = tab.id === "verification" ? pendingAssets.length : undefined;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {!!badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? "bg-white/20" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "verification" && (
        <VerificationQueue
          assets={pendingAssets}
          error={assetsError}
          moderatingId={moderatingId}
          onApprove={(id) => handleModerate(id, "approved")}
          onReject={handleRequestReject}
          sellerLabel={sellerLabel}
        />
      )}

      {activeTab === "assets" && (
        <AssetsTable
          assets={filteredAssets}
          error={assetsError}
          filter={assetsFilter}
          onFilterChange={setAssetsFilter}
          moderatingId={moderatingId}
          onApprove={(id) => handleModerate(id, "approved")}
          onReject={handleRequestReject}
          sellerLabel={sellerLabel}
        />
      )}

      {activeTab === "users" && <UsersTable users={users} error={usersError} />}

      {activeTab === "bookings" && (
        <BookingsTable bookings={bookings} error={bookingsError} usersById={usersById} />
      )}

      {activeTab === "conversations" && (
        <ConversationsPanel
          conversations={conversations}
          error={conversationsError}
          selected={selectedConversation}
          onSelect={setSelectedConversation}
        />
      )}

      {rejectingAsset && (
        <RejectAssetModal
          asset={rejectingAsset}
          submitting={moderatingId === rejectingAsset.id}
          onCancel={() => setRejectingAsset(null)}
          onConfirm={handleConfirmReject}
        />
      )}
    </div>
  );
};
