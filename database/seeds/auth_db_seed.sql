USE auth_db;

-- ===========================================================
-- 1. ROLES
-- ===========================================================
INSERT INTO roles(id, name, description)
VALUES
(UUID(), 'user', 'Normal user'),
(UUID(), 'admin', 'Administrator');

SET @role_user = (SELECT id FROM roles WHERE name='user');
SET @role_admin = (SELECT id FROM roles WHERE name='admin');

-- ===========================================================
-- 2. PERMISSIONS
-- ===========================================================
INSERT INTO permissions(id, name, description) VALUES
(UUID(), 'auth.register', 'Register'),
(UUID(), 'auth.login', 'Login'),
(UUID(), 'auth.password.reset', 'Reset password'),
(UUID(), 'user.profile.read', 'Read own profile'),
(UUID(), 'user.profile.update', 'Update profile'),
(UUID(), 'user.manage', 'Manage users'),
(UUID(), 'user.assign.role', 'Assign roles'),
(UUID(), 'report.export', 'Export reports');

-- ===========================================================
-- 3. MAP PERMISSIONS TO ROLES
-- ===========================================================
INSERT INTO role_permissions(role_id, permission_id)
SELECT @role_user, id FROM permissions 
WHERE name IN (
  'auth.register',
  'auth.login',
  'auth.password.reset',
  'user.profile.read',
  'user.profile.update'
);

INSERT INTO role_permissions(role_id, permission_id)
SELECT @role_admin, id FROM permissions;

-- ===========================================================
-- 4. CREATE ADMIN USER
-- ===========================================================
SET @admin_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO users(id, user_name, password_hash)
VALUES (
  @admin_id,
  'admin',
  '$2b$12$yR/NKZQ0zO3KpR8O3rVq9.2g3t0u2Q7y3zq9W1sVb0q1qP7Fh2p6' -- bcrypt fake
);

-- ===========================================================
-- 5. USER EMAILS
-- ===========================================================
SET @admin_email_id = UUID();

INSERT INTO user_emails(id, user_id, email, type, is_verified)
VALUES (
  @admin_email_id,
  @admin_id,
  'admin@example.com',
  'primary',
  1
);

-- ===========================================================
-- 6. USER ROLE: ADMIN
-- ===========================================================
INSERT INTO user_roles(id, user_id, role_id)
VALUES (UUID(), @admin_id, @role_admin);

-- ===========================================================
-- 7. OAUTH PROVIDERS
-- ===========================================================
INSERT INTO oauth_providers(name, client_id, client_secret)
VALUES 
('google', NULL, NULL),
('facebook', NULL, NULL);

-- ===========================================================
-- 8. EMAIL TEMPLATES
-- ===========================================================
INSERT INTO email_templates(name, subject_template, body_template)
VALUES
('verify_email', 'Verify your account', 'Click {{link}}'),
('reset_password', 'Reset password', 'Click {{link}}');
