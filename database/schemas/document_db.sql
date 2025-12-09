CREATE DATABASE IF NOT EXISTS `document_db`
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
    visibility ENUM('PUBLIC','PRIVATE','GROUP') NOT NULL DEFAULT 'PUBLIC',
    storage_path TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    INDEX idx_owner (owner_id),
    INDEX idx_visibility (visibility)
);

-- ==================================================================
-- Table: document_tags
-- ==================================================================
CREATE TABLE document_tags (
    document_id CHAR(36) NOT NULL,
    tag VARCHAR(64) NOT NULL,

    PRIMARY KEY (document_id, tag),
    INDEX idx_tag (tag),

    CONSTRAINT fk_tags_document 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- ==================================================================
-- Table: document_bookmarks
-- ==================================================================
CREATE TABLE document_bookmarks (
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    bookmarked_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (document_id, user_id),
    INDEX idx_user_bookmark (user_id),

    CONSTRAINT fk_bookmarks_document 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

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
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) 
        ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT fk_comment_document 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,

    CONSTRAINT fk_comment_parent 
        FOREIGN KEY (parent_comment_id) REFERENCES document_comments(id) ON DELETE SET NULL,

    INDEX idx_document_id (document_id),
    INDEX idx_parent_comment (parent_comment_id)
);

-- ==================================================================
-- Table: document_downloads
-- ==================================================================
CREATE TABLE document_downloads (
    document_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    downloaded_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (document_id, user_id),
    INDEX idx_user_downloads (user_id),

    CONSTRAINT fk_downloads_document 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- ==================================================================
-- Table: group_documents
-- ==================================================================
CREATE TABLE group_documents (
    id CHAR(36) PRIMARY KEY,

    group_id CHAR(36) NOT NULL,
    document_id CHAR(36) NOT NULL,

    status ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',

    submitted_by CHAR(36) NOT NULL,
    reviewed_by CHAR(36) DEFAULT NULL,

    submitted_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    reviewed_at DATETIME(6) DEFAULT NULL,

    CONSTRAINT fk_group_docs_document 
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,

    INDEX idx_group (group_id),
    INDEX idx_document (document_id),
    INDEX idx_status (status),

    -- đảm bảo 1 document chỉ submit 1 lần vào 1 group
    UNIQUE KEY uq_group_doc (group_id, document_id)
);

-- ==================================================================
-- Table: outbox_events
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
);

-- ==================================================================
-- Table: incoming_events
-- ==================================================================
CREATE TABLE incoming_events (
    id CHAR(36) PRIMARY KEY,

    event_source VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) DEFAULT NULL,

    payload JSON NOT NULL,

    consumed_at DATETIME(6) DEFAULT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE KEY uq_event_source (event_source, id),
    INDEX idx_consumed_at (consumed_at)
);
