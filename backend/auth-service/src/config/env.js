import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",

  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: required("DB_USER"),
  DB_PASS: process.env.DB_PASS || "",
  DB_NAME: required("DB_NAME"),
  DB_POOL_SIZE: Number(process.env.DB_POOL_SIZE || 10),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  REFRESH_EXPIRES_DAYS: Number(process.env.REFRESH_EXPIRES_DAYS || 30),

  CLIENT_ID: required("CLIENT_ID"),
  CLIENT_SECRET: required("CLIENT_SECRET"),
  REFRESH_TOKEN: required("REFRESH_TOKEN"),
  REDIRECT_URI: process.env.REDIRECT_URI || "http://localhost:3000/oauth2callback",
  GMAIL_USER: required("GMAIL_USER"),
};

export default env;
