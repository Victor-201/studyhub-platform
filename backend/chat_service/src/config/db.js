import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo() {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("[MongoDB] Connected successfully to:", env.MONGO_URI);
    } catch (err) {
        console.error("[MongoDB] Connection failed:", err.message);
        process.exit(1);
    }
}

mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected");
});

export default mongoose;
