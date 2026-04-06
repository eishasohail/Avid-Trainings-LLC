import { collection, query, where, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  isRead: boolean;
  createdAt: string;
}

export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notificationsRef = collection(db, "notifications");
    const safeUserId = String(userId).trim();
    // Removed orderBy to avoid index requirement; sorting manually below
    const q = query(
      notificationsRef, 
      where("userId", "==", safeUserId)
    );
    const querySnapshot = await getDocs(q);
    
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];

    // Sort manually by date desc
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { isRead: true });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};
