CREATE DATABASE IF NOT EXISTS `group_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
USE `group_db`;

-- Table: groups
CREATE TABLE `groups` (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    avatar_url TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    access ENUM('PUBLIC','RESTRICTED') NOT NULL DEFAULT 'PUBLIC',
    auto_approve_docs TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_name (name),
    INDEX idx_access (access)
) ENGINE=InnoDB;

-- Table: group_members
CREATE TABLE `group_members` (
    group_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    role ENUM('OWNER','MODERATOR','MEMBER') NOT NULL DEFAULT 'MEMBER',
    joined_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_member_group FOREIGN KEY (group_id) 
        REFERENCES `groups`(id) ON DELETE CASCADE,
    INDEX idx_user_group (user_id)
) ENGINE=InnoDB;

-- Table: group_join_requests
CREATE TABLE `group_join_requests` (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    requested_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    responded_at DATETIME(6) DEFAULT NULL,
    CONSTRAINT fk_gjr_group FOREIGN KEY (group_id) 
        REFERENCES `groups`(id) ON DELETE CASCADE,
    UNIQUE KEY uq_group_user_request (group_id, user_id)
) ENGINE=InnoDB;

-- Table: group_activity_logs
CREATE TABLE `group_activity_logs` (
    id CHAR(36) PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    actor_id CHAR(36) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target_id CHAR(36) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_gal_group FOREIGN KEY (group_id) 
        REFERENCES `groups`(id) ON DELETE CASCADE,
    INDEX idx_group_action (group_id, action),
    INDEX idx_actor (actor_id)
) ENGINE=InnoDB;

-- OUTBOX / INCOMING EVENTS
CREATE TABLE `outbox_events` (
    id CHAR(36) PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id CHAR(36) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    routing_key VARCHAR(128) NOT NULL,
    payload JSON NOT NULL,
    status ENUM('pending','published','failed') NOT NULL DEFAULT 'pending',
    published_at DATETIME(6) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_event (id),
    INDEX idx_status_created_at (status, created_at)
) ENGINE=InnoDB;

CREATE TABLE `incoming_events` (
    id CHAR(36) PRIMARY KEY,
    event_source VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) DEFAULT NULL,
    payload JSON NOT NULL,
    consumed_at DATETIME(6) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_event_source (event_source, id),
    INDEX idx_consumed_at (consumed_at)
) ENGINE=InnoDB;
