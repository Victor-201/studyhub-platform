/**
 * @module utils/email/emailTemplates
 */

import { env } from "../../config/env.js";
import { renderEmail } from "./emailLayout.js";

/**
 * Collection of StudyHub email templates
 * Each function returns { subject, html } ready for sending
 */
export const EmailTemplates = {

  /**
   * Email for account verification
   * @param {Object} params
   * @param {string} params.userName - User's name
   * @param {string} params.token - Email verification token
   * @returns {{subject:string, html:string}}
   */
  verifyEmail: ({ userName, token }) => {
    const content = `
      <p>Hi <strong>${userName}</strong>,</p>
      <p>Thank you for registering with StudyHub! Please verify your email by clicking the button below:</p>
      <a href="${env.FRONTEND_URL}/verify-email?token=${token}" 
         class="button" style="background:#4A90E2;">Verify Email</a>
      <p>This link will expire in <strong>24 hours</strong>.</p>
    `;
    return { subject: "Verify your StudyHub account", html: renderEmail({ title: "Email Verification", content }) };
  },

  /**
   * Email for password reset
   * @param {Object} params
   * @param {string} params.token - Password reset token
   * @returns {{subject:string, html:string}}
   */
  resetPassword: ({ token }) => {
    const content = `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${env.FRONTEND_URL}/reset-password?token=${token}" 
         class="button" style="background:#E24A4A;">Reset Password</a>
      <p>This link will expire in <strong>1 hour</strong>.</p>
    `;
    return { subject: "Reset your StudyHub password", html: renderEmail({ title: "Password Reset", content }) };
  },

  /**
   * Welcome email for new users
   * @param {Object} params
   * @param {string} params.userName - User's name
   * @returns {{subject:string, html:string}}
   */
  welcomeEmail: ({ userName }) => {
    const content = `
      <p>Welcome <strong>${userName}</strong>! 🎉</p>
      <p>Your StudyHub account has been created successfully. We're excited to have you on board!</p>
      <p>Get started by logging into your account:</p>
      <a href="${env.FRONTEND_URL}/login" 
         class="button" style="background:#4A90E2;">Login</a>
    `;
    return { subject: "Welcome to StudyHub!", html: renderEmail({ title: "Welcome!", content }) };
  },

  /**
   * Security alert email (unrecognized login)
   * @param {Object} params
   * @param {string} params.userName - User's name
   * @param {string} params.ip - IP address of login
   * @param {string} params.userAgent - Device/browser used
   * @returns {{subject:string, html:string}}
   */
  securityAlert: ({ userName, ip, userAgent }) => {
    const content = `
      <p>Hello <strong>${userName}</strong>,</p>
      <p>We noticed a login to your account from a new device:</p>
      <ul>
        <li>IP Address: ${ip}</li>
        <li>Device/Browser: ${userAgent}</li>
      </ul>
      <p>If this was you, no action is needed. If not, please reset your password immediately:</p>
      <a href="${env.FRONTEND_URL}/reset-password" 
         class="button" style="background:#E24A4A;">Reset Password</a>
    `;
    return { subject: "Security Alert: New Login Detected", html: renderEmail({ title: "Security Alert", content }) };
  }

};
