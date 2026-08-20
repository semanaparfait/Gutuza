import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { UserProfile } from "@/context/AuthContext";

// 1. Sign up with Email/Password + Custom Profile
export async function registerWithEmail(data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "trader" | "business";
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );
  const user = userCredential.user;

  // Set Auth displayName
  await updateProfile(user, { displayName: data.fullName });

  // Store profile in Firestore
  const newProfile: UserProfile = {
    uid: user.uid,
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    role: data.role,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", user.uid), newProfile);
  return user;
}

// 2. Sign in with Email/Password
export async function loginWithEmail(email: string, pass: string) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

// 3. Continue with Google
export async function signInWithGoogle(role: "trader" | "business" = "trader") {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userDocRef = doc(db, "users", user.uid);
  const existingDoc = await getDoc(userDocRef);

  if (!existingDoc.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      fullName: user.displayName || "Assetify Member",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: role,
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfile);
  }

  return user;
}