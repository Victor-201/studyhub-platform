import pg from "pg";
import { env } from "./env.js";

export const pool = new pg.Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 5432,
  max: Number(env.DB_POOL_SIZE) || 10,
  connectionTimeoutMillis: 20000,
});

pool.on("error", (err) => {
  console.error("[PostgreSQL] Pool error:", err);
});

export async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    await client.query("SELECT 1");
    console.log("[PostgreSQL] Connection successful!");
  } catch (err) {
    console.error("[PostgreSQL] Connection failed:", err);
  } finally {
    if (client) client.release();
  }
}

(async () => {
  await testConnection();
})();
