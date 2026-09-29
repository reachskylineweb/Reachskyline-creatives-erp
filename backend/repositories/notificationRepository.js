const pool = require('../config/db');

class NotificationRepository {
  async getNotifications(userId, userRole, limit = 50) {
    let query = 'SELECT * FROM notifications ';
    const params = [];
    if (userId) {
      if (userRole === 'admin' || userRole === 'super_admin') {
        query += 'WHERE user_id = ? OR user_id IS NULL ';
        params.push(userId);
      } else {
        query += 'WHERE user_id = ? ';
        params.push(userId);
      }
    }
    query += 'ORDER BY id DESC LIMIT ?';
    params.push(Number(limit));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async markAsRead(id, userId = null) {
    if (userId) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, userId]);
    } else {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    }
  }

  async markAllAsRead(userId = null) {
    if (userId) {
      await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = ? OR user_id IS NULL', [userId]);
    } else {
      await pool.query('UPDATE notifications SET is_read = TRUE');
    }
  }

  async createNotification(message, type, conn, userId = null) {
    const db = conn || pool;
    const [result] = await db.query(
      'INSERT INTO notifications (user_id, message, type, is_read) VALUES (?, ?, ?, FALSE)',
      [userId, message, type]
    );
    return result.insertId;
  }

  // Find deliverables due in the next 3 days that are not completed
  async getUpcomingDeliverableDeadlines() {
    const [rows] = await pool.query(`
      SELECT md.id, md.deliverable, md.due_date, c.company_name, md.assigned_manager_id, md.assigned_employee_id, md.smm_employee_id, md.content_writer_id
      FROM monthly_deliverables md
      JOIN clients c ON md.client_id = c.id
      WHERE md.deleted_at IS NULL 
        AND md.status != 'completed' 
        AND md.due_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)
    `);
    return rows;
  }

  // Find projects that have passed their deadline but are not completed
  async getDelayedProjects() {
    const [rows] = await pool.query(`
      SELECT id, project_name, end_date 
      FROM projects 
      WHERE deleted_at IS NULL 
        AND status != 'completed' 
        AND end_date < CURRENT_DATE
    `);
    return rows;
  }
}

module.exports = new NotificationRepository();
