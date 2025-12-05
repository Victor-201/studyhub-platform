import mysql from "mysql2/promise";
import { env } from "./env.js";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: Number(env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: Number(env.DB_POOL_SIZE) || 10,
  connectTimeout: 20000,
  timezone: "Z", 
});


export async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("[MySQL] Connection successful!");
  } catch (err) {
    console.error("[MySQL] Connection failed:", err);
  } finally {
    if (conn) conn.release();
  }
}

(async () => {
  await testConnection();
})();
