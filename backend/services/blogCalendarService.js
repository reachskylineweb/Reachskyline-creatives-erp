const pool = require('../config/db');

class BlogCalendarService {
  async getCalendarByMonth(month) {
    const [rows] = await pool.query(
      `SELECT bc.*, c.company_name AS client_name, e.full_name AS employee_name
       FROM blog_calendar bc
       JOIN clients c ON bc.client_id = c.id
       LEFT JOIN employees e ON bc.assigned_employee_id = e.id
       WHERE bc.month = ?
       ORDER BY bc.date ASC, bc.id ASC`,
      [month]
    );
    return rows;
  }

  async bulkCreateCalendarItems(data) {
    const { client_id, month, dates, type = 'blog', titlePrefix } = data;
    if (!client_id || !month || !Array.isArray(dates) || dates.length === 0) {
      const error = new Error('Client ID, month, and at least one selected date are required.');
      error.statusCode = 400;
      throw error;
    }

    const [clientRows] = await pool.query('SELECT company_name FROM clients WHERE id = ?', [client_id]);
    const companyName = clientRows[0] ? clientRows[0].company_name : 'Client';

    const createdIds = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const title = titlePrefix ? `${companyName} - ${titlePrefix} #${i + 1}` : `${companyName} - Blog #${i + 1}`;
      const [result] = await pool.query(
        `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type, featured_image)
         VALUES (?, ?, ?, ?, ?, 'draft', ?, 'YES')`,
        [client_id, date, month, title, `Blog posting scheduled for ${date}`, type]
      );
      createdIds.push(result.insertId);
    }
    return createdIds;
  }

  async assignEmployee(id, assigned_employee_id, featured_image = 'YES') {
    const [existing] = await pool.query('SELECT id FROM blog_calendar WHERE id = ?', [id]);
    if (existing.length === 0) {
      const error = new Error('Blog calendar item not found.');
      error.statusCode = 404;
      throw error;
    }
    const newStatus = assigned_employee_id ? 'assigned' : 'draft';
    try {
      await pool.query(
        `UPDATE blog_calendar 
         SET assigned_employee_id = ?, status = ?, featured_image = ? 
         WHERE id = ?`,
        [assigned_employee_id ? Number(assigned_employee_id) : null, newStatus, featured_image || 'YES', id]
      );
    } catch (err) {
      await pool.query(
        `UPDATE blog_calendar 
         SET assigned_employee_id = ?, status = ? 
         WHERE id = ?`,
        [assigned_employee_id ? Number(assigned_employee_id) : null, newStatus, id]
      );
    }
  }

  async createCalendarItem(data) {
    const { client_id, date, month, title, description, status, type, assigned_employee_id, featured_image, has_featured_image, content_link, google_drive_link } = data;
    const featImg = featured_image || has_featured_image || 'YES';
    const [result] = await pool.query(
      `INSERT INTO blog_calendar (client_id, date, month, title, description, status, type, assigned_employee_id, featured_image, content_link, google_drive_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, date, month, title, description || null, status || 'draft', type || 'blog', assigned_employee_id || null, featImg, content_link || null, google_drive_link || null]
    );
    return result.insertId;
  }

  async updateCalendarItem(id, data) {
    const { 
      date, 
      title, 
      description, 
      type, 
      assigned_employee_id, 
      featured_image, 
      has_featured_image, 
      status, 
      content_link, 
      google_drive_link 
    } = data;

    const featOption = featured_image || has_featured_image || 'YES';
    const updatedStatus = status || (assigned_employee_id ? 'assigned' : 'draft');

    try {
      await pool.query(
        `UPDATE blog_calendar 
         SET date = COALESCE(?, date), 
             title = COALESCE(?, title), 
             description = COALESCE(?, description), 
             status = ?, 
             type = COALESCE(?, type), 
             assigned_employee_id = ?, 
             featured_image = ?,
             content_link = COALESCE(?, content_link), 
             google_drive_link = COALESCE(?, google_drive_link)
         WHERE id = ?`,
        [
          date || null, 
          title || null, 
          description || null, 
          updatedStatus, 
          type || 'blog', 
          assigned_employee_id ? Number(assigned_employee_id) : null, 
          featOption, 
          content_link || null, 
          google_drive_link || null, 
          id
        ]
      );
    } catch (err) {
      // Fallback if featured_image column missing
      await pool.query(
        `UPDATE blog_calendar 
         SET date = COALESCE(?, date), 
             title = COALESCE(?, title), 
             description = COALESCE(?, description), 
             status = ?, 
             type = COALESCE(?, type), 
             assigned_employee_id = ?, 
             content_link = COALESCE(?, content_link), 
             google_drive_link = COALESCE(?, google_drive_link)
         WHERE id = ?`,
        [
          date || null, 
          title || null, 
          description || null, 
          updatedStatus, 
          type || 'blog', 
          assigned_employee_id ? Number(assigned_employee_id) : null, 
          content_link || null, 
          google_drive_link || null, 
          id
        ]
      );
    }
  }

  async deleteCalendarItem(id) {
    const [existing] = await pool.query('SELECT status FROM blog_calendar WHERE id = ?', [id]);
    if (existing.length > 0 && (existing[0].status === 'sent_to_admin' || existing[0].status === 'approved')) {
      const error = new Error('This calendar is locked and cannot be deleted after being sent to Admin.');
      error.statusCode = 403;
      throw error;
    }
    await pool.query('DELETE FROM blog_calendar WHERE id = ?', [id]);
  }

  async deleteCalendarMonth(month) {
    const [existing] = await pool.query('SELECT status FROM blog_calendar WHERE month = ? AND status IN ("sent_to_admin", "approved")', [month]);
    if (existing.length > 0) {
      const error = new Error('This calendar month is locked and cannot be deleted.');
      error.statusCode = 403;
      throw error;
    }
    await pool.query(
      'DELETE FROM blog_calendar WHERE month = ?',
      [month]
    );
  }

  async sendToSeoTeam(month, userId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // 1. Update status of draft entries for this month to 'sent_to_admin'
      const [updateResult] = await connection.query(
        `UPDATE blog_calendar 
         SET status = 'sent_to_admin'
         WHERE month = ? AND status = 'draft'`,
        [month]
      );

      if (updateResult.affectedRows === 0) {
        // Also update any lingering items to sent_to_admin
        await connection.query(
          `UPDATE blog_calendar SET status = 'sent_to_admin' WHERE month = ?`,
          [month]
        );
      }

      // 2. Query active employees in the SEO department
      const [seoEmployees] = await connection.query(
        `SELECT e.id 
         FROM employees e
         JOIN departments d ON e.department_id = d.id
         WHERE (d.code = 'SEO-RS' OR d.name LIKE '%SEO%') AND e.status = 'active'
         ORDER BY e.id ASC`
      );

      // 3. Auto-assign items to SEO employees round-robin
      if (seoEmployees.length > 0) {
        const [items] = await connection.query(
          `SELECT id FROM blog_calendar WHERE month = ? ORDER BY date ASC, id ASC`,
          [month]
        );
        for (let i = 0; i < items.length; i++) {
          const empId = seoEmployees[i % seoEmployees.length].id;
          await connection.query(
            `UPDATE blog_calendar SET assigned_employee_id = ? WHERE id = ?`,
            [empId, items[i].id]
          );
        }
      }

      // 4. Create notification for Admin & SEO team
      const msg = `Blog Posting Calendar for ${month} has been sent to Admin and assigned to SEO Employees.`;
      await connection.query(
        `INSERT INTO notifications (message, type, is_read) VALUES (?, 'deliverables_assigned', FALSE)`,
        [msg]
      );

      // 5. Log Activity
      if (userId) {
        await connection.query(
          `INSERT INTO activity_logs (user_id, action, description) VALUES (?, 'Send Blog Calendar to Admin', ?)`,
          [userId, `Sent blog calendar for ${month} to Admin and auto-assigned to SEO team.`]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new BlogCalendarService();
