"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVarKeys = [
    "PORT",
    "DB_URI",
    "NODE_ENV",
    // JWT
    "JWT_AUTH_SECRET",
    "JWT_AUTH_TIME",
    "JWT_AUTH_REFRESH_SECRET",
    "JWT_AUTH_REFRESH_TIME",
    // BCRYPT
    "BCRYPT_SALT",
    // SUPER ADMIN
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    // passport google
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    // ssl
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    "SSL_IPN_URL",
    // cloudinary
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_URL",
    // SMTP
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_FROM",
    "SMTP_PASS",
    // Redis
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "REDIS_HOST",
    "REDIS_PORT",
];
const loadEnvVariables = () => {
    envVarKeys.forEach((key) => {
        if (!process.env[key])
            throw new Error(`${key} is not found from .env file.`);
    });
    return {
        PORT: process.env.PORT,
        DB_URI: process.env.DB_URI,
        NODE_ENV: process.env.NODE_ENV,
        // JWT
        JWT_AUTH_SECRET: process.env.JWT_AUTH_SECRET,
        JWT_AUTH_TIME: process.env.JWT_AUTH_TIME,
        JWT_AUTH_REFRESH_SECRET: process.env.JWT_AUTH_REFRESH_SECRET,
        JWT_AUTH_REFRESH_TIME: process.env.JWT_AUTH_REFRESH_TIME,
        // BCRYPT
        BCRYPT_SALT: process.env.BCRYPT_SALT,
        // SUPER ADMIN
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        // passport google
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        // ssl
        SSL: {
            STORE_ID: process.env.SSL_STORE_ID,
            STORE_PASS: process.env.SSL_STORE_PASS,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
            SSL_IPN_URL: process.env.SSL_IPN_URL,
        },
        // CLOUDINARY
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
            CLOUDINARY_URL: process.env.CLOUDINARY_URL,
        },
        // SMTP
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_FROM: process.env.SMTP_FROM,
            SMTP_PASS: process.env.SMTP_PASS,
        },
        // Redis
        REDIS: {
            REDIS_USERNAME: process.env.REDIS_USERNAME,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD,
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
        },
    };
};
exports.envVars = loadEnvVariables();
