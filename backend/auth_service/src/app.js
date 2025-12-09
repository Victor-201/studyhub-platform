import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

// Import routes
import { createRoutes } from "./routes/index.js";

// Import repositories
import { UserRepository } from "./repos/UserRepository.js";
import { UserEmailRepository } from "./repos/UserEmailRepository.js";
import { SessionRepository } from "./repos/SessionRepository.js";
import { PasswordResetRepository } from "./repos/PasswordResetRepository.js";
import { EmailVerificationRepository } from "./repos/EmailVerificationRepository.js";
import { AuditLogRepository } from "./repos/AuditLogRepository.js";
import { UserRoleRepository } from "./repos/UserRoleRepository.js";
import { RoleRepository } from "./repos/RoleRepository.js";
import { RolePermissionRepository } from "./repos/RolePermissionRepository.js";
import { PermissionRepository } from "./repos/PermissionRepository.js";
import { UserBlockRepository } from "./repos/UserBlockRepository.js";
import { UserDeletionRepository } from "./repos/UserDeletionRepository.js";
import { EmailTemplateRepository } from "./repos/EmailTemplateRepository.js";
import { OAuthProviderRepository } from "./repos/OAuthProviderRepository.js";
import { OAuthAccountRepository } from "./repos/OAuthAccountRepository.js";

// Import services
import { AuthService } from "./services/AuthService.js";
import { AdminService } from "./services/AdminService.js";
import { OAuthService } from "./services/OAuthService.js";
import { UserService } from "./services/UserService.js";
import { EmailService } from "./services/EmailService.js";

export function createApp() {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Initialize Email Service
const emailService = new EmailService({
  user: env.GMAIL_USER,
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  redirectUri: env.REDIRECT_URI,
  refreshToken: env.REFRESH_TOKEN,
});

  // Initialize repositories
  const userRepo = new UserRepository(pool);
  const userEmailRepo = new UserEmailRepository(pool);
  const sessionRepo = new SessionRepository(pool);
  const passwordResetRepo = new PasswordResetRepository(pool);
  const emailVerificationRepo = new EmailVerificationRepository(pool);
  const auditRepo = new AuditLogRepository(pool);
  const userRoleRepo = new UserRoleRepository(pool);
  const roleRepo = new RoleRepository(pool);
  const rolePermissionRepo = new RolePermissionRepository(pool);
  const permissionRepo = new PermissionRepository(pool);
  const userBlockRepo = new UserBlockRepository(pool);
  const userDeletionRepo = new UserDeletionRepository(pool);
  const emailTemplateRepo = new EmailTemplateRepository(pool);
  const oAuthProviderRepo = new OAuthProviderRepository(pool);
  const oAuthAccountRepo = new OAuthAccountRepository(pool);

  // Initialize services with dependencies
  const authService = new AuthService({
    userRepo,
    userEmailRepo,
    sessionRepo,
    passwordResetRepo,
    emailVerificationRepo,
    auditRepo,
    userRoleRepo,
    roleRepo,
    emailService,
  });

  const adminService = new AdminService({
    userRepo,
    userRoleRepo,
    userBlockRepo,
    userDeletionRepo,
    auditRepo,
    roleRepo,
    rolePermissionRepo,
    permissionRepo,
    userEmailRepo,
    emailTemplateRepo,
  });

  const oauthService = new OAuthService({
    oAuthProviderRepo,
    oAuthAccountRepo,
    userRepo,
    userEmailRepo,
    sessionRepo,
    auditRepo,
    userRoleRepo,
    roleRepo,
  });

  const userService = new UserService({
    userRepo,
    userEmailRepo,
    auditRepo,
    userRoleRepo,
    roleRepo,
    rolePermissionRepo,
    permissionRepo,
  });

  // Mount routers
  app.use(
    "/api/v1/auth",
    createRoutes({ authService, adminService, oauthService, userService })
  );

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
