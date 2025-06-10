import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./fireBase";
import { toast } from "sonner";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_NOTIFICATION_KEY;

export const requestNotificationPresmission = async (): Promise<string | null> => {
    try {
        const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        });

        if (token) {
        console.log("FCM Token:", token);
        return token;
        } else {
        console.warn(
            "No registration token available. Request permission to generate one."
        );
        return null;
        }
    } catch (error) {
        console.error("Error getting FCM token",error);
        return null
    }
};

export const listenForForegroundMessages = () => {
        onMessage(messaging, (payload) => {
        console.log("📩 Foreground FCM message received:", payload);
        const title = payload.notification?.title || "New Notification";
        const body = payload.notification?.body || "You have a new message";
    
        toast(title, {
            description: body,
            duration: 5000, 
        });
        });
};