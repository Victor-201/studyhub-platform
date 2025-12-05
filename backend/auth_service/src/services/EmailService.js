import nodemailer from "nodemailer";
import { google } from "googleapis";

/**
 * EmailService handles sending emails via Gmail OAuth2
 */
export class EmailService {
  /**
   * @param {Object} config - Configuration for Gmail OAuth2
   * @param {string} config.user - Gmail address to send from
   * @param {string} config.clientId - Google OAuth2 client ID
   * @param {string} config.clientSecret - Google OAuth2 client secret
   * @param {string} config.redirectUri - Google OAuth2 redirect URI
   * @param {string} config.refreshToken - Google OAuth2 refresh token
   */
  constructor({ user, clientId, clientSecret, redirectUri, refreshToken }) {
    this.user = user;

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    this.oauth2Client.setCredentials({ refresh_token: refreshToken });

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }

  /**
   * Create a Nodemailer transporter using OAuth2 access token
   * @returns {Promise<nodemailer.Transporter>} - Nodemailer transporter
   * @throws {Error} - If access token generation fails
   */
  async createTransporter() {
    const accessToken = await this.oauth2Client
      .getAccessToken()
      .then(res => res?.token)
      .catch(() => null);

    if (!accessToken) {
      throw new Error("Failed to generate OAuth2 access token");
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: this.user,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: this.refreshToken,
        accessToken,
      },
    });
  }

  /**
   * Send an email using Gmail OAuth2
   * @param {Object} params
   * @param {string} params.to - Recipient email address
   * @param {string} params.subject - Email subject
   * @param {string} params.html - HTML content of the email
   * @returns {Promise<nodemailer.SentMessageInfo>} - Nodemailer send result
   */
  async sendEmail({ to, subject, html }) {
    const transporter = await this.createTransporter();

    return transporter.sendMail({
      from: `StudyHub <${this.user}>`,
      to,
      subject,
      html,
    });
  }
}
