import express from "express";
import { pool } from "./config/db.js";
import { createRoutes } from "./routes/index.js";
import { verifyAccessToken } from "./middlewares/auth.js";

// Repositories
import { UserRepository } from "./repos/UserRepository.js";
import { UserEmailRepository } from "./repos/UserEmailRepository.js";
import { SessionRepository } from "./repos/SessionRepository.js";
import { PasswordResetRepository } from "./repos/PasswordResetRepository.js";
import { EmailVerificationRepository } from "./repos/EmailVerificationRepository.js";
import { AuditLogRepository } from "./repos/AuditLogRepository.js";
import { UserBlockRepository } from "./repos/UserBlockRepository.js";
import { UserDeletionRepository } from "./repos/UserDeletionRepository.js";
import { RoleRepository } from "./repos/RoleRepository.js";
import { PermissionRepository } from "./repos/PermissionRepository.js";
import { UserRoleRepository } from "./repos/UserRoleRepository.js";
import { OAuthAccountRepository } from "./repos/OAuthAccountRepository.js";
import { OAuthProviderRepository } from "./repos/OAuthProviderRepository.js";

// Services
import { AuthService } from "./services/AuthService.js";
import { AdminService } from "./services/AdminService.js";
import { OAuthService } from "./services/OAuthService.js";
import { AuditService } from "./services/AuditService.js";
import { UserService } from "./services/UserService.js";

// Controllers
import { AuthController } from "./controllers/AuthController.js";
import { AdminController } from "./controllers/AdminController.js";
import { OAuthController } from "./controllers/OAuthController.js";
import { ReportController } from "./controllers/ReportController.js";
import { UserController } from "./controllers/UserController.js";

export function createApp() {
  const app = express();

  // Built-in JSON parser
  app.use(express.json());

  // --- Logger middleware ---
  app.use((req, res, next) => {
    const start = Date.now();

    // Log request body for POST/PATCH
    if (["POST", "PATCH"].includes(req.method) && Object.keys(req.body || {}).length > 0) {
      console.log(`[Request Body]`, req.body);
    }

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next();
  });

  // --- Init repositories ---
const userRepo = new UserRepository(pool);
const userEmailRepo = new UserEmailRepository(pool);
const sessionRepo = new SessionRepository(pool);
const passwordResetRepo = new PasswordResetRepository(pool);
const emailVerificationRepo = new EmailVerificationRepository(pool);
const auditRepo = new AuditLogRepository(pool);
const userBlockRepo = new UserBlockRepository(pool);
const userDeletionRepo = new UserDeletionRepository(pool);
const roleRepo = new RoleRepository(pool);
const permissionRepo = new PermissionRepository(pool);
const userRoleRepo = new UserRoleRepository(pool);
const oauthAccountRepo = new OAuthAccountRepository(pool);
const oauthProviderRepo = new OAuthProviderRepository(pool);

  // --- Init services ---
  const authService = new AuthService({
    userRepo,
    userEmailRepo,
    sessionRepo,
    passwordResetRepo,
    emailVerificationRepo,
    auditRepo
  });

  const adminService = new AdminService({
    userRepo,
    userBlockRepo,
    userDeletionRepo,
    roleRepo,
    permissionRepo,
    userRoleRepo,
    auditRepo
  });

  const oauthService = new OAuthService({
    userRepo,
    oauthAccountRepo,
    oauthProviderRepo
  });

  const auditService = new AuditService({ auditRepo });

  const userService = new UserService({
    userRepo,
    userEmailRepo,
    sessionRepo
  });

  // --- Init controllers ---
  const controllers = {
    authController: new AuthController({ authService }),
    adminController: new AdminController({ adminService }),
    oauthController: new OAuthController({ oauthService }),
    reportController: new ReportController({ auditService }),
    userController: new UserController({ userService })
  };

  // --- Mount routes ---
  app.use("/api", createRoutes({ controllers, verifyAccessToken }));

  // 404 handler
  app.use((req, res) => res.status(404).json({ error: "Not found" }));

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(`[Error]`, err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}