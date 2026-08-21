// Firestore reads for the platform's registered users — currently just the
// one admin-facing subscription used by the Admin Console's "Users" tab.
//
// Requires a Firestore rule granting an admin-role account read access to
// every `users` document — by default (see the `users` rule in the
// project's Firestore rules) an account can only read its own profile doc.
// Without that rule this subscription's `onError` will fire with a
// permission-denied error rather than silently returning nothing.
import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '@/context/AuthContext';

const USERS_COLLECTION = 'users';

/**
 * Admin-only: every registered user on the platform, live. Calls `callback`
 * immediately with the current data and again on every change. Call the
 * returned function to unsubscribe.
 */
export function subscribeToAllUsers(
  callback: (users: UserProfile[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, USERS_COLLECTION),
    (snapshot) => {
      callback(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            fullName:
              typeof data.fullName === 'string' && data.fullName ? data.fullName : 'Unnamed User',
            email: typeof data.email === 'string' ? data.email : '',
            phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : '',
            role: data.role === 'seller' || data.role === 'admin' ? data.role : 'buyer',
            photoURL: typeof data.photoURL === 'string' ? data.photoURL : '',
            createdAt: data.createdAt,
          } as UserProfile;
        })
      );
    },
    (error) => {
      console.error('subscribeToAllUsers failed:', error);
      onError?.(error);
    }
  );
}
