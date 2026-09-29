const notificationRepository = require('../repositories/notificationRepository');
const pool = require('../config/db');
const onesignalService = require('./onesignalService');

class NotificationService {
  constructor() {
    this.lastScanTimestamp = 0;
    this.scanIntervalMs = 10 * 60 * 1000; // Throttle automated scans to at most once per 10 minutes
  }

  async listNotifications(userId, userRole, limit = 50) {
    const now = Date.now();
    if (now - this.lastScanTimestamp > this.scanIntervalMs) {
      this.lastScanTimestamp = now;
      // Fire scan in background asynchronously to keep API response instant (sub-10ms)
      this.scanAndGenerateAlerts().catch(err => {
        console.error('[NotificationService] Background scan error:', err.message);
      });
    }
    return await notificationRepository.getNotifications(userId, userRole, limit);
  }

  async markNotificationRead(id, userId = null) {
    await notificationRepository.markAsRead(id, userId);
  }

  async markAllNotificationsRead(userId = null) {
    await notificationRepository.markAllAsRead(userId);
  }

  // --- TARGETED NOTIFICATION HELPERS ---

  async notifyUser(userId, title, message, type = 'deliverables_assigned', urlPath = '', sendEmail = false) {
    if (!userId) return;
    try {
      // Verify recipient account is active and non-deleted
      const [uRows] = await pool.query("SELECT status, deleted_at FROM users WHERE id = ?", [userId]);
      if (uRows.length === 0 || uRows[0].status !== 'active' || uRows[0].deleted_at !== null) {
        console.log(`[NotificationService] Notification skipped: User #${userId} is deleted or inactive.`);
        return;
      }

      await notificationRepository.createNotification(message, type, null, userId);
      if (sendEmail) {
        await onesignalService.sendNotificationAndEmail(userId, title, message, urlPath);
      } else {
        await onesignalService.sendPush(userId, title, message, urlPath);
      }
    } catch (err) {
      console.error('[NotificationService] Error notifying user:', err.message);
    }
  }

  async notifyEmployee(employeeId, title, message, type = 'deliverables_assigned', urlPath = '', sendEmail = false) {
    if (!employeeId) return;
    try {
      const [rows] = await pool.query(
        `SELECT e.user_id 
         FROM employees e 
         JOIN users u ON e.user_id = u.id 
         WHERE e.id = ? AND e.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [employeeId]
      );
      if (rows.length > 0 && rows[0].user_id) {
        await this.notifyUser(rows[0].user_id, title, message, type, urlPath, sendEmail);
      }
    } catch (err) {
      console.error('[NotificationService] Error mapping employee to user for notification:', err.message);
    }
  }

  async notifyManager(managerId, title, message, type = 'deliverables_assigned', urlPath = '', sendEmail = false) {
    if (!managerId) return;
    try {
      const [rows] = await pool.query(
        `SELECT m.user_id 
         FROM managers m 
         JOIN users u ON m.user_id = u.id 
         WHERE m.id = ? AND m.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [managerId]
      );
      if (rows.length > 0 && rows[0].user_id) {
        await this.notifyUser(rows[0].user_id, title, message, type, urlPath, sendEmail);
      }
    } catch (err) {
      console.error('[NotificationService] Error mapping manager to user for notification:', err.message);
    }
  }

  async notifyClient(clientId, title, message, type = 'client_approval_pending', urlPath = '', sendEmail = false) {
    if (!clientId) return;
    try {
      const [rows] = await pool.query(
        `SELECT c.user_id 
         FROM clients c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ? AND c.status = 'active' AND u.status = 'active' AND u.deleted_at IS NULL`,
        [clientId]
      );
      if (rows.length > 0 && rows[0].user_id) {
        await this.notifyUser(rows[0].user_id, title, message, type, urlPath, sendEmail);
      }
    } catch (err) {
      console.error('[NotificationService] Error mapping client to user for notification:', err.message);
    }
  }

  async notifyAdmins(title, message, type = 'deliverables_assigned', urlPath = '', sendEmail = false) {
    try {
      const [admins] = await pool.query("SELECT id FROM users WHERE role IN ('admin', 'super_admin') AND status = 'active' AND deleted_at IS NULL");
      const adminIds = admins.map(a => a.id);
      for (const adminId of adminIds) {
        await notificationRepository.createNotification(message, type, null, adminId);
      }
      if (adminIds.length > 0) {
        if (sendEmail) {
          await onesignalService.sendNotificationAndEmail(adminIds, title, message, urlPath);
        } else {
          await onesignalService.sendPush(adminIds, title, message, urlPath);
        }
      }
    } catch (err) {
      console.error('[NotificationService] Error notifying admins:', err.message);
    }
  }

  async subscribePush(userId, subscriptionId) {
    await pool.query(
      `INSERT INTO user_push_subscriptions (user_id, onesignal_subscription_id) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
      [userId, subscriptionId]
    );
  }

  async unsubscribePush(userId, subscriptionId) {
    await pool.query(
      `DELETE FROM user_push_subscriptions WHERE user_id = ? AND onesignal_subscription_id = ?`,
      [userId, subscriptionId]
    );
  }

  // Automated background scanning triggered during client retrieval/actions
  async scanAndGenerateAlerts() {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Scan upcoming deliverables (due in next 3 days)
      const upcomingDelivs = await notificationRepository.getUpcomingDeliverableDeadlines();
      for (const deliv of upcomingDelivs) {
        const msg = `Deadline Reminder: Deliverable "${deliv.deliverable}" for client "${deliv.company_name}" is due on ${deliv.due_date}.`;
        
        // Prevent duplicate notifications in same day by checking if it already exists
        const [existing] = await connection.query(
          'SELECT id FROM notifications WHERE message = ? AND DATE(created_at) = CURRENT_DATE',
          [msg]
        );
        if (existing.length === 0) {
          await notificationRepository.createNotification(msg, 'deadline_reminder', connection);

          // OneSignal alerts
          try {
            const empId = deliv.assigned_employee_id || deliv.smm_employee_id || deliv.content_writer_id;
            if (empId) {
              onesignalService.sendToEmployee(empId, 'Upcoming Deadline', msg, true, '/employee/assigned-work');
            }
            if (deliv.assigned_manager_id) {
              onesignalService.sendToManager(deliv.assigned_manager_id, 'Upcoming Deadline Alert', msg, true, '/manager/assigned-work');
            }
            const [admins] = await connection.query("SELECT id FROM users WHERE role IN ('admin', 'super_admin') AND deleted_at IS NULL");
            const adminIds = admins.map(a => a.id);
            onesignalService.sendNotificationAndEmail(adminIds, 'Upcoming Deadline Alert', msg, '/admin/deliverables');
          } catch (e) {
            console.error('[OneSignal] Error sending automated deadline alert:', e.message);
          }
        }
      }

      // 2. Scan delayed projects (end_date passed and status not completed)
      const delayedProjects = await notificationRepository.getDelayedProjects();
      for (const proj of delayedProjects) {
        const msg = `Project Delayed: "${proj.project_name}" is overdue. Deadline was ${proj.end_date}.`;
        
        const [existing] = await connection.query(
          'SELECT id FROM notifications WHERE message = ? AND DATE(created_at) = CURRENT_DATE',
          [msg]
        );
        if (existing.length === 0) {
          await notificationRepository.createNotification(msg, 'project_delayed', connection);

          // OneSignal alerts
          try {
            const [admins] = await connection.query("SELECT id FROM users WHERE role IN ('admin', 'super_admin') AND deleted_at IS NULL");
            const adminIds = admins.map(a => a.id);
            onesignalService.sendNotificationAndEmail(adminIds, 'Project Overdue Alert', msg, '/admin/projects');

            const [managers] = await connection.query("SELECT id FROM managers WHERE status = 'active'");
            for (const mgr of managers) {
              onesignalService.sendToManager(mgr.id, 'Project Overdue Alert', msg, true, '/manager/projects');
            }
          } catch (e) {
            console.error('[OneSignal] Error sending automated project delay alert:', e.message);
          }
        }
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error('Error during automated notifications scan:', err.message);
    } finally {
      connection.release();
    }
  }
}

module.exports = new NotificationService();
