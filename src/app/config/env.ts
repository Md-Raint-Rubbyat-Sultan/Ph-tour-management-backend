import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  JWT_AUTH_SECRET: string;
  JWT_AUTH_TIME: string;
  JWT_AUTH_REFRESH_SECRET: string;
  JWT_AUTH_REFRESH_TIME: string;
  BCRYPT_SALT: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
}

const envVarKeys: string[] = [
  "PORT",
  "DB_URI",
  "NODE_ENV",
  "JWT_AUTH_SECRET",
  "JWT_AUTH_TIME",
  "JWT_AUTH_REFRESH_SECRET",
  "JWT_AUTH_REFRESH_TIME",
  "BCRYPT_SALT",
  "SUPER_ADMIN_EMAIL",
  "SUPER_ADMIN_PASSWORD",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CALLBACK_URL",
  "EXPRESS_SESSION_SECRET",
  "FRONTEND_URL",
];

const loadEnvVariables = (): EnvVariables => {
  envVarKeys.forEach((key) => {
    if (!process.env[key])
      throw new Error(`${key} is not found from .env file.`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_AUTH_SECRET: process.env.JWT_AUTH_SECRET as string,
    JWT_AUTH_TIME: process.env.JWT_AUTH_TIME as string,
    JWT_AUTH_REFRESH_SECRET: process.env.JWT_AUTH_REFRESH_SECRET as string,
    JWT_AUTH_REFRESH_TIME: process.env.JWT_AUTH_REFRESH_TIME as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};

export const envVars = loadEnvVariables();
