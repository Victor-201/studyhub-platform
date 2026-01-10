USE group_db;

INSERT INTO `groups` (id, name, avatar_url, description, access, auto_approve_docs) VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Group Alpha', NULL, 'Group 1 test', 'PUBLIC', 0),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Group Beta',  NULL, 'Group 2 test', 'RESTRICTED', 0);

-- =========================
-- GROUP 1 MEMBERS (6 người)
-- =========================
INSERT INTO group_members (group_id, user_id, role) VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111112', 'OWNER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111113', 'MODERATOR'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111114', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111115', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111116', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111117', 'MEMBER');

-- =========================
-- GROUP 2 MEMBERS (6 người)
-- =========================
INSERT INTO group_members (group_id, user_id, role) VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111113', 'OWNER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111114', 'MODERATOR'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111115', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111116', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111117', 'MEMBER'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111118', 'MEMBER');

-- =========================
-- PENDING JOIN REQUESTS
-- =========================

-- Group 1: user8, user9
INSERT INTO group_join_requests (id, group_id, user_id, status) VALUES
('req-aaaa-1111-4111-8111-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111119', 'PENDING'),
('req-aaaa-1111-4111-8111-aaaaaaaaaaa2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-2222-4222-8222-111111111120', 'PENDING');

-- Group 2: user9, user10
INSERT INTO group_join_requests (id, group_id, user_id, status) VALUES
('req-bbbb-1111-4111-8111-aaaaaaaaaaa1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111120', 'PENDING'),
('req-bbbb-1111-4111-8111-aaaaaaaaaaa2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-2222-4222-8222-111111111121', 'PENDING');