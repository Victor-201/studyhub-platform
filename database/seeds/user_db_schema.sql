CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE user_db;

-- 1) Basic profile
CREATE TABLE user_profiles (
  user_id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(32),
  dob DATE,
  gender ENUM('male','female','other') NULL,
  bio TEXT,
  address TEXT,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- 2) Avatar metadata
CREATE TABLE user_avatars (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  file_url VARCHAR(512) NOT NULL,
  file_type VARCHAR(64),
  file_size INT,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- 3) Security settings
CREATE TABLE user_security_settings (
  user_id CHAR(36) PRIMARY KEY,
  two_factor_enabled TINYINT(1) DEFAULT 0,
  backup_codes JSON,
  login_alerts_enabled TINYINT(1) DEFAULT 1,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

-- 4) Activity logs
CREATE TABLE user_activity_logs (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  action VARCHAR(255) NOT NULL,
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  meta JSON,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- 5) Notification settings
CREATE TABLE user_notification_settings (
  user_id CHAR(36) PRIMARY KEY,
  email_notify TINYINT(1) DEFAULT 1,
  sms_notify TINYINT(1) DEFAULT 0,
  push_notify TINYINT(1) DEFAULT 1,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);
