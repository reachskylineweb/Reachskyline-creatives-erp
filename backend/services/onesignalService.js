const axios = require('axios');
const pool = require('../config/db');
const emailService = require('./emailService');

class OneSignalService {
  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID;
    this.apiKey = process.env.ONESIGNAL_REST_API_KEY;
    this.apiUrl = 'https://onesignal.com/api/v1/notifications';
    this.frontendUrl = (process.env.FRONTEND_URL || 'https://creatives-erp.reachskyline.com').replace(/\/$/, '');
  }

  // Helper for REST API headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${this.apiKey}`
    };
  }

  // Core function to send push notification to user IDs
  async sendPush(userIds, title, message, urlPath = '') {
    if (!userIds || (Array.isArray(userIds) && userIds.length === 0)) return;
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    try {
      // 1. Fetch browser subscription IDs for active target users only
      const [rows] = await pool.query(
        `SELECT p.onesignal_subscription_id 
         FROM user_push_subscriptions p
         JOIN users u ON p.user_id = u.id
         WHERE p.user_id IN (?) AND u.status = 'active' AND u.deleted_at IS NULL`,
        [ids]
      );

      if (rows.length === 0) {
        console.log(`[OneSignal] No active push subscriptions found for users: ${ids.join(', ')}`);
        return;
      }

      const subscriptionIds = rows.map(r => r.onesignal_subscription_id);

      // 2. Prepare payload
      const payload = {
        app_id: this.appId,
        include_subscription_ids: subscriptionIds,
        headings: { en: title },
        contents: { en: message }
      };

      if (urlPath) {
        const fullUrlPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
        payload.url = `${this.frontendUrl}${fullUrlPath}`;
      }

      // 3. Post to OneSignal
      const response = await axios.post(this.apiUrl, payload, { headers: this.getHeaders() });
      console.log('[OneSignal] Push sent successfully:', response.data);
    } catch (err) {
      console.error('[OneSignal] Error sending push notification:', err.response ? err.response.data : err.message);
    }
  }

  // Core function to send email notification to email addresses
  async sendEmail(emails, subject, bodyHtml) {
    if (!emails || (Array.isArray(emails) && emails.length === 0)) return;
    const emailList = Array.isArray(emails) ? emails : [emails];
    const validEmails = emailList.filter(email => email && email.includes('@') && !email.includes('_deleted_'));
    if (validEmails.length === 0) return;

    // Try Direct SMTP first if configured
    const smtpSent = await emailService.sendEmail(validEmails, subject, bodyHtml);
    if (smtpSent) return;

    try {
      const payload = {
        app_id: this.appId,
        email_subject: subject,
        email_body: bodyHtml,
        include_email_tokens: validEmails
      };

      const response = await axios.post(this.apiUrl, payload, { headers: this.getHeaders() });
      console.log('[OneSignal] Email sent successfully:', response.data);
    } catch (err) {
      console.error('[OneSignal] Error sending email notification:', err.response ? err.response.data : err.message);
    }
  }

  // Helper to send both push and email
  async sendNotificationAndEmail(userIds, title, message, urlPath = '', subject = null) {
    if (!userIds || (Array.isArray(userIds) && userIds.length === 0)) return;
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    // Trigger push asynchronously
    this.sendPush(ids, title, message, urlPath);

    // Fetch emails for active user IDs only
    try {
      const [rows] = await pool.query(
        "SELECT email, username FROM users WHERE id IN (?) AND status = 'active' AND deleted_at IS NULL",
        [ids]
      );
      if (rows.length > 0) {
        const emails = rows.map(r => r.email);
        const emailSubject = subject || title;
        const fullUrlPath = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
        const targetUrl = `${this.frontendUrl}${fullUrlPath}`;
        const bodyHtml = `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4f46e5;">ReachSkyline ERP Notification</h2>
            <p>${message}</p>
            ${urlPath ? `<p><a href="${targetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Open ERP Desktop</a></p>` : ''}
            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="font-size: 12px; color: #777;">This is an automated system notification from ReachSkyline. Please do not reply directly to this email.</p>
          </div>
        `;
        await this.sendEmail(emails, emailSubject, bodyHtml);
      }
    } catch (err) {
      console.error('[OneSignal] Error resolving emails for notification:', err.message);
    }
  }

  // Welcome Email for newly registered employees or managers
  async sendWelcomeEmail(email, fullName, role, departmentId, subDepartmentId = null) {
    try {
      // Try Direct SMTP first
      const smtpSent = await emailService.sendWelcomeEmail(email, fullName, role, departmentId, subDepartmentId);
      if (smtpSent) return;
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

      const subject = `Welcome to ReachSkyline!`;
      const bodyHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://res.cloudinary.com/srfbqmic/image/upload/f_auto,q_auto/download_1_1_l9glns" alt="ReachSkyline Logo" style="width: 80px; height: auto;">
            <h1 style="color: #1e1b4b; margin: 12px 0 0 0; font-size: 24px; font-weight: 800;">Welcome to ReachSkyline!</h1>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">Hello <strong>${fullName}</strong>,</p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            We are excited to welcome you to the team! You have been successfully registered on the ReachSkyline ERP as a <strong>${role}</strong> under the <strong>${teamName}</strong>.
          </p>
          
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            You can now log in to your dashboard to view your assigned deliverables, collaborate on schedules, and track your daily production progress.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.frontendUrl}/login" style="display: inline-block; background: linear-gradient(135deg, #DAA71B 0%, #4f46e5 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 700; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);">
              Access Your ERP Dashboard
            </a>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          
          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
            ReachSkyline Creatives Agency &bull; ERP Automated System &bull; Please do not reply directly to this mail.
          </p>
        </div>
      `;

      await this.sendEmail(email, subject, bodyHtml);
    } catch (err) {
      console.error('[OneSignal] Error sending welcome email:', err.message);
    }
  }

  // --- MAPPING HELPERS FOR WORKFLOW TRIGGERS ---

  // Notify Employee (mapped by employeeId)
  async sendToEmployee(employeeId, title, message, sendEmail = false, urlPath = '') {
    try {
      const [rows] = await pool.query(
        `SELECT e.user_id 
         FROM employees e
         JOIN users u ON e.user_id = u.id
         WHERE e.id = ? AND e.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [employeeId]
      );
      if (rows.length > 0) {
        const userId = rows[0].user_id;
        if (sendEmail) {
          await this.sendNotificationAndEmail(userId, title, message, urlPath);
        } else {
          await this.sendPush(userId, title, message, urlPath);
        }
      }
    } catch (err) {
      console.error('[OneSignal] Error mapping employee to user:', err.message);
    }
  }

  // Notify Manager (mapped by managerId)
  async sendToManager(managerId, title, message, sendEmail = false, urlPath = '') {
    try {
      const [rows] = await pool.query(
        `SELECT m.user_id 
         FROM managers m
         JOIN users u ON m.user_id = u.id
         WHERE m.id = ? AND m.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [managerId]
      );
      if (rows.length > 0) {
        const userId = rows[0].user_id;
        if (sendEmail) {
          await this.sendNotificationAndEmail(userId, title, message, urlPath);
        } else {
          await this.sendPush(userId, title, message, urlPath);
        }
      }
    } catch (err) {
      console.error('[OneSignal] Error mapping manager to user:', err.message);
    }
  }

  // Notify Client (mapped by clientId)
  async sendToClient(clientId, title, message, sendEmail = false, urlPath = '') {
    try {
      const [rows] = await pool.query(
        `SELECT c.user_id 
         FROM clients c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ? AND c.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [clientId]
      );
      if (rows.length > 0 && rows[0].user_id) {
        const userId = rows[0].user_id;
        if (sendEmail) {
          await this.sendNotificationAndEmail(userId, title, message, urlPath);
        } else {
          await this.sendPush(userId, title, message, urlPath);
        }
      }
    } catch (err) {
      console.error('[OneSignal] Error mapping client to user:', err.message);
    }
  }
}

module.exports = new OneSignalService();