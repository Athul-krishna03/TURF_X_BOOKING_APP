import dotenv from "dotenv";
import * as admin from "firebase-admin";
import path from 'path';
dotenv.config({path:path.resolve(__dirname,"../../.env")})

const serviceAccountPath = path.resolve(__dirname, "../../", process.env.FIREBASE_SERVICE_ACCOUNT || "");


let serviceAccount: admin.ServiceAccount;

try {
    serviceAccount = require(serviceAccountPath);
} catch (error) {
    console.error("Failed to load Firebase service account:", error);
    throw new Error("Firebase Admin SDK initialization failed due to missing or invalid service account file");
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const messaging = admin.messaging();
export const config = {
    cors:{
        ALLOWED_ORGIN:
        process.env.CORS_ALLOWED_ORIGIN || "http://localhost:5173"
    },
    server:{
        PORT:process.env.PORT || 5000,
        NODE_ENV:process.env.NODE_ENV || "development"
    },
    database:{
        URI:process.env.MONGODB_URI!
    },
    jwt:{
        ACCESS_SECRET_KEY: process.env.JWT_ACCESS_KEY || "access-secret-key",
		REFRESH_SECRET_KEY: process.env.JWT_REFRESH_KEY || "refresh-secret-key",
		ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        RESET_SECRET_KEY:process.env.JWT_RESET_KEY || "reset-secret-key",
        RESET_EXPIRES_IN:process.env.JWT_RESET_EXPIRES_IN || "5m"
    },
    nodemailer:{
        EMAIL_USER:process.env.NODEMAILER_EMAIL,
        EMAIL_PASS:process.env.NODEMAILER_PASS
    },
    redis:{
        redisURL:process.env.REDIS_URL
    },
    loggerStatus: process.env.LOGGER_STATUS || "dev",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
    stripe:process.env.STRIPE_SECRET_KEY || "",
    adminId:process.env.ADMIN_ID || "67f69473bf1b356718c5fc95"
}