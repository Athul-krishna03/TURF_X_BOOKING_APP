import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBdNfshnokCHuzzPEo8FdAVCItXFMbKgyM",
    authDomain: "turfx-55f2e.firebaseapp.com",
    projectId: "turfx-55f2e",
    storageBucket: "turfx-55f2e.firebasestorage.app",
    messagingSenderId: "232999504741",
    appId: "1:232999504741:web:3cce3dfbdfd2ecc1a42f8c",
    measurementId: "G-CL15LWY82K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
