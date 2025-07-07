import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  PORT: string;
  DB_URI: string;
  NODE_ENV: "development" | "production";
}

const envVarKeys: string[] = ["PORT", "DB_URI", "NODE_ENV"];

const loadEnvVariables = (): EnvVariables => {
  envVarKeys.forEach((key) => {
    if (!process.env[key])
      throw new Error(`${key} is not found from .env file.`);
  });

  return {
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVariables();
