USE group_db;

-- ===========================================================
-- 1. GROUPS
-- ===========================================================
SET @group1 = UUID();
SET @group2 = UUID();

INSERT INTO `groups`(id, name, avatar_url, description, access, auto_approve_docs)
VALUES
(@group1, 'StudyHub Developers', NULL, 'Group for developers', 'PUBLIC', 1),
(@group2, 'AI Researchers', NULL, 'Private community for AI discussions', 'PRIVATE', 0);

-- ===========================================================
-- 2. GROUP MEMBERS (OWNER + MODS + MEMBERS)
-- ===========================================================
-- Owner of group1
SET @owner1 = '00000000-0000-0000-0000-000000000001';

-- Owner of group2
SET @owner2 = '00000000-0000-0000-0000-000000000002';

INSERT INTO group_members(group_id, user_id, role)
VALUES
(@group1, @owner1, 'OWNER'),
(@group2, @owner2, 'OWNER'),

-- Extra members
(@group1, '00000000-0000-0000-0000-000000000003', 'MODERATOR'),
(@group1, '00000000-0000-0000-0000-000000000004', 'MEMBER'),
(@group2, '00000000-0000-0000-0000-000000000005', 'MEMBER');

-- ===========================================================
-- 3. GROUP JOIN REQUESTS
-- ===========================================================
INSERT INTO group_join_requests(id, group_id, user_id, status, responded_at)
VALUES
(UUID(), @group2, '00000000-0000-0000-0000-000000000006', 'PENDING', NULL),
(UUID(), @group2, '00000000-0000-0000-0000-000000000007', 'APPROVED', CURRENT_TIMESTAMP(6));

-- ===========================================================
-- 4. GROUP ACTIVITY LOGS
-- ===========================================================
INSERT INTO group_activity_logs(id, group_id, actor_id, action, target_id)
VALUES
(UUID(), @group1, @owner1, 'CREATE_GROUP', NULL),
(UUID(), @group1, '00000000-0000-0000-0000-000000000003', 'ADD_MEMBER', '00000000-0000-0000-0000-000000000004');

-- ===========================================================
-- 5. OUTBOX EVENTS
-- ===========================================================
INSERT INTO outbox_events(id, aggregate_type, aggregate_id, event_type, routing_key, payload)
VALUES
(UUID(), 'group', @group1, 'GroupCreated', 'group.created', JSON_OBJECT('group_id', @group1)),
(UUID(), 'group', @group2, 'MemberJoined', 'group.member_joined', JSON_OBJECT('group_id', @group2, 'user_id', @owner2));

-- ===========================================================
-- 6. INCOMING EVENTS
-- ===========================================================
INSERT INTO incoming_events(id, event_source, event_type, payload)
VALUES
(UUID(), 'auth-service', 'UserDeleted', JSON_OBJECT('user_id', '00000000-0000-0000-0000-000000000008'));
