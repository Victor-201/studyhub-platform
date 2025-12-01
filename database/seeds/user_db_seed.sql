USE user_db;

-- ========================
-- USERS
-- ========================
INSERT INTO users (id, display_name, full_name, avatar_url, status) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479','user01','User 01',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d480','user02','User 02',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481','user03','User 03',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482','user04','User 04',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d483','user05','User 05',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d484','user06','User 06',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485','user07','User 07',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d486','user08','User 08',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d487','user09','User 09',NULL,'offline'),
('f47ac10b-58cc-4372-a567-0e02b2c3d488','user10','User 10',NULL,'offline');

-- ========================
-- USER PROFILE DETAILS
-- ========================
INSERT INTO user_profile_details (user_id, bio, gender, birthday, country, city) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479','Bio user01','male','2000-01-01','Vietnam','Hanoi'),
('f47ac10b-58cc-4372-a567-0e02b2c3d480','Bio user02','female','2000-02-02','USA','NYC'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481','Bio user03','other','2000-03-03','Japan','Tokyo'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482','Bio user04','male','2000-04-04','UK','London'),
('f47ac10b-58cc-4372-a567-0e02b2c3d483','Bio user05','female','2000-05-05','France','Paris'),
('f47ac10b-58cc-4372-a567-0e02b2c3d484','Bio user06','male','2000-06-06','Vietnam','HCMC'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485','Bio user07','female','2000-07-07','USA','LA'),
('f47ac10b-58cc-4372-a567-0e02b2c3d486','Bio user08','other','2000-08-08','Japan','Osaka'),
('f47ac10b-58cc-4372-a567-0e02b2c3d487','Bio user09','male','2000-09-09','UK','Manchester'),
('f47ac10b-58cc-4372-a567-0e02b2c3d488','Bio user10','female','2000-10-10','France','Lyon');

-- ========================
-- USER PRIVACY SETTINGS
-- ========================
INSERT INTO user_privacy_settings (user_id, show_full_name, show_bio, show_gender, show_birthday, show_location, show_avatar, show_profile, allow_messages, allow_tagging) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479',1,1,1,0,1,1,1,'everyone',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d480',1,1,1,0,1,1,1,'contacts',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d481',1,1,1,0,1,1,1,'no_one',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d482',1,1,1,0,1,1,1,'everyone',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d483',1,1,1,0,1,1,1,'contacts',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d484',1,1,1,0,1,1,1,'no_one',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d485',1,1,1,0,1,1,1,'everyone',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d486',1,1,1,0,1,1,1,'contacts',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d487',1,1,1,0,1,1,1,'no_one',1),
('f47ac10b-58cc-4372-a567-0e02b2c3d488',1,1,1,0,1,1,1,'everyone',1);

-- ========================
-- USER INTERESTS
-- ========================
INSERT INTO user_interests (id, user_id, interest) VALUES
('a1b2c3d4-0001-0000-0000-000000000001','f47ac10b-58cc-4372-a567-0e02b2c3d479','AI'),
('a1b2c3d4-0002-0000-0000-000000000002','f47ac10b-58cc-4372-a567-0e02b2c3d479','Coding'),
('a1b2c3d4-0003-0000-0000-000000000003','f47ac10b-58cc-4372-a567-0e02b2c3d480','Gaming'),
('a1b2c3d4-0004-0000-0000-000000000004','f47ac10b-58cc-4372-a567-0e02b2c3d480','Music'),
('a1b2c3d4-0005-0000-0000-000000000005','f47ac10b-58cc-4372-a567-0e02b2c3d481','Travel'),
('a1b2c3d4-0006-0000-0000-000000000006','f47ac10b-58cc-4372-a567-0e02b2c3d481','Art'),
('a1b2c3d4-0007-0000-0000-000000000007','f47ac10b-58cc-4372-a567-0e02b2c3d482','Sports'),
('a1b2c3d4-0008-0000-0000-000000000008','f47ac10b-58cc-4372-a567-0e02b2c3d482','Coding'),
('a1b2c3d4-0009-0000-0000-000000000009','f47ac10b-58cc-4372-a567-0e02b2c3d483','AI'),
('a1b2c3d4-0010-0000-0000-000000000010','f47ac10b-58cc-4372-a567-0e02b2c3d483','Music');

-- ========================
-- USER SOCIAL LINKS
-- ========================
INSERT INTO user_social_links (id, user_id, platform, url) VALUES
('b1c2d3e4-0001-0000-0000-000000000001','f47ac10b-58cc-4372-a567-0e02b2c3d479','github','https://github.com/user01'),
('b1c2d3e4-0002-0000-0000-000000000002','f47ac10b-58cc-4372-a567-0e02b2c3d479','twitter','https://twitter.com/user01'),
('b1c2d3e4-0003-0000-0000-000000000003','f47ac10b-58cc-4372-a567-0e02b2c3d480','linkedin','https://linkedin.com/in/user02'),
('b1c2d3e4-0004-0000-0000-000000000004','f47ac10b-58cc-4372-a567-0e02b2c3d480','facebook','https://facebook.com/user02');

-- ========================
-- USER FOLLOWS
-- ========================
INSERT INTO user_follows (follower_id, target_user_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479','f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d480','f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481','f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482','f47ac10b-58cc-4372-a567-0e02b2c3d480');
