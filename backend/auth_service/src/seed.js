import { pool } from "./config/db.js";
import bcrypt from "bcrypt";

const PASSWORD = "Abc@12345";

const ROLES = [
  { id: "3f3e7a10-0b48-4de2-8bef-0f5942d59ef2", name: "admin", description: "System administrator" },
  { id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef", name: "user", description: "Regular authenticated user" },
];

const PERMISSIONS = [
  { id: "d7baf140-93a7-4c76-a236-082bfa69f613", name: "manage_users", description: "Admin can manage users" },
  { id: "b2e96d42-7bb4-4d5d-b1b3-074d9f3e70c3", name: "basic_access", description: "Normal user access" },
];

const USERS = [
  { id: "11111111-1111-4111-8111-111111111111", user_name: "admin", status: "active" },
  { id: "11111111-2222-4222-8222-111111111112", user_name: "user1", status: "active" },
  { id: "11111111-2222-4222-8222-111111111113", user_name: "user2", status: "active" },
  { id: "11111111-2222-4222-8222-111111111114", user_name: "user3", status: "active" },
  { id: "11111111-2222-4222-8222-111111111115", user_name: "user4", status: "active" },
  { id: "11111111-2222-4222-8222-111111111116", user_name: "user5", status: "active" },
  { id: "11111111-2222-4222-8222-111111111117", user_name: "user6", status: "active" },
  { id: "11111111-2222-4222-8222-111111111118", user_name: "user7", status: "active" },
  { id: "11111111-2222-4222-8222-111111111119", user_name: "user8", status: "active" },
  { id: "11111111-2222-4222-8222-111111111120", user_name: "user9", status: "active" },
  { id: "11111111-2222-4222-8222-111111111121", user_name: "user10", status: "active" },
];

const USER_ROLES = [
  { id: "aaaa1111-2222-4333-8444-555566667777", user_id: "11111111-1111-4111-8111-111111111111", role_id: "3f3e7a10-0b48-4de2-8bef-0f5942d59ef2" },
  { id: "aaaa1111-3333-4444-8555-111111111112", user_id: "11111111-2222-4222-8222-111111111112", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111113", user_id: "11111111-2222-4222-8222-111111111113", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111114", user_id: "11111111-2222-4222-8222-111111111114", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111115", user_id: "11111111-2222-4222-8222-111111111115", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111116", user_id: "11111111-2222-4222-8222-111111111116", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111117", user_id: "11111111-2222-4222-8222-111111111117", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111118", user_id: "11111111-2222-4222-8222-111111111118", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111119", user_id: "11111111-2222-4222-8222-111111111119", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111120", user_id: "11111111-2222-4222-8222-111111111120", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
  { id: "aaaa1111-3333-4444-8555-111111111121", user_id: "11111111-2222-4222-8222-111111111121", role_id: "a3aa4ea2-fabb-4b11-b009-9c087a4141ef" },
];

const USER_EMAILS = [
  { id: "bbbb1111-2222-4333-8444-555566667777", user_id: "11111111-1111-4111-8111-111111111111", email: "admin@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111112", user_id: "11111111-2222-4222-8222-111111111112", email: "user1@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111113", user_id: "11111111-2222-4222-8222-111111111113", email: "user2@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111114", user_id: "11111111-2222-4222-8222-111111111114", email: "user3@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111115", user_id: "11111111-2222-4222-8222-111111111115", email: "user4@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111116", user_id: "11111111-2222-4222-8222-111111111116", email: "user5@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111117", user_id: "11111111-2222-4222-8222-111111111117", email: "user6@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111118", user_id: "11111111-2222-4222-8222-111111111118", email: "user7@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111119", user_id: "11111111-2222-4222-8222-111111111119", email: "user8@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111120", user_id: "11111111-2222-4222-8222-111111111120", email: "user9@example.com", type: "primary", is_verified: true },
  { id: "bbbb1111-3333-4444-8666-111111111121", user_id: "11111111-2222-4222-8222-111111111121", email: "user10@example.com", type: "primary", is_verified: true },
];

const EMAIL_VERIFICATIONS = [
  { id: "cccc1111-2222-4333-8444-555566667777", user_email_id: "bbbb1111-2222-4333-8444-555566667777", token_hash: "a".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111112", user_email_id: "bbbb1111-3333-4444-8666-111111111112", token_hash: "b".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111113", user_email_id: "bbbb1111-3333-4444-8666-111111111113", token_hash: "c".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111114", user_email_id: "bbbb1111-3333-4444-8666-111111111114", token_hash: "d".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111115", user_email_id: "bbbb1111-3333-4444-8666-111111111115", token_hash: "e".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111116", user_email_id: "bbbb1111-3333-4444-8666-111111111116", token_hash: "f".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111117", user_email_id: "bbbb1111-3333-4444-8666-111111111117", token_hash: "g".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111118", user_email_id: "bbbb1111-3333-4444-8666-111111111118", token_hash: "h".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111119", user_email_id: "bbbb1111-3333-4444-8666-111111111119", token_hash: "i".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111120", user_email_id: "bbbb1111-3333-4444-8666-111111111120", token_hash: "j".repeat(64) },
  { id: "cccc1111-3333-4444-8777-111111111121", user_email_id: "bbbb1111-3333-4444-8666-111111111121", token_hash: "k".repeat(64) },
];

async function hasData() {
  const { rows } = await pool.query("SELECT COUNT(*)::int as cnt FROM roles");
  return rows[0].cnt > 0;
}

export async function runSeed() {
  try {
    if (await hasData()) {
      console.log("[Seed] Database already has data, skipping seed");
      return;
    }

    console.log("[Seed] Seeding database...");
    const password_hash = await bcrypt.hash(PASSWORD, 10);

    for (const r of ROLES) {
      await pool.query("INSERT INTO roles (id, name, description, created_at) VALUES ($1, $2, $3, NOW())", [r.id, r.name, r.description]);
    }
    console.log(`[Seed] Inserted ${ROLES.length} roles`);

    for (const p of PERMISSIONS) {
      await pool.query("INSERT INTO permissions (id, name, description, created_at) VALUES ($1, $2, $3, NOW())", [p.id, p.name, p.description]);
    }
    console.log(`[Seed] Inserted ${PERMISSIONS.length} permissions`);

    await pool.query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2), ($3, $4)",
      ["3f3e7a10-0b48-4de2-8bef-0f5942d59ef2", "d7baf140-93a7-4c76-a236-082bfa69f613",
       "a3aa4ea2-fabb-4b11-b009-9c087a4141ef", "b2e96d42-7bb4-4d5d-b1b3-074d9f3e70c3"]
    );
    console.log(`[Seed] Inserted role_permissions`);

    for (const u of USERS) {
      await pool.query(
        "INSERT INTO users (id, user_name, password_hash, status, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())",
        [u.id, u.user_name, password_hash, u.status]
      );
    }
    console.log(`[Seed] Inserted ${USERS.length} users (password: ${PASSWORD})`);

    for (const ur of USER_ROLES) {
      await pool.query(
        "INSERT INTO user_roles (id, user_id, role_id, assigned_at) VALUES ($1, $2, $3, NOW())",
        [ur.id, ur.user_id, ur.role_id]
      );
    }
    console.log(`[Seed] Inserted ${USER_ROLES.length} user_roles`);

    for (const ue of USER_EMAILS) {
      await pool.query(
        "INSERT INTO user_emails (id, user_id, email, type, is_verified, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())",
        [ue.id, ue.user_id, ue.email, ue.type, ue.is_verified]
      );
    }
    console.log(`[Seed] Inserted ${USER_EMAILS.length} user_emails`);

    for (const ev of EMAIL_VERIFICATIONS) {
      await pool.query(
        "INSERT INTO email_verifications (id, user_email_id, token_hash, expires_at, used_at, created_at) VALUES ($1, $2, $3, NOW(), NOW(), NOW())",
        [ev.id, ev.user_email_id, ev.token_hash]
      );
    }
    console.log(`[Seed] Inserted ${EMAIL_VERIFICATIONS.length} email_verifications`);

    console.log("[Seed] Seed completed successfully");
  } catch (err) {
    console.error("[Seed] Seed failed:", err);
    throw err;
  }
}
