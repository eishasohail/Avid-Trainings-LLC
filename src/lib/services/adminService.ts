import { collection, getDocs, doc, updateDoc, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { UserRole } from "@/lib/types/auth";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  status: "active" | "inactive";
}

export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const roleStr = typeof data.role === "string" ? data.role.trim().toLowerCase() : "";
      return {
        uid: doc.id,
        email: data.email || "",
        displayName: data.displayName || "Unknown User",
        role: (roleStr || "learner") as UserRole,
        createdAt: data.createdAt || new Date().toISOString(),
        status: "active", // Defaulting to active for now
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUserRole = async (uid: string, newRole: UserRole): Promise<boolean> => {
  try {
    // 1. Update user role
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date().toISOString()
    });

    // 2. Create notification for the user
    const notificationsRef = collection(db, "notifications");
    const targetUid = String(uid).trim(); 
    await addDoc(notificationsRef, {
      userId: targetUid,
      title: "Role Updated",
      message: `Your platform access has been updated to ${newRole.toUpperCase()}. Please refresh or re-login to see new modules.`,
      type: "info",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};
