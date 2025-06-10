importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBdNfshnokCHuzzPEo8FdAVCItXFMbKgyM",
    authDomain: "turfx-55f2e.firebaseapp.com",
    projectId: "turfx-55f2e",
    storageBucket: "turfx-55f2e.firebasestorage.app",
    messagingSenderId: "232999504741",
    appId: "1:232999504741:web:3cce3dfbdfd2ecc1a42f8c",
    measurementId: "G-CL15LWY82K"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("🌙 Received background message: ", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/turf_x.png", 
    });
});
