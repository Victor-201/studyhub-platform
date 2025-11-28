USE auth_db;

-- Roles
INSERT INTO roles(name, description) VALUES
('guest','Guest'),
('user','Normal user'),
('admin','Administrator');

-- Permissions
INSERT INTO permissions(name, description) VALUES
('auth.register','Register'),
('auth.login','Login'),
('auth.password.reset','Reset password'),
('user.profile.read','Own profile'),
('user.profile.update','Update profile'),
('user.manage','Manage users'),
('user.assign.role','Assign roles'),
('report.export','Export reports');

SET @role_user = (SELECT id FROM roles WHERE name='user');
SET @role_admin = (SELECT id FROM roles WHERE name='admin');

-- Map permissions
INSERT INTO role_permissions(role_id, permission_id)
SELECT @role_user, id FROM permissions 
WHERE name IN ('auth.register','auth.login','auth.password.reset','user.profile.read','user.profile.update');

INSERT INTO role_permissions(role_id, permission_id)
SELECT @role_admin, id FROM permissions;

-- Seed admin
INSERT INTO users(id, email, password_hash, is_active)
VALUES ('00000000-0000-0000-0000-000000000001',
        'admin@example.com',
        '$2b$12$yR/NKZQ0zO3KpR8O3rVq9.2g3t0u2Q7y3zq9W1sVb0q1qP7Fh2p6',
        1);

INSERT INTO user_roles(id, user_id, role_id)
VALUES(UUID(), '00000000-0000-0000-0000-000000000001', @role_admin);

-- OAuth providers
INSERT INTO oauth_providers(name) VALUES ('google'), ('facebook');

-- Email templates
INSERT INTO email_templates(name, subject_template, body_template)
VALUES
('verify_email','Verify your account','Click {{link}}'),
('reset_password','Reset password','Click {{link}}');
