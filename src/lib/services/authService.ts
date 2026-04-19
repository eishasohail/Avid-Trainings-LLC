// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   setPersistence,
//   browserLocalPersistence,
//   browserSessionPersistence,
//   type UserCredential,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase/config";
// import type { AuthUser, AuthError, AuthResult, LoginCredentials, UserRole } from "@/lib/types/auth";

// const mapFirebaseError = (code: string): AuthError => {
//   const errors: Record<string, string> = {
//     "auth/user-not-found": "No account found with this email.",
//     "auth/wrong-password": "Incorrect password. Please try again.",
//     "auth/invalid-email": "Please enter a valid email address.",
//     "auth/too-many-requests": "Too many attempts. Please try again later.",
//     "auth/user-disabled": "This account has been disabled.",
//     "auth/network-request-failed": "Network error. Please check your connection.",
//   };
//   return {
//     code,
//     message: errors[code] ?? "Something went wrong. Please try again.",
//   };
// };

// const getUserRole = async (uid: string): Promise<UserRole> => {
//   try {
//     const userDoc = await getDoc(doc(db, "users", uid));
//     if (userDoc.exists()) {
//       return (userDoc.data().role as UserRole) ?? "learner";
//     }
//     return "learner";
//   } catch {
//     return "learner";
//   }
// };

// const buildAuthUser = async (credential: UserCredential): Promise<AuthUser> => {
//   const role = await getUserRole(credential.user.uid);
//   return {
//     uid: credential.user.uid,
//     email: credential.user.email ?? "",
//     displayName: credential.user.displayName,
//     photoURL: credential.user.photoURL,
//     role,
//   };
// };

// export const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthResult> => {
//   try {
//     await setPersistence(
//       auth,
//       credentials.remember ? browserLocalPersistence : browserSessionPersistence
//     );
//     const credential = await signInWithEmailAndPassword(
//       auth,
//       credentials.email,
//       credentials.password
//     );
//     const user = await buildAuthUser(credential);
//     return { success: true, user };
//   } catch (err: unknown) {
//     const code = (err as { code?: string }).code ?? "auth/unknown";
//     return { success: false, error: mapFirebaseError(code) };
//   }
// };

// export const loginWithGoogle = async (): Promise<AuthResult> => {
//   try {
//     const provider = new GoogleAuthProvider();
//     const credential = await signInWithPopup(auth, provider);
//     const user = await buildAuthUser(credential);
//     return { success: true, user };
//   } catch (err: unknown) {
//     const code = (err as { code?: string }).code ?? "auth/unknown";
//     return { success: false, error: mapFirebaseError(code) };
//   }
// };

// export const logout = async (): Promise<void> => {
//   await signOut(auth);
// };

// export const getRedirectPath = (role: UserRole): string => {
//   switch (role) {
//     case "admin":
//       return "/dashboard/admin";
//     case "creator":
//       return "/dashboard";
//     case "learner":
//     default:
//       return "/dashboard";
//   }
// };
// ─── Auth Service ─────────────────────────────────────────────
// ALL authentication logic lives here.
// Firebase is used now — when backend is ready, only this file changes.
// Components and pages never call Firebase directly.

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  type UserCredential,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type {
  AuthUser,
  AuthError,
  AuthResult,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from "@/lib/types/auth";

// ─── Helper: map Firebase error codes to readable messages ────
const mapFirebaseError = (code: string): AuthError => {
  const errors: Record<string, string> = {
    "auth/user-not-found":        "No account found with this email.",
    "auth/wrong-password":        "Incorrect password. Please try again.",
    "auth/invalid-email":         "Please enter a valid email address.",
    "auth/too-many-requests":     "Too many attempts. Please try again later.",
    "auth/user-disabled":         "This account has been disabled.",
    "auth/email-already-in-use":  "An account already exists with this email.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/network-request-failed":"Network error. Please check your connection.",
    "auth/invalid-credential":    "Invalid email or password. Please try again.",
  };
  return {
    code,
    message: errors[code] ?? "Something went wrong. Please try again.",
  };
};

// ─── Helper: fetch user role from Firestore ────────────────────
// Role is stored in Firestore now.
// To migrate to backend: replace this function body with an API call.
const getUserRole = async (uid: string): Promise<UserRole> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const dbRole = userDoc.data().role;
      const roleStr = typeof dbRole === "string" ? dbRole.trim().toLowerCase() : "";
      return (roleStr || "learner") as UserRole;
    }
    return "learner";
  } catch {
    return "learner";
  }
};

// ─── Helper: build AuthUser from Firebase User ─────────────────
const buildAuthUser = async (user: User): Promise<AuthUser> => {
  const role = await getUserRole(user.uid);
  return {
    uid:         user.uid,
    email:       user.email ?? "",
    displayName: user.displayName,
    photoURL:    user.photoURL,
    role,
  };
};

// ─── Register with Email & Password ───────────────────────────
export const registerWithEmail = async (
  credentials: RegisterCredentials
): Promise<AuthResult> => {
  try {
    // Create Firebase auth account
    const credential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Set display name
    const fullName = `${credentials.firstName} ${credentials.lastName}`;
    await updateProfile(credential.user, { displayName: fullName });

    // Save user to Firestore with learner role by default
    // When backend is ready → replace this with API call
    await setDoc(doc(db, "users", credential.user.uid), {
      firstName:   credentials.firstName,
      lastName:    credentials.lastName,
      displayName: fullName,
      email:       credentials.email,
      role:        "learner", // everyone starts as learner
      photoURL:    "",
      createdAt:   new Date().toISOString(),
      provider:    "email",
    });

    const user = await buildAuthUser(credential.user);
    return { success: true, user };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "auth/unknown";
    return { success: false, error: mapFirebaseError(code) };
  }
};

// ─── Login with Email & Password ──────────────────────────────
export const loginWithEmail = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  try {
    await setPersistence(
      auth,
      credentials.remember ? browserLocalPersistence : browserSessionPersistence
    );
    const credential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    const user = await buildAuthUser(credential.user);
    return { success: true, user };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "auth/unknown";
    return { success: false, error: mapFirebaseError(code) };
  }
};

// ─── Login with Google ─────────────────────────────────────────
export const loginWithGoogle = async (): Promise<AuthResult> => {
  try {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    const user = credential.user

    // Check if user already exists in Firestore
    const userDocRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userDocRef)

    const nameParts = user.displayName?.split(" ") || ["", ""]
    
    if (!userDoc.exists()) {
      // New Google user → save complete profile
      await setDoc(userDocRef, {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        displayName: user.displayName || "",
        email: user.email || "",
        role: "learner",
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        provider: "google",
      })
    } else {
      // User exists, but might be missing fields from older versions
      // We merge fields to ensure they appear correctly
      const existingData = userDoc.data()
      const updates: Record<string, any> = {}
      
      if (!existingData.createdAt) updates.createdAt = new Date().toISOString()
      if (!existingData.provider) updates.provider = "google"
      if (!existingData.firstName) updates.firstName = nameParts[0] || ""
      if (!existingData.email) updates.email = user.email || ""
      if (!existingData.role) updates.role = "learner"
      
      if (Object.keys(updates).length > 0) {
        await setDoc(userDocRef, updates, { merge: true })
      }
    }

    // Get role from Firestore
    const role = await getUserRole(user.uid)
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
      }
    }
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "auth/unknown"
    return { success: false, error: mapFirebaseError(code) }
  }
}

// ─── Logout ───────────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// ─── Role-based redirect ──────────────────────────────────────
export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "creator":
      return "/dashboard";
    case "learner":
    default:
      return "/dashboard";
  }
};

// ─── Get Current User ──────────────────────────────────────────
export const getCurrentUser = (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        const authUser = await buildAuthUser(user);
        resolve(authUser);
      } else {
        resolve(null);
      }
    });
  });
};