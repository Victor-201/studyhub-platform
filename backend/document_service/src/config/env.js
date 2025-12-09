import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  // Node / Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3003),
  BASE_URL: process.env.BASE_URL || "http://localhost:3003",

  // MySQL
  DB_HOST: required("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: required("DB_USER"),
  DB_PASS: process.env.DB_PASS || "",
  DB_NAME: required("DB_NAME"),
  DB_POOL_SIZE: Number(process.env.DB_POOL_SIZE || 10),

  // JWT
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  REFRESH_EXPIRES_DAYS: Number(process.env.REFRESH_EXPIRES_DAYS || 30),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: required("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: required("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: required("CLOUDINARY_API_SECRET"),

  // ===== RabbitMQ =====
  RABBITMQ_URL: required("RABBITMQ_URL"), 
  RABBITMQ_EXCHANGE: process.env.RABBITMQ_EXCHANGE || "studyhub_exchange",

  // Other Services
  GroupService: required("GroupService"),
};

export default env;
