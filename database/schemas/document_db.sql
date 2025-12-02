CREATE DATABASE IF NOT EXISTS document_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
USE document_db;

-- ==================================================================
-- Table: documents
-- ==================================================================
CREATE TABLE documents (
    id CHAR(36) PRIMARY KEY,
    owner_id CHAR(36) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT DEFAULT NULL,
    visibility ENUM('PUBLIC','PRIVATE','GROUP') NOT NULL DEFAULT 'PRIVATE',
    group_id CHAR(36) DEFAULT NULL,
    storage_path TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    INDEX idx_owner (owner_id),
    INDEX idx_visibility (visibility),
    INDEX idx_group_id (group_id)
) ENGINE=InnoDB;

-- ==================================================================
-- Table: document_tags
-- ==================================================================
CREATE TABLE document_tags (
    document_id CHAR(36) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    PRIMARY KEY (document_id, tag),
    INDEX idx_tag (tag)
) ENGINE=InnoDB;

-- ==================================================================
-- Table: document_bookmarks
-- ==================================================================
CREATE TABLE document_bookmarks (
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    bookmarked_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (document_id, user_id),
    INDEX idx_user_bookmark (user_id)
) ENGINE=InnoDB;

-- ==================================================================
-- Table: document_comments
-- ==================================================================
CREATE TABLE document_comments (
    id CHAR(36) PRIMARY KEY,
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id CHAR(36) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_comment_document FOREIGN KEY (document_id) 
        REFERENCES documents(id) ON DELETE CASCADE,
    INDEX idx_document_id (document_id),
    INDEX idx_parent_comment (parent_comment_id)
) ENGINE=InnoDB;

-- ==================================================================
-- Table: document_downloads
-- ==================================================================
CREATE TABLE document_downloads (
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    downloaded_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (document_id, user_id),
    INDEX idx_user_downloads (user_id)
) ENGINE=InnoDB;

-- ==================================================================
-- OUTBOX / INCOMING EVENTS
-- ==================================================================
CREATE TABLE outbox_events (
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

CREATE TABLE incoming_events (
    id CHAR(36) PRIMARY KEY,
    event_source VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) DEFAULT NULL,
    payload JSON NOT NULL,
    consumed_at DATETIME(6) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_event_source (event_source, id),
    INDEX idx_consumed_at (consumed_at)
) ENGINE=InnoDB;
