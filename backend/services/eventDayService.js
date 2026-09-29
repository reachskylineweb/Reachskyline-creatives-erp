const pool = require('../config/db');
const onesignalService = require('./onesignalService');

// List of preconfigured standard events
const PREDEFINED_EVENTS = {
  '01': [
    { day: 15, title: 'Pongal', description: 'Harvest festival celebrated in Tamil Nadu and South India.', event_type: 'festival_state' },
    { day: 26, title: 'Republic Day', description: 'National festival celebrating the constitution of India.', event_type: 'festival_national' }
  ],
  '02': [
    { day: 14, title: "Valentine's Day", description: 'Celebration of love and affection.', event_type: 'event_day' }
  ],
  '03': [
    { day: 8, title: "International Women's Day", description: 'Honoring womens accomplishments.', event_type: 'international_day' }
  ],
  '04': [
    { day: 22, title: 'Earth Day', description: 'Environmental awareness day.', event_type: 'international_day' }
  ],
  '05': [
    { day: 1, title: 'Labor Day / May Day', description: 'Honoring workers contributions.', event_type: 'national_day' }
  ],
  '06': [
    { day: 5, title: 'World Environment Day', description: 'Global environmental action.', event_type: 'international_day' },
    { day: 21, title: 'International Yoga Day', description: 'Promoting yoga and wellness.', event_type: 'international_day' }
  ],
  '07': [
    { day: 1, title: "National Doctor's Day", description: 'Honoring medical professionals.', event_type: 'national_day' }
  ],
  '08': [
    { day: 15, title: 'Independence Day', description: 'National festival commemorating freedom.', event_type: 'festival_national' }
  ],
  '09': [
    { day: 5, title: "Teacher's Day", description: 'Celebrating educators and teachers.', event_type: 'event_day' },
    { day: 27, title: 'World Tourism Day', description: 'Promoting global travel.', event_type: 'international_day' }
  ],
  '10': [
    { day: 2, title: 'Gandhi Jayanthi', description: 'Tribute to Mahatma Gandhi.', event_type: 'festival_national' },
    { day: 31, title: 'Halloween', description: 'Fright night and costumes.', event_type: 'event_day' }
  ],
  '11': [
    { day: 8, title: 'Diwali', description: 'Festival of lights celebrating the victory of light over darkness.', event_type: 'festival_national' },
    { day: 14, title: "Children's Day", description: 'Celebrating future leaders.', event_type: 'national_day' }
  ],
  '12': [
    { day: 25, title: 'Christmas Day', description: 'Joyous holiday and gifting.', event_type: 'festival_national' }
  ]
};

class EventDayService {
  async getEventsByMonth(month, userRole, userId) {
    // Ensure event_day_months table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_day_months (
        month VARCHAR(7) PRIMARY KEY,
        initialized TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if records are already initialized for this month
    const [initRows] = await pool.query(
      'SELECT 1 FROM event_day_months WHERE month = ?',
      [month]
    );

    // If not initialized, insert predefined events and mark as initialized
    if (initRows.length === 0) {
      let canInit = false;
      if (userRole === 'manager' || userRole === 'admin') {
        canInit = true;
      } else {
        const [emp] = await pool.query('SELECT sub_department_id FROM employees WHERE user_id = ?', [userId]);
        if (emp.length > 0 && emp[0].sub_department_id === 3) {
          canInit = true;
        }
      }

      if (canInit) {
        await pool.query(
          'INSERT IGNORE INTO event_day_months (month) VALUES (?)',
          [month]
        );

      // Verify if there are existing event day records (safety check)
      const [existing] = await pool.query(
        'SELECT id FROM event_days WHERE month = ? LIMIT 1',
        [month]
      );

      if (existing.length === 0) {
        const monthPart = month.split('-')[1]; // e.g. '10'
        const yearPart = month.split('-')[0];  // e.g. '2026'
        const templates = PREDEFINED_EVENTS[monthPart] || [];

        if (templates.length > 0) {
          for (const t of templates) {
            const dateStr = `${yearPart}-${monthPart}-${String(t.day).padStart(2, '0')}`;
            await pool.query(
              `INSERT INTO event_days (month, date, title, description, event_type, status, created_by)
               VALUES (?, ?, ?, ?, ?, 'draft', ?)`,
              [month, dateStr, t.title, t.description, t.event_type || 'event_day', userId]
            );
          }
        }
      }
    }
  }

    // 3. Query with creator_name join
    const [rows] = await pool.query(
      `SELECT e.*, COALESCE(emp.full_name, mgr.full_name) AS creator_name 
       FROM event_days e
       LEFT JOIN employees emp ON e.created_by = emp.user_id
       LEFT JOIN managers mgr ON e.created_by = mgr.user_id
       WHERE e.month = ? 
       ORDER BY e.date ASC, e.id ASC`,
      [month]
    );

    return this.filterByRole(rows, userRole);
  }

  filterByRole(events, role) {
    if (role === 'manager') {
      // Managers see events submitted by employees OR events already approved/sent to employee
      return events.filter(e => e.status === 'sent_to_manager' || e.status === 'sent_to_employee');
    }
    return events; // Admin and Employee can see all
  }

  async assertEventCalendarNotApproved(month, userRole = null) {
    if (!month) return;
    if (userRole === 'admin' || userRole === 'super_admin') {
      return; // Admin & SuperAdmin can always edit and create event items
    }
    const [rows] = await pool.query(
      "SELECT id FROM event_days WHERE month = ? AND status = 'sent_to_employee' LIMIT 1",
      [month]
    );
    if (rows.length > 0) {
      const error = new Error('This Event Calendar has already been approved and finalized. It cannot be edited.');
      error.statusCode = 400;
      throw error;
    }
  }

  async createEvent(eventData, userId, userRole = null) {
    const { month, date, title, description, event_type } = eventData;
    await this.assertEventCalendarNotApproved(month, userRole);
    let initialStatus = 'draft';
    if (userRole === 'admin' || userRole === 'super_admin') {
      const [approved] = await pool.query("SELECT id FROM event_days WHERE month = ? AND status = 'sent_to_employee' LIMIT 1", [month]);
      if (approved.length > 0) {
        initialStatus = 'sent_to_employee';
      }
    }
    const [result] = await pool.query(
      `INSERT INTO event_days (month, date, title, description, event_type, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [month, date, title, description, event_type || 'event_day', initialStatus, userId]
    );
    return result.insertId;
  }

  async updateEvent(id, eventData, userRole = null) {
    const { date, title, description, event_type } = eventData;
    const [evtRows] = await pool.query('SELECT month FROM event_days WHERE id = ?', [id]);
    if (evtRows.length > 0) {
      await this.assertEventCalendarNotApproved(evtRows[0].month, userRole);
    }
    if (userRole === 'admin' || userRole === 'super_admin' || userRole === 'manager') {
      await pool.query(
        `UPDATE event_days SET date = ?, title = ?, description = ?, event_type = ? WHERE id = ?`,
        [date, title, description, event_type || 'event_day', id]
      );
    } else {
      await pool.query(
        `UPDATE event_days SET date = ?, title = ?, description = ?, event_type = ?, status = 'draft' WHERE id = ?`,
        [date, title, description, event_type || 'event_day', id]
      );
    }
  }

  async deleteEvent(id, userRole = null) {
    const [evtRows] = await pool.query('SELECT month FROM event_days WHERE id = ?', [id]);
    if (evtRows.length > 0) {
      await this.assertEventCalendarNotApproved(evtRows[0].month, userRole);
    }
    await pool.query('DELETE FROM event_days WHERE id = ?', [id]);
  }

  async sendToManager(month, userId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // 1. Get calling employee name
      const [empRows] = await connection.query('SELECT full_name FROM employees WHERE user_id = ?', [userId]);
      const employeeName = empRows.length > 0 ? empRows[0].full_name : 'An employee';

      // 2. Update status to sent_to_manager
      const [updateResult] = await connection.query(
        "UPDATE event_days SET status = 'sent_to_manager' WHERE month = ? AND status = 'draft'",
        [month]
      );

      if (updateResult.affectedRows === 0) {
        const error = new Error('Already sent');
        error.statusCode = 400;
        throw error;
      }

      // 3. Find and notify all active managers
      const [managers] = await connection.query("SELECT id FROM managers WHERE status = 'active'");
      for (const mgr of managers) {
        await connection.query(
          `INSERT INTO notifications (message, type, is_read) 
           VALUES (?, 'deliverables_assigned', FALSE)`,
          [`Event Day Calendar for ${month} has been submitted by ${employeeName} for review.`, 'deliverables_assigned']
        );
      }

      await connection.commit();

      // Trigger OneSignal notifications to all active managers in the background
      for (const mgr of managers) {
        onesignalService.sendToManager(
          mgr.id,
          'Event Calendar Submitted',
          `Event Day Calendar for ${month} has been submitted by ${employeeName} for review.`,
          true,
          '/manager/event-calendar'
        );
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  // Fetch configured client deliverables for an Event Day
  async getEventClientDeliverables(eventDayId) {
    const [rows] = await pool.query(
      `SELECT edc.*, c.company_name AS client_name, at.activity_name
       FROM event_day_client_deliverables edc
       JOIN clients c ON edc.client_id = c.id
       JOIN activity_types at ON edc.activity_type_code = at.activity_type_code
       WHERE edc.event_day_id = ?
       ORDER BY c.company_name ASC`,
      [eventDayId]
    );
    return rows;
  }

  // Save configured client deliverables for an Event Day
  async saveEventClientDeliverables(eventDayId, deliverables) {
    const [edCheckRows] = await pool.query('SELECT month FROM event_days WHERE id = ?', [eventDayId]);
    if (edCheckRows.length > 0) {
      await this.assertEventCalendarNotApproved(edCheckRows[0].month);
    }
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.query('DELETE FROM event_day_client_deliverables WHERE event_day_id = ?', [eventDayId]);
      
      if (Array.isArray(deliverables) && deliverables.length > 0) {
        for (const item of deliverables) {
          if (!item.client_id || !item.activity_type_code) continue;
          
          const [atRows] = await connection.query('SELECT activity_name FROM activity_types WHERE activity_type_code = ?', [item.activity_type_code]);
          const actName = atRows.length > 0 ? atRows[0].activity_name : item.activity_type_code;
          const [edRows] = await connection.query('SELECT title FROM event_days WHERE id = ?', [eventDayId]);
          const edTitle = edRows.length > 0 ? edRows[0].title : 'Event Day';

          const title = item.title || `${edTitle} - ${actName}`;
          const description = item.description || `Event Day deliverable (${actName}) for ${edTitle}.`;

          await connection.query(
            `INSERT INTO event_day_client_deliverables (event_day_id, client_id, activity_type_code, title, description)
             VALUES (?, ?, ?, ?, ?)`,
            [eventDayId, item.client_id, item.activity_type_code, title, description]
          );
        }
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async sendToEmployee(month, userId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // 1. Get calling manager name
      const [mgrRows] = await connection.query('SELECT full_name FROM managers WHERE user_id = ?', [userId]);
      const managerName = mgrRows.length > 0 ? mgrRows[0].full_name : 'A manager';

      // 2. Update status to sent_to_employee and reset assignment fields for manager counting
      const [updateResult] = await connection.query(
        "UPDATE event_days SET status = 'sent_to_employee', assigned_employee_id = NULL, submission_status = 'pending' WHERE month = ? AND (status = 'sent_to_manager' OR status = 'draft')",
        [month]
      );

      if (updateResult.affectedRows === 0) {
        const error = new Error('Already sent');
        error.statusCode = 400;
        throw error;
      }

      // 3. Generate content_calendar & monthly_deliverables items for configured Event Day client deliverables
      const [eventDays] = await connection.query('SELECT * FROM event_days WHERE month = ?', [month]);
      const [writers] = await connection.query(
        "SELECT e.id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' ORDER BY e.id"
      );

      // Find department & manager ID for monthly deliverables
      const [depts] = await connection.query('SELECT id FROM departments WHERE code = "CD-RS"');
      const gdDeptId = depts.length > 0 ? depts[0].id : 1;
      const [mgrs] = await connection.query("SELECT id FROM managers WHERE status = 'active' LIMIT 1");
      const gdManagerId = mgrs.length > 0 ? mgrs[0].id : 1;
      const [activeEmps] = await connection.query("SELECT id FROM employees WHERE status = 'active' LIMIT 1");
      const fallbackEmpId = activeEmps.length > 0 ? activeEmps[0].id : 1;

      let writerIdx = 0;
      for (const ed of eventDays) {
        const [clientDelivs] = await connection.query(
          `SELECT edc.*, at.activity_name 
           FROM event_day_client_deliverables edc
           JOIN activity_types at ON edc.activity_type_code = at.activity_type_code
           WHERE edc.event_day_id = ?`,
          [ed.id]
        );

        for (const cd of clientDelivs) {
          const writerId = writers.length > 0 ? writers[writerIdx % writers.length].id : fallbackEmpId;
          writerIdx++;

          const dateStr = typeof ed.date === 'string' ? ed.date.split('T')[0] : ed.date.toISOString().split('T')[0];
          const formattedCode = cd.activity_type_code.toUpperCase();
          const activityCode = `EVT-${ed.id}-C${cd.client_id}-${formattedCode}`;

          // Insert or update in content_calendar
          const [existingCc] = await connection.query(
            'SELECT id FROM content_calendar WHERE event_day_id = ? AND client_id = ? AND activity_type_code = ?',
            [ed.id, cd.client_id, cd.activity_type_code]
          );

          if (existingCc.length === 0) {
            await connection.query(
              `INSERT INTO content_calendar (client_id, activity_type_code, activity_code, date, month, title, description, status, assigned_employee_id, is_event_day, event_day_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'sent_to_employees', ?, 1, ?)`,
              [cd.client_id, cd.activity_type_code, activityCode, dateStr, month, cd.title, cd.description, writerId, ed.id]
            );
          }

          // Insert or update in monthly_deliverables
          const [existingMd] = await connection.query(
            'SELECT id FROM monthly_deliverables WHERE event_day_title = ? AND client_id = ? AND activity_type_code = ?',
            [ed.title, cd.client_id, cd.activity_type_code]
          );

          if (existingMd.length === 0) {
            await connection.query(
              `INSERT INTO monthly_deliverables (client_id, month, department_id, activity_type_code, activity_code, deliverable, quantity, assigned_manager_id, assigned_employee_id, priority, due_date, description, status, remarks, created_by, content_writer_id, is_event_day, event_day_title)
               VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, 'high', ?, ?, 'pending', '', ?, ?, 1, ?)`,
              [cd.client_id, month, gdDeptId, cd.activity_type_code, activityCode, `${formattedCode}: ${cd.title}`, gdManagerId, fallbackEmpId, dateStr, cd.description, userId, writerId, ed.title]
            );
          }
        }
      }

      // 4. Find and notify all active employees
      const [employees] = await connection.query("SELECT id FROM employees WHERE status = 'active'");
      for (const emp of employees) {
        await connection.query(
          `INSERT INTO notifications (message, type, is_read) 
           VALUES (?, 'deliverables_assigned', FALSE)`,
          [`Event Day Calendar for ${month} has been reviewed and sent back by ${managerName}.`, 'deliverables_assigned']
        );
      }

      await connection.commit();

      // Trigger OneSignal notifications to all active employees in the background
      for (const emp of employees) {
        onesignalService.sendToEmployee(
          emp.id,
          'Event Calendar Approved',
          `Event Day Calendar for ${month} has been reviewed and approved by ${managerName}.`,
          true,
          '/employee/event-calendar'
        );
      }
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new EventDayService();
