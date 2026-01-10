CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE user_db;

-- Table: users (core profile)
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  display_name VARCHAR(128) NOT NULL,
  full_name VARCHAR(128) DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL,
  status ENUM('online','offline') NOT NULL DEFAULT 'offline',
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  INDEX idx_display_name (display_name),
  INDEX idx_full_name (full_name),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Table: user_profile_details (extended profile)
CREATE TABLE user_profile_details (
  user_id CHAR(36) PRIMARY KEY,
  bio TEXT DEFAULT NULL,
  gender ENUM('male','female','other') DEFAULT NULL,
  birthday DATE DEFAULT NULL,
  country VARCHAR(64) DEFAULT NULL,
  city VARCHAR(64) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_upd_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_country (country),
  INDEX idx_city (city)
) ENGINE=InnoDB;

-- Table: user_privacy_settings (combine privacy + visibility)
CREATE TABLE user_privacy_settings (
  user_id CHAR(36) PRIMARY KEY,
  show_full_name TINYINT(1) NOT NULL DEFAULT 1,
  show_bio TINYINT(1) NOT NULL DEFAULT 1,
  show_gender TINYINT(1) NOT NULL DEFAULT 1,
  show_birthday TINYINT(1) NOT NULL DEFAULT 0,
  show_location TINYINT(1) NOT NULL DEFAULT 1,
  show_avatar TINYINT(1) NOT NULL DEFAULT 1,
  show_profile TINYINT(1) NOT NULL DEFAULT 1,
  allow_messages ENUM('everyone','no_one','contacts') NOT NULL DEFAULT 'everyone',
  allow_tagging TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_priv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: user_follows (follow 1 chiều; mutual follow = friend)
CREATE TABLE user_follows (
  follower_id CHAR(36) NOT NULL,
  target_user_id CHAR(36) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (follower_id, target_user_id),
  CONSTRAINT fk_follower_user FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_no_self_follow CHECK (follower_id <> target_user_id),
  INDEX idx_target_user (target_user_id),
  INDEX idx_follower_target (follower_id, target_user_id)
) ENGINE=InnoDB;

-- Table: user_social_links
CREATE TABLE user_social_links (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  platform VARCHAR(64) NOT NULL,
  url TEXT NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_usl_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_social (user_id, platform),
  INDEX idx_platform (platform)
) ENGINE=InnoDB;

-- Table: user_interests
CREATE TABLE user_interests (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  interest VARCHAR(128) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_ui_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_interest (user_id, interest),
  INDEX idx_interest (interest)
) ENGINE=InnoDB;

-- Table: incoming_events
CREATE TABLE incoming_events (
  id CHAR(36) PRIMARY KEY,
  event_source VARCHAR(64) NOT NULL,
  event_type VARCHAR(128) DEFAULT NULL,
  payload JSON NOT NULL,
  consumed_at DATETIME(6) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_event (event_source, id)
) ENGINE=InnoDB;

-- View: public_user_view (respect privacy flags)
CREATE OR REPLACE VIEW public_user_view AS
SELECT
  u.id AS user_id,
  u.display_name,
  CASE WHEN ups.show_full_name=1 THEN u.full_name ELSE NULL END AS full_name,
  CASE WHEN ups.show_avatar=1 THEN u.avatar_url ELSE NULL END AS avatar_url,
  CASE WHEN ups.show_bio=1 THEN upd.bio ELSE NULL END AS bio,
  CASE WHEN ups.show_gender=1 THEN upd.gender ELSE NULL END AS gender,
  CASE WHEN ups.show_birthday=1 THEN upd.birthday ELSE NULL END AS birthday,
  CASE WHEN ups.show_location=1 THEN upd.country ELSE NULL END AS country,
  CASE WHEN ups.show_location=1 THEN upd.city ELSE NULL END AS city,
  u.status
FROM users u
LEFT JOIN user_profile_details upd ON upd.user_id = u.id
LEFT JOIN user_privacy_settings ups ON ups.user_id = u.id
WHERE ups.show_profile = 1;

-- Stored procedures: search users & upsert privacy
DELIMITER $$
CREATE PROCEDURE sp_search_users (
  IN p_query VARCHAR(256),
  IN p_country VARCHAR(64),
  IN p_interest VARCHAR(128)
)
BEGIN
  SELECT DISTINCT pu.*
  FROM public_user_view pu
  LEFT JOIN user_interests ui ON ui.user_id = pu.user_id
  WHERE (p_query IS NULL OR p_query = '' OR pu.display_name LIKE CONCAT(p_query, '%') OR (pu.full_name IS NOT NULL AND pu.full_name LIKE CONCAT(p_query, '%')))
    AND (p_country IS NULL OR p_country = '' OR pu.country = p_country)
    AND (p_interest IS NULL OR p_interest = '' OR ui.interest = p_interest)
  LIMIT 100;
END$$

CREATE PROCEDURE sp_upsert_privacy (
  IN p_user_id CHAR(36),
  IN p_show_full_name TINYINT(1),
  IN p_show_bio TINYINT(1),
  IN p_show_gender TINYINT(1),
  IN p_show_birthday TINYINT(1),
  IN p_show_location TINYINT(1),
  IN p_show_avatar TINYINT(1),
  IN p_show_profile TINYINT(1),
  IN p_allow_messages ENUM('everyone','no_one','contacts'),
  IN p_allow_tagging TINYINT(1)
)
BEGIN
  INSERT INTO user_privacy_settings (user_id, show_full_name, show_bio, show_gender, show_birthday, show_location, show_avatar, show_profile, allow_messages, allow_tagging)
  VALUES (p_user_id, p_show_full_name, p_show_bio, p_show_gender, p_show_birthday, p_show_location, p_show_avatar, p_show_profile, p_allow_messages, p_allow_tagging)
  ON DUPLICATE KEY UPDATE
    show_full_name = VALUES(show_full_name),
    show_bio = VALUES(show_bio),
    show_gender = VALUES(show_gender),
    show_birthday = VALUES(show_birthday),
    show_location = VALUES(show_location),
    show_avatar = VALUES(show_avatar),
    show_profile = VALUES(show_profile),
    allow_messages = VALUES(allow_messages),
    allow_tagging = VALUES(allow_tagging),
    updated_at = CURRENT_TIMESTAMP(6);
END$$
DELIMITER ;

-- Trigger example: prevent self-follow
DROP TRIGGER IF EXISTS trg_user_follows_prevent_self;
DELIMITER $$
CREATE TRIGGER trg_user_follows_prevent_self
BEFORE INSERT ON user_follows
FOR EACH ROW
BEGIN
  IF NEW.follower_id = NEW.target_user_id THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot follow self';
  END IF;
END$$
DELIMITER ;

-- View: user_friends (mutual follow derived view)
CREATE OR REPLACE VIEW user_friends AS
SELECT 
  LEAST(f1.follower_id, f1.target_user_id) AS user_a,
  GREATEST(f1.follower_id, f1.target_user_id) AS user_b,
  GREATEST(f1.created_at, f2.created_at) AS became_friends_at
FROM user_follows f1
JOIN user_follows f2 
  ON f1.follower_id = f2.target_user_id
 AND f1.target_user_id = f2.follower_id;
