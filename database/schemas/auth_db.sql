CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE auth_db;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  user_name VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active','blocked','deleted') NOT NULL DEFAULT 'active',
  last_login_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE TABLE user_emails (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  email VARCHAR(320) NOT NULL,
  type ENUM('primary','secondary') DEFAULT 'secondary',
  is_verified TINYINT(1) DEFAULT 0, 
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_user_email (user_id, email),
  UNIQUE KEY uq_email_global (email),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE email_verifications (
  id CHAR(36) PRIMARY KEY,
  user_email_id CHAR(36) NOT NULL,    
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  used_at DATETIME(6) NULL,
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_email_id) REFERENCES user_emails(id) ON DELETE CASCADE,
  INDEX idx_token_hash (token_hash)
);

CREATE TABLE password_resets (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  used_at DATETIME(6) NULL,
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_token_hash (token_hash)
);

CREATE TABLE oauth_providers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  client_id VARCHAR(255),
  client_secret VARCHAR(512),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE oauth_accounts (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  provider ENUM('google','facebook','github','linkedin') NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  provider_data JSON,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_provider_user (provider, provider_user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  refresh_token_hash CHAR(128) NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  last_used_at DATETIME(6),
  expires_at DATETIME(6) NOT NULL,
  revoked_at DATETIME(6),
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  device_info VARCHAR(255),
  UNIQUE KEY uq_refresh_token (refresh_token_hash),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_user (user_id)
);

CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  description VARCHAR(255),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE permissions (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(128) UNIQUE NOT NULL,
  description VARCHAR(255),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE role_permissions (
  role_id CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE TABLE user_roles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role_id CHAR(36) NOT NULL,
  assigned_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  revoked_at DATETIME(6),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  INDEX idx_user_roles_user (user_id)
);

CREATE TABLE user_blocks (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  blocked_by CHAR(36),
  reason VARCHAR(1024),
  blocked_until DATETIME(6),
  is_permanent TINYINT(1) DEFAULT 0,
  lifted_at DATETIME(6),
  revoked_by CHAR(36),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_deletions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  deleted_by CHAR(36),
  reason VARCHAR(1024),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  restored_at DATETIME(6),
  restored_by CHAR(36),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id CHAR(36) PRIMARY KEY,
  actor_user_id CHAR(36),
  target_user_id CHAR(36),
  action VARCHAR(128) NOT NULL,
  resource_type VARCHAR(64),
  resource_id VARCHAR(128),
  meta JSON,
  ip VARCHAR(45),
  user_agent VARCHAR(512),
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE email_templates (
  name VARCHAR(128) PRIMARY KEY,
  subject_template VARCHAR(255) NOT NULL,
  body_template TEXT NOT NULL,
  created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE TABLE outbox_events (
  id CHAR(36) PRIMARY KEY,
  aggregate_type VARCHAR(64) NOT NULL, 
  aggregate_id CHAR(36) NOT NULL,         
  event_type VARCHAR(128) NOT NULL,        
  routing_key VARCHAR(128) NOT NULL,      
  payload JSON NOT NULL,                    
  status ENUM('pending','published','failed') NOT NULL DEFAULT 'pending',
  published_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_event (id),
  INDEX idx_status_created_at (status, created_at)
);
