USE user_db;

-- ==================================================================
-- USERS (1 admin + 10 normal users)
-- ==================================================================
INSERT INTO users (id, display_name, full_name, avatar_url, status)
VALUES
('11111111-1111-4111-8111-111111111111', 'admin', 'Administrator', NULL, 'offline'),

('11111111-2222-4222-8222-111111111112', 'user1', 'User One', NULL, 'offline'),
('11111111-2222-4222-8222-111111111113', 'user2', 'User Two', NULL, 'offline'),
('11111111-2222-4222-8222-111111111114', 'user3', 'User Three', NULL, 'offline'),
('11111111-2222-4222-8222-111111111115', 'user4', 'User Four', NULL, 'offline'),
('11111111-2222-4222-8222-111111111116', 'user5', 'User Five', NULL, 'offline'),
('11111111-2222-4222-8222-111111111117', 'user6', 'User Six', NULL, 'offline'),
('11111111-2222-4222-8222-111111111118', 'user7', 'User Seven', NULL, 'offline'),
('11111111-2222-4222-8222-111111111119', 'user8', 'User Eight', NULL, 'offline'),
('11111111-2222-4222-8222-111111111120', 'user9', 'User Nine', NULL, 'offline'),
('11111111-2222-4222-8222-111111111121', 'user10', 'User Ten', NULL, 'offline')
ON DUPLICATE KEY UPDATE id=id;

-- ==================================================================
-- PROFILE DETAILS (each user gets basic info)
-- ==================================================================
INSERT INTO user_profile_details (user_id, bio, gender, birthday, country, city)
VALUES
('11111111-1111-4111-8111-111111111111', 'System administrator', 'other',     '1990-01-01', 'Vietnam', 'Danang'),

('11111111-2222-4222-8222-111111111112', 'Hello, I am user1', 'male',   '2000-01-01', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111113', 'Hello, I am user2', 'female', '2000-02-02', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111114', 'Hello, I am user3', 'male',   '2000-03-03', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111115', 'Hello, I am user4', 'male',   '2000-04-04', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111116', 'Hello, I am user5', 'female', '2000-05-05', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111117', 'Hello, I am user6', 'male',   '2000-06-06', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111118', 'Hello, I am user7', 'male',   '2000-07-07', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111119', 'Hello, I am user8', 'female', '2000-08-08', 'Vietnam', 'Hanoi'),
('11111111-2222-4222-8222-111111111120', 'Hello, I am user9', 'female', '2000-09-09', 'Vietnam', 'HCMC'),
('11111111-2222-4222-8222-111111111121', 'Hello, I am user10','male',  '2000-10-10', 'Vietnam', 'HCMC')
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ==================================================================
-- DEFAULT PRIVACY SETTINGS
-- ==================================================================
INSERT INTO user_privacy_settings (
  user_id, show_full_name, show_bio, show_gender, show_birthday,
  show_location, show_avatar, show_profile, allow_messages, allow_tagging
)
VALUES
('11111111-1111-4111-8111-111111111111', 1,1,1,0,1,1,1,'everyone',1),

('11111111-2222-4222-8222-111111111112', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111113', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111114', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111115', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111116', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111117', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111118', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111119', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111120', 1,1,1,0,1,1,1,'everyone',1),
('11111111-2222-4222-8222-111111111121', 1,1,1,0,1,1,1,'everyone',1)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ==================================================================
-- SOCIAL LINKS (GitHub demo)
-- ==================================================================
INSERT INTO user_social_links (id, user_id, platform, url)
VALUES
(UUID(), '11111111-1111-4111-8111-111111111111', 'github', 'https://github.com/admin'),

(UUID(), '11111111-2222-4222-8222-111111111112', 'github', 'https://github.com/user1'),
(UUID(), '11111111-2222-4222-8222-111111111113', 'github', 'https://github.com/user2'),
(UUID(), '11111111-2222-4222-8222-111111111114', 'github', 'https://github.com/user3'),
(UUID(), '11111111-2222-4222-8222-111111111115', 'github', 'https://github.com/user4'),
(UUID(), '11111111-2222-4222-8222-111111111116', 'github', 'https://github.com/user5'),
(UUID(), '11111111-2222-4222-8222-111111111117', 'github', 'https://github.com/user6'),
(UUID(), '11111111-2222-4222-8222-111111111118', 'github', 'https://github.com/user7'),
(UUID(), '11111111-2222-4222-8222-111111111119', 'github', 'https://github.com/user8'),
(UUID(), '11111111-2222-4222-8222-111111111120', 'github', 'https://github.com/user9'),
(UUID(), '11111111-2222-4222-8222-111111111121', 'github', 'https://github.com/user10')
ON DUPLICATE KEY UPDATE id=id;

-- ==================================================================
-- INTERESTS
-- ==================================================================
INSERT INTO user_interests (id, user_id, interest)
VALUES
(UUID(), '11111111-1111-4111-8111-111111111111', 'System Admin'),

(UUID(), '11111111-2222-4222-8222-111111111112', 'Web Dev'),
(UUID(), '11111111-2222-4222-8222-111111111113', 'Database'),
(UUID(), '11111111-2222-4222-8222-111111111114', 'DevOps'),
(UUID(), '11111111-2222-4222-8222-111111111115', 'AI'),
(UUID(), '11111111-2222-4222-8222-111111111116', 'Cloud'),
(UUID(), '11111111-2222-4222-8222-111111111117', 'Backend'),
(UUID(), '11111111-2222-4222-8222-111111111118', 'Frontend'),
(UUID(), '11111111-2222-4222-8222-111111111119', 'Security'),
(UUID(), '11111111-2222-4222-8222-111111111120', 'Testing'),
(UUID(), '11111111-2222-4222-8222-111111111121', 'Mobile Dev')
ON DUPLICATE KEY UPDATE id=id;
