-- PostgreSQL seed data for Auth Service
-- Password for all users: Abc@12345
-- Password hash generated with bcrypt
-- To apply: psql -h <host> -U <user> -d studyhub_auth_db -f auth_db_seed_pg.sql

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, name, description, created_at) VALUES
('3f3e7a10-0b48-4de2-8bef-0f5942d59ef2', 'admin', 'System administrator', NOW()),
('a3aa4ea2-fabb-4b11-b009-9c087a4141ef', 'user', 'Regular authenticated user', NOW());

-- =========================
-- PERMISSIONS
-- =========================
INSERT INTO permissions (id, name, description, created_at) VALUES
('d7baf140-93a7-4c76-a236-082bfa69f613', 'manage_users', 'Admin can manage users', NOW()),
('b2e96d42-7bb4-4d5d-b1b3-074d9f3e70c3', 'basic_access', 'Normal user access', NOW());

-- ROLE → PERMISSION
INSERT INTO role_permissions (role_id, permission_id) VALUES
('3f3e7a10-0b48-4de2-8bef-0f5942d59ef2', 'd7baf140-93a7-4c76-a236-082bfa69f613'),
('a3aa4ea2-fabb-4b11-b009-9c087a4141ef', 'b2e96d42-7bb4-4d5d-b1b3-074d9f3e70c3');

-- =========================
-- ADMIN USER
-- =========================
INSERT INTO users (id, user_name, password_hash, status, created_at, updated_at)
VALUES ('11111111-1111-4111-8111-111111111111', 'admin', '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW());

INSERT INTO user_roles (id, user_id, role_id, assigned_at)
VALUES ('aaaa1111-2222-4333-8444-555566667777', '11111111-1111-4111-8111-111111111111', '3f3e7a10-0b48-4de2-8bef-0f5942d59ef2', NOW());

INSERT INTO user_emails (id, user_id, email, type, is_verified, created_at, updated_at)
VALUES ('bbbb1111-2222-4333-8444-555566667777', '11111111-1111-4111-8111-111111111111', 'admin@example.com', 'primary', TRUE, NOW(), NOW());

INSERT INTO email_verifications (id, user_email_id, token_hash, expires_at, used_at, created_at)
VALUES ('cccc1111-2222-4333-8444-555566667777', 'bbbb1111-2222-4333-8444-555566667777', REPEAT('a', 64), NOW(), NOW(), NOW());

-- =========================
-- NORMAL USERS (10 users)
-- =========================
INSERT INTO users (id, user_name, password_hash, status, created_at, updated_at) VALUES
('11111111-2222-4222-8222-111111111112', 'user1',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111113', 'user2',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111114', 'user3',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111115', 'user4',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111116', 'user5',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111117', 'user6',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111118', 'user7',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111119', 'user8',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111120', 'user9',  '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW()),
('11111111-2222-4222-8222-111111111121', 'user10', '$2b$10$7naRJtdkDsuGJ34HAiIldeaCwtlbxdKr9kX6arqa26VwUpIeHGD4i', 'active', NOW(), NOW());

-- USER ROLES
INSERT INTO user_roles (id, user_id, role_id, assigned_at) VALUES
('aaaa1111-3333-4444-8555-111111111112', '11111111-2222-4222-8222-111111111112', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111113', '11111111-2222-4222-8222-111111111113', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111114', '11111111-2222-4222-8222-111111111114', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111115', '11111111-2222-4222-8222-111111111115', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111116', '11111111-2222-4222-8222-111111111116', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111117', '11111111-2222-4222-8222-111111111117', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111118', '11111111-2222-4222-8222-111111111118', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111119', '11111111-2222-4222-8222-111111111119', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111120', '11111111-2222-4222-8222-111111111120', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW()),
('aaaa1111-3333-4444-8555-111111111121', '11111111-2222-4222-8222-111111111121', 'a3aa4ea2-fabb-4b11-b009-9c087a4141ef', NOW());

-- USER EMAILS
INSERT INTO user_emails (id, user_id, email, type, is_verified, created_at, updated_at) VALUES
('bbbb1111-3333-4444-8666-111111111112', '11111111-2222-4222-8222-111111111112', 'user1@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111113', '11111111-2222-4222-8222-111111111113', 'user2@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111114', '11111111-2222-4222-8222-111111111114', 'user3@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111115', '11111111-2222-4222-8222-111111111115', 'user4@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111116', '11111111-2222-4222-8222-111111111116', 'user5@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111117', '11111111-2222-4222-8222-111111111117', 'user6@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111118', '11111111-2222-4222-8222-111111111118', 'user7@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111119', '11111111-2222-4222-8222-111111111119', 'user8@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111120', '11111111-2222-4222-8222-111111111120', 'user9@example.com', 'primary', TRUE, NOW(), NOW()),
('bbbb1111-3333-4444-8666-111111111121', '11111111-2222-4222-8222-111111111121', 'user10@example.com', 'primary', TRUE, NOW(), NOW());

-- EMAIL VERIFICATIONS (all marked as used)
INSERT INTO email_verifications (id, user_email_id, token_hash, expires_at, used_at, created_at) VALUES
('cccc1111-3333-4444-8777-111111111112', 'bbbb1111-3333-4444-8666-111111111112', REPEAT('b', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111113', 'bbbb1111-3333-4444-8666-111111111113', REPEAT('c', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111114', 'bbbb1111-3333-4444-8666-111111111114', REPEAT('d', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111115', 'bbbb1111-3333-4444-8666-111111111115', REPEAT('e', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111116', 'bbbb1111-3333-4444-8666-111111111116', REPEAT('f', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111117', 'bbbb1111-3333-4444-8666-111111111117', REPEAT('g', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111118', 'bbbb1111-3333-4444-8666-111111111118', REPEAT('h', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111119', 'bbbb1111-3333-4444-8666-111111111119', REPEAT('i', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111120', 'bbbb1111-3333-4444-8666-111111111120', REPEAT('j', 64), NOW(), NOW(), NOW()),
('cccc1111-3333-4444-8777-111111111121', 'bbbb1111-3333-4444-8666-111111111121', REPEAT('k', 64), NOW(), NOW(), NOW());
