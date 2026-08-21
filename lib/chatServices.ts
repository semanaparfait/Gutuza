// Firestore persistence for buyer<->seller chat. Previously `ChatDrawer.tsx`
// was a fully local mock (fake auto-reply on a setTimeout, nothing ever
// written anywhere) — this makes it real, durable data so both sides can
// actually see each other's messages, and so an admin can review a
// conversation if needed.
//
// Data model:
// - `conversations/{conversationId}` — one thread per (asset, buyer) pair.
//   The id is deterministic (`${assetId}__${buyerId}`) so opening the chat
//   for the same asset always resumes the same thread instead of creating
//   duplicates. Carries denormalized display fields (asset title/image,
//   buyer/seller names) so a list of conversations can render without a
//   join, the same pattern `bookingServices.ts` uses for its asset snapshot.
// - `conversations/{conversationId}/messages/{messageId}` — the thread's
//   messages, oldest first.
//
// Requires Firestore rules granting: the buyer and seller on a conversation
// read/write access to it and its messages, and an admin-role account read
// access to every conversation and message on the platform (for the Admin
// Console's "Conversations" tab). See project notes / Firestore rules.
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

const CONVERSATIONS_COLLECTION = 'conversations';

export interface Conversation {
  id: string;
  assetId: string;
  assetTitle: string;
  assetImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastMessageAt: number; // millis; 0 if no message sent yet
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number; // millis
}

function conversationDocId(assetId: string, buyerId: string): string {
  return `${assetId}__${buyerId}`;
}

/**
 * Creates the conversation doc if it doesn't exist yet, or refreshes its
 * denormalized display fields if it does (e.g. the buyer's or seller's
 * display name changed since the thread was first opened). Returns the
 * conversation id to pass to `subscribeToMessages`/`sendMessage`.
 */
export async function getOrCreateConversation(params: {
  assetId: string;
  assetTitle: string;
  assetImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
}): Promise<string> {
  const id = conversationDocId(params.assetId, params.buyerId);
  await setDoc(
    doc(db, CONVERSATIONS_COLLECTION, id),
    { ...params, updatedAt: serverTimestamp() },
    { merge: true }
  );
  return id;
}

function normalizeConversationDoc(id: string, data: DocumentData): Conversation {
  return {
    id,
    assetId: typeof data.assetId === 'string' ? data.assetId : '',
    assetTitle: typeof data.assetTitle === 'string' && data.assetTitle ? data.assetTitle : 'Asset',
    assetImage: typeof data.assetImage === 'string' ? data.assetImage : '',
    buyerId: typeof data.buyerId === 'string' ? data.buyerId : '',
    buyerName: typeof data.buyerName === 'string' && data.buyerName ? data.buyerName : 'Buyer',
    sellerId: typeof data.sellerId === 'string' ? data.sellerId : '',
    sellerName: typeof data.sellerName === 'string' && data.sellerName ? data.sellerName : 'Seller',
    lastMessage: typeof data.lastMessage === 'string' ? data.lastMessage : '',
    lastMessageAt: data.lastMessageAt?.toMillis ? data.lastMessageAt.toMillis() : 0,
  };
}

/**
 * Admin-only: every conversation on the platform, most recently active
 * first. Calls `callback` immediately with the current data and again on
 * every change. Call the returned function to unsubscribe.
 */
export function subscribeToAllConversations(
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, CONVERSATIONS_COLLECTION),
    (snapshot) => {
      const list = snapshot.docs.map((docSnap) => normalizeConversationDoc(docSnap.id, docSnap.data()));
      list.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      callback(list);
    },
    (error) => {
      console.error('subscribeToAllConversations failed:', error);
      onError?.(error);
    }
  );
}

/**
 * A seller's own conversations (about any of their assets), most recently
 * active first — powers the "Messages" section of the seller dashboard.
 * Filters with a single `where("sellerId","==",...)` clause and sorts
 * client-side, same composite-index-avoidance reasoning used throughout
 * `assetServices.ts`/`bookingServices.ts`.
 */
export function subscribeToSellerConversations(
  sellerId: string,
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const conversationsQuery = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where('sellerId', '==', sellerId)
  );
  return onSnapshot(
    conversationsQuery,
    (snapshot) => {
      const list = snapshot.docs.map((docSnap) => normalizeConversationDoc(docSnap.id, docSnap.data()));
      list.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      callback(list);
    },
    (error) => {
      console.error('subscribeToSellerConversations failed:', error);
      onError?.(error);
    }
  );
}

/**
 * Live messages for one conversation thread, oldest first. Call the
 * returned function to unsubscribe.
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const messagesQuery = query(
    collection(db, CONVERSATIONS_COLLECTION, conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(
    messagesQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      callback(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: typeof data.senderId === 'string' ? data.senderId : '',
            senderName: typeof data.senderName === 'string' && data.senderName ? data.senderName : 'User',
            text: typeof data.text === 'string' ? data.text : '',
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          };
        })
      );
    },
    (error) => {
      console.error('subscribeToMessages failed:', error);
      onError?.(error);
    }
  );
}

/**
 * Sends a message into a conversation and bumps the parent conversation's
 * preview fields (`lastMessage`/`lastMessageAt`) so conversation lists stay
 * current without re-reading every thread's messages.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, CONVERSATIONS_COLLECTION, conversationId, 'messages'), {
    senderId,
    senderName,
    text: trimmed,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
