import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { UserProfile } from "@/context/AuthContext";

// 1. Sign up with Email/Password + Custom Profile
export async function registerWithEmail(data: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "buyer" | "seller";
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

// 2b. Sign in with either an email address or a registered phone number.
// If the identifier isn't an email, we look up which account it belongs
// to in Firestore first, then sign in with that account's email.
export async function loginWithIdentifier(identifier: string, pass: string) {
  const trimmed = identifier.trim();
  const looksLikePhone = /^[+0-9\s\-()]+$/.test(trimmed) && !trimmed.includes("@");

  let email = trimmed.toLowerCase();

  if (looksLikePhone) {
    const cleanPhone = trimmed.replace(/[\s\-()]/g, "");
    const usersRef = collection(db, "users");
    const phoneQuery = query(usersRef, where("phoneNumber", "==", cleanPhone));
    const snapshot = await getDocs(phoneQuery);

    if (snapshot.empty) {
      throw new Error("No account found with this phone number.");
    }

    email = (snapshot.docs[0].data().email || "").toLowerCase();
    if (!email) {
      throw new Error("This account has no email on file. Please sign in with your phone provider instead.");
    }
  }

  return await signInWithEmailAndPassword(auth, email, pass);
}

// 3. Continue with Google
export async function signInWithGoogle(role: "buyer" | "seller" = "buyer") {
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
      role,
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfile);
  }

  return user;
}