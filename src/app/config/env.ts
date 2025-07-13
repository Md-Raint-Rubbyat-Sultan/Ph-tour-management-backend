import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
  JWT_AUTH_SECRET: string;
  JWT_AUTH_TIME: string;
  BCRYPT_SALT: string;
}

const envVarKeys: string[] = [
  "PORT",
  "DB_URI",
  "NODE_ENV",
  "JWT_AUTH_SECRET",
  "JWT_AUTH_TIME",
  "BCRYPT_SALT",
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
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
  };
};

export const envVars = loadEnvVariables();
