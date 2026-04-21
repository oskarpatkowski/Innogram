import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({ path: "../../.env" });

interface Config {
  port: number;
  redisPort: number;
  redisUname: string;
  redisPassword: string;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: SignOptions["expiresIn"];
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: SignOptions["expiresIn"];
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  allowedOrigin: string;
  redisHost: string;
}

const config: Config = {
  port: Number(process.env.AUTH_PORT) || 3000,
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  nodeEnv: process.env.NODE_ENV || "development",
  redisUname: process.env.REDIS_USERNAME || "",
  redisPassword: process.env.REDIS_PASSWORD || "",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn:
    (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "15M",
  jwtRefreshExpiresIn:
    (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) || "7D",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  allowedOrigin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  redisHost: process.env.REDIS_HOST || "localhost",
};

export default config;
