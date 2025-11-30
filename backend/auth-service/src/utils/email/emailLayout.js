/**
 * @module utils/email/emailLayout
 */

/**
 * Render a complete HTML email with consistent layout (header, footer, styles)
 * @param {Object} params
 * @param {string} params.title - The email title, displayed in header and <title> tag
 * @param {string} params.content - The main HTML content of the email
 * @returns {string} - Complete HTML for the email
 */
export function renderEmail({ title, content }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body { font-family: 'Helvetica', Arial, sans-serif; background: #f5f6fa; margin: 0; padding: 0; }
      a { color: #fff; text-decoration: none; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.05);}
      .header { background: #4A90E2; color: #fff; text-align: center; padding: 20px; }
      .header h1 { margin: 0; font-size: 24px; }
      .header p { margin: 5px 0 0 0; font-size: 14px; color: #e0e0e0; }
      .content { padding: 30px; color: #333; font-size: 15px; line-height: 1.6; }
      .button { display: inline-block; padding: 12px 25px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { background: #f1f2f6; color: #777; font-size: 12px; text-align: center; padding: 20px; }
      @media screen and (max-width: 620px) {
        .container { width: 90%; margin: 20px auto; }
        .content { padding: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>StudyHub</h1>
        <p>${title}</p>
      </div>

      <!-- Main content -->
      <div class="content">
        ${content}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>This email was sent automatically. Please do not reply.</p>
        <p>© ${new Date().getFullYear()} StudyHub. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
