const nodemailer = require('nodemailer');
const pool = require('../config/db');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST || 'mail.reachskyline.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || 'support@reachskyline.com';
    const pass = process.env.SMTP_PASS || '';

    if (pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });
      console.log(`[EmailService] Direct SMTP Transporter initialized for ${user} via ${host}:${port}`);
    } else {
      console.log(`[EmailService] SMTP_PASS not set in .env yet. Direct SMTP waiting for credentials.`);
    }
  }

  // Core email dispatch method
  async sendEmail(emails, subject, bodyHtml) {
    if (!emails || (Array.isArray(emails) && emails.length === 0)) return false;
    const emailList = Array.isArray(emails) ? emails : [emails];
    const rawEmails = emailList.filter(e => e && e.includes('@') && !e.includes('_deleted_'));
    if (rawEmails.length === 0) return false;

    // Filter out emails belonging to inactive or deleted users
    let validEmails = [];
    try {
      const [activeRows] = await pool.query(
        "SELECT email FROM users WHERE email IN (?) AND status = 'active' AND deleted_at IS NULL",
        [rawEmails]
      );
      const activeEmailsSet = new Set(activeRows.map(r => r.email));
      validEmails = rawEmails.filter(e => activeEmailsSet.has(e));
    } catch (_) {
      validEmails = rawEmails.filter(e => !e.includes('_deleted_'));
    }

    if (validEmails.length === 0) {
      console.log('[EmailService] All target recipient emails belong to deleted or inactive users. Email blocked automatically.');
      return false;
    }

    // Check if transporter is configured
    if (!this.transporter && process.env.SMTP_PASS) {
      this.initTransporter();
    }

    if (!this.transporter) {
      console.log(`[EmailService] Direct SMTP not active (set SMTP_PASS in backend/.env).`);
      return false;
    }

    try {
      const fromAddress = process.env.SMTP_FROM || `"ReachSkyline ERP" <${process.env.SMTP_USER || 'support@reachskyline.com'}>`;
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: validEmails.join(', '),
        subject: subject,
        html: bodyHtml
      });
      console.log(`[EmailService] Direct SMTP Email sent successfully to ${validEmails.join(', ')}:`, info.messageId);
      return true;
    } catch (err) {
      console.error('[EmailService] Error sending email via Direct SMTP:', err.message);
      return false;
    }
  }

  // Welcome Email for newly registered Employees or Managers
  async sendWelcomeEmail(email, fullName, role, departmentId, subDepartmentId = null) {
    try {
      let teamName = 'Creatives & Production Team';
      if (subDepartmentId) {
        const [subRows] = await pool.query('SELECT name FROM sub_departments WHERE id = ?', [subDepartmentId]);
        if (subRows.length > 0) {
          teamName = `${subRows[0].name} Team`;
        }
      }
      if (teamName === 'Creatives & Production Team' && departmentId) {
        const [rows] = await pool.query('SELECT name FROM departments WHERE id = ?', [departmentId]);
        if (rows.length > 0) {
          teamName = `${rows[0].name} Team`;
        }
      }

      const frontendUrl = (process.env.FRONTEND_URL || 'https://creatives-erp.reachskyline.com').replace(/\/$/, '');

      const subject = `Welcome to ReachSkyline!`;
      const bodyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns" alt="ReachSkyline Logo" style="width: 90px; height: auto;">
            <h1 style="color: #1e1b4b; margin: 16px 0 0 0; font-size: 24px; font-weight: 800;">Welcome to ReachSkyline!</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">Hello <strong>${fullName}</strong>,</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            We are excited to welcome you to the team! You have been successfully registered on the ReachSkyline ERP as a <strong>${role}</strong> under the <strong>${teamName}</strong>.
          </p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            You can now log in to your dashboard to view your assigned deliverables, collaborate on schedules, and track your daily production progress.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/login" style="display: inline-block; background: linear-gradient(135deg, #DAA71B 0%, #4f46e5 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
              Access Your ERP Dashboard
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          
          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
            ReachSkyline Creatives Agency &bull; ERP Automated System &bull; Please do not reply directly to this mail.
          </p>
        </div>
      `;

      return await this.sendEmail(email, subject, bodyHtml);
    } catch (err) {
      console.error('[EmailService] Error sending welcome email:', err.message);
      return false;
    }
  }
}

module.exports = new EmailService();