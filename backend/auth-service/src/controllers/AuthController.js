import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../config/env.js";
import nodemailer from "nodemailer";

export class AuthController {
  constructor({ authService, userService, emailVerificationService, passwordResetService }) {
    this.authService = authService;
    this.userService = userService;
    this.emailVerificationService = emailVerificationService;
    this.passwordResetService = passwordResetService;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.GMAIL_USER,
        pass: env.CLIENT_SECRET,
      },
    });
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.register({ email, password });
      const token = crypto.randomBytes(32).toString("hex");
      await this.emailVerificationService.createToken(user.id, token);
      const verifyLink = `${env.BASE_URL}/auth/verify-email?token=${token}`;
      await this.transporter.sendMail({
        from: env.GMAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Click here to verify your email: ${verifyLink}`,
        html: `<a href="${verifyLink}">${verifyLink}</a>`,
      });
      res.status(201).json({ user, message: "User created. Please verify your email." });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      const userId = await this.emailVerificationService.verifyToken(token);
      await this.userService.markEmailVerified(userId);
      res.json({ success: true, message: "Email verified successfully." });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const token = await this.passwordResetService.createToken(email);
      const resetLink = `${env.BASE_URL}/auth/reset-password?token=${token}`;
      await this.transporter.sendMail({
        from: env.GMAIL_USER,
        to: email,
        subject: "Reset your password",
        text: `Click here to reset your password: ${resetLink}`,
        html: `<a href="${resetLink}">${resetLink}</a>`,
      });
      res.json({ message: "Password reset email sent." });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      await this.passwordResetService.resetPassword(token, newPassword);
      res.json({ success: true, message: "Password has been reset successfully." });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
