import dotenv from "dotenv";
dotenv.config();

export const env = {
    PORT: process.env.PORT || 3006,
    NODE_ENV: process.env.NODE_ENV || "development",
    API_PREFIX: process.env.API_PREFIX || "/api/v1/chat",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/studyhub_chat",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret",
    LOG_FORMAT: process.env.LOG_FORMAT || "dev",
};

export default env;
