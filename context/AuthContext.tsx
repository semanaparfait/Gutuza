"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: "buyer" | "seller" | "admin";
  photoURL?: string;
  createdAt?: unknown;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

// Some accounts were created before role naming was standardized to
// "buyer" | "seller" | "admin" (older signup flows stored "trader",
// "renter", "business", or "owner"). Normalize whatever is in Firestore
// so every legacy account still routes to a real dashboard.
const normalizeRole = (raw: unknown): UserProfile["role"] => {
  switch (raw) {
    case "seller":
    case "business":
    case "owner":
      return "seller";
    case "admin":
      return "admin";
    default:
      // "buyer", "trader", "renter", missing, or anything unrecognized.
      return "buyer";
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or hydrate Firestore profile
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          const role = normalizeRole(data.role);

          if (role !== data.role) {
            // Migrate the legacy value so future reads don't need this.
            await setDoc(userDocRef, { role }, { merge: true });
          }

          setProfile({ ...data, role });
        } else {
          // Fallback if signed in with Google for the first time
          const fallbackProfile: UserProfile = {
            uid: currentUser.uid,
            fullName: currentUser.displayName || "Assetify Member",
            email: currentUser.email || "",
            phoneNumber: currentUser.phoneNumber || "",
            role: "buyer",
            photoURL: currentUser.photoURL || "",
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, fallbackProfile, { merge: true });
          setProfile(fallbackProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);