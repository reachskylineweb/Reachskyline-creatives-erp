const pool = require('../config/db');
const notificationService = require('./notificationService');

class ContentWorkService {
  async getEmployeeIdByUserId(userId) {
    const [rows] = await pool.query('SELECT id FROM employees WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      throw new Error('Employee profile not found.');
    }
    return rows[0].id;
  }

  async getManagerIdByUserId(userId) {
    const [rows] = await pool.query('SELECT id FROM managers WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      throw new Error('Manager profile not found.');
    }
    return rows[0].id;
  }

  // --- Content Calendar Submissions ---

  async getAssignedContentCalendar(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    
    // Self-healing: assign unassigned released items to writers using round-robin if any exist
    const [unassigned] = await pool.query(
      "SELECT COUNT(*) AS count FROM content_calendar WHERE month = ? AND status = 'sent_to_employees' AND assigned_employee_id IS NULL",
      [month]
    );
    if (unassigned[0].count > 0) {
      const [writers] = await pool.query(
        "SELECT e.id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' ORDER BY e.id"
      );
      if (writers.length > 0) {
        const [items] = await pool.query(
          "SELECT id FROM content_calendar WHERE month = ? AND status = 'sent_to_employees' AND assigned_employee_id IS NULL ORDER BY date, id",
          [month]
        );
        for (let i = 0; i < items.length; i++) {
          const writerId = writers[i % writers.length].id;
          await pool.query(
            "UPDATE content_calendar SET assigned_employee_id = ?, submission_status = 'pending' WHERE id = ?",
            [writerId, items[i].id]
          );
        }
      }
    }

    const [rows] = await pool.query(`
      SELECT c.*, cl.company_name AS client_name, a.time_content, a.activity_name
      FROM content_calendar c
      JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN activity_types a ON c.activity_type_code = a.activity_type_code
      WHERE c.assigned_employee_id = ? AND c.month = ?
      ORDER BY c.date ASC
    `, [employeeId, month]);
    return rows;
  }

  async saveContentCalendarLink(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE content_calendar 
      SET work_link = ? 
      WHERE id = ? AND assigned_employee_id = ?
    `, [link, itemId, employeeId]);
  }

  async startContentCalendar(itemId, userId) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE content_calendar 
      SET started_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND assigned_employee_id = ?
    `, [itemId, employeeId]);
  }

  async submitContentCalendar(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [rows] = await pool.query(
      'SELECT c.started_at, c.completed_time_spent, a.time_content FROM content_calendar c LEFT JOIN activity_types a ON c.activity_type_code = a.activity_type_code WHERE c.id = ? AND c.assigned_employee_id = ?',
      [itemId, employeeId]
    );
    if (rows.length === 0) throw new Error('Task not found.');
    const item = rows[0];
    
    let elapsed = (item.time_content || 15) * 60;
    if (item.started_at) {
      const startMs = new Date(item.started_at).getTime();
      const nowMs = Date.now();
      elapsed = Math.max(1, Math.round((nowMs - startMs) / 1000));
    }
    const newTotal = (item.completed_time_spent || 0) + elapsed;

    await pool.query(`
      UPDATE content_calendar 
      SET work_link = COALESCE(?, work_link), submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP, started_at = NULL, completed_time_spent = ?
      WHERE id = ? AND assigned_employee_id = ?
    `, [link || null, newTotal, itemId, employeeId]);
  }

  async submitAllContentCalendar(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [startedItems] = await pool.query(
      "SELECT id, started_at, completed_time_spent FROM content_calendar WHERE assigned_employee_id = ? AND month = ? AND work_link IS NOT NULL AND work_link != '' AND submission_status = 'pending'",
      [employeeId, month]
    );

    for (const item of startedItems) {
      let elapsed = 0;
      if (item.started_at) {
        const startMs = new Date(item.started_at).getTime();
        const nowMs = Date.now();
        elapsed = Math.max(0, Math.round((nowMs - startMs) / 1000));
        if (elapsed > 14400) elapsed = 14400;
      }
      const newTotal = (item.completed_time_spent || 0) + elapsed;
      await pool.query(
        "UPDATE content_calendar SET submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP, started_at = NULL, completed_time_spent = ? WHERE id = ?",
        [newTotal, item.id]
      );
    }

    await pool.query(`
      UPDATE content_calendar
      SET submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP, started_at = NULL
      WHERE assigned_employee_id = ? AND month = ? 
        AND work_link IS NOT NULL AND work_link != '' 
        AND submission_status = 'pending'
    `, [employeeId, month]);
  }

  // --- Event Day Calendar Submissions ---

  async getAssignedEventDays(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);

    // Self-healing: assign unassigned released event days to writers using round-robin if any exist
    const [unassigned] = await pool.query(
      "SELECT COUNT(*) AS count FROM event_days WHERE month = ? AND status = 'sent_to_employee' AND assigned_employee_id IS NULL",
      [month]
    );
    if (unassigned[0].count > 0) {
      const [writers] = await pool.query(
        "SELECT e.id FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' ORDER BY e.id"
      );
      if (writers.length > 0) {
        const [items] = await pool.query(
          "SELECT id FROM event_days WHERE month = ? AND status = 'sent_to_employee' AND assigned_employee_id IS NULL ORDER BY date, id",
          [month]
        );
        for (let i = 0; i < items.length; i++) {
          const writerId = writers[i % writers.length].id;
          await pool.query(
            "UPDATE event_days SET assigned_employee_id = ?, submission_status = 'pending' WHERE id = ?",
            [writerId, items[i].id]
          );
        }
      }
    }

    const [rows] = await pool.query(`
      SELECT e.*
      FROM event_days e
      WHERE e.assigned_employee_id = ? AND e.month = ?
      ORDER BY e.date ASC
    `, [employeeId, month]);
    return rows;
  }

  async saveEventDayLink(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE event_days 
      SET work_link = ? 
      WHERE id = ? AND assigned_employee_id = ?
    `, [link, itemId, employeeId]);
  }

  async startEventDay(itemId, userId) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE event_days 
      SET started_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND assigned_employee_id = ?
    `, [itemId, employeeId]);
  }

  async submitEventDay(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [rows] = await pool.query(
      'SELECT started_at, completed_time_spent FROM event_days WHERE id = ? AND assigned_employee_id = ?',
      [itemId, employeeId]
    );
    if (rows.length === 0) throw new Error('Task not found.');
    const item = rows[0];

    let elapsed = 0;
    if (item.started_at) {
      const startMs = new Date(item.started_at).getTime();
      const nowMs = Date.now();
      elapsed = Math.max(0, Math.round((nowMs - startMs) / 1000));
      if (elapsed > 14400) elapsed = 14400;
    }
    const newTotal = (item.completed_time_spent || 0) + elapsed;

    await pool.query(`
      UPDATE event_days 
      SET work_link = COALESCE(?, work_link), submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP, started_at = NULL, completed_time_spent = ?
      WHERE id = ? AND assigned_employee_id = ?
    `, [link || null, newTotal, itemId, employeeId]);
  }

  async submitAllEventDays(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE event_days
      SET submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP
      WHERE assigned_employee_id = ? AND month = ? 
        AND work_link IS NOT NULL AND work_link != '' 
        AND submission_status = 'pending'
    `, [employeeId, month]);
  }

  // --- Shoot Scripts ---

  async getAssignedShootScripts(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [rows] = await pool.query(`
      SELECT s.*, cl.company_name AS client_name
      FROM shoot_scripts s
      JOIN clients cl ON s.client_id = cl.id
      WHERE s.assigned_employee_id = ? AND s.month = ?
      ORDER BY s.created_at ASC
    `, [employeeId, month]);
    return rows;
  }

  async saveShootScriptLink(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE shoot_scripts 
      SET work_link = ? 
      WHERE id = ? AND assigned_employee_id = ?
    `, [link, itemId, employeeId]);
  }

  async startShootScript(itemId, userId) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE shoot_scripts 
      SET started_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND assigned_employee_id = ?
    `, [itemId, employeeId]);
  }

  async submitShootScript(itemId, userId, link) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [rows] = await pool.query(
      'SELECT started_at, completed_time_spent FROM shoot_scripts WHERE id = ? AND assigned_employee_id = ?',
      [itemId, employeeId]
    );
    if (rows.length === 0) throw new Error('Task not found.');
    const item = rows[0];

    let elapsed = 0;
    if (item.started_at) {
      elapsed = Math.round((new Date() - new Date(item.started_at)) / 1000);
    }
    const newTotal = (item.completed_time_spent || 0) + elapsed;

    await pool.query(`
      UPDATE shoot_scripts 
      SET work_link = COALESCE(?, work_link), submission_status = 'submitted', submitted_at = CURRENT_TIMESTAMP, started_at = NULL, completed_time_spent = ?
      WHERE id = ? AND assigned_employee_id = ?
    `, [link || null, newTotal, itemId, employeeId]);
  }

  async submitAllShootScripts(userId, month) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    await pool.query(`
      UPDATE shoot_scripts
      SET submission_status = 'submitted'
      WHERE assigned_employee_id = ? AND month = ? 
        AND work_link IS NOT NULL AND work_link != '' 
        AND submission_status = 'pending'
    `, [employeeId, month]);
  }

  // --- Shoot Scripts Manager CRUD ---

  async getShootScriptsManaged(managerUserId, month) {
    const managerId = await this.getManagerIdByUserId(managerUserId);
    const [rows] = await pool.query(`
      SELECT s.*, cl.company_name AS client_name, emp.full_name AS employee_name
      FROM shoot_scripts s
      JOIN clients cl ON s.client_id = cl.id
      JOIN employees emp ON s.assigned_employee_id = emp.id
      WHERE s.created_by = ? AND s.month = ?
      ORDER BY s.created_at DESC
    `, [managerId, month]);
    return rows;
  }

  async createShootScript(data, managerUserId) {
    const managerId = await this.getManagerIdByUserId(managerUserId);
    const { client_id, assigned_employee_id, month, title, description } = data;
    const [result] = await pool.query(`
      INSERT INTO shoot_scripts (client_id, assigned_employee_id, month, title, description, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [client_id, assigned_employee_id, month, title, description, managerId]);
    
    // Notify employee with targeted push & in-app notification
    await notificationService.notifyEmployee(
      assigned_employee_id,
      'New Shoot Script Assigned',
      `New Shoot Script "${title}" has been assigned to you by manager.`,
      'deliverables_assigned',
      '/employee/content-work',
      true
    );

    return result.insertId;
  }

  async deleteShootScript(id, managerUserId) {
    const managerId = await this.getManagerIdByUserId(managerUserId);
    await pool.query('DELETE FROM shoot_scripts WHERE id = ? AND created_by = ?', [id, managerId]);
  }

  // --- Manager Review API ---

  async getManagerSubmissions() {
    const [contentCal] = await pool.query(`
      SELECT c.*, cl.company_name AS client_name, a.time_content, a.activity_name, emp.full_name AS employee_name, 'content_calendar' AS category
      FROM content_calendar c
      JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN activity_types a ON c.activity_type_code = a.activity_type_code
      JOIN employees emp ON c.assigned_employee_id = emp.id
      ORDER BY c.submitted_at DESC
    `);

    const [eventDays] = await pool.query(`
      SELECT e.*, emp.full_name AS employee_name, 'event_days' AS category
      FROM event_days e
      JOIN employees emp ON e.assigned_employee_id = emp.id
      ORDER BY e.submitted_at DESC
    `);

    const [shootScripts] = await pool.query(`
      SELECT s.*, cl.company_name AS client_name, emp.full_name AS employee_name, 'shoot_scripts' AS category
      FROM shoot_scripts s
      JOIN clients cl ON s.client_id = cl.id
      JOIN employees emp ON s.assigned_employee_id = emp.id
      ORDER BY s.updated_at DESC
    `);

    return [...contentCal, ...eventDays, ...shootScripts];
  }

  async reviewItem(itemType, itemId, action, feedback, voiceNote, managerUserId) {
    const managerId = await this.getManagerIdByUserId(managerUserId);
    
    let table = '';
    if (itemType === 'content_calendar') table = 'content_calendar';
    else if (itemType === 'event_days') table = 'event_days';
    else if (itemType === 'shoot_scripts') table = 'shoot_scripts';
    else throw new Error('Invalid item type.');

    const status = action === 'approve' ? 'approved' : 'pending';
    const remarks = feedback || null;

    // Get item detail for notifications
    const [items] = await pool.query(`SELECT title, assigned_employee_id FROM ${table} WHERE id = ?`, [itemId]);
    if (items.length === 0) throw new Error('Item not found.');
    const item = items[0];

    await pool.query(`
      UPDATE ${table} 
      SET submission_status = ?, remarks = ?, voice_note = ?, rework_count = CASE WHEN ? = 'pending' THEN rework_count + 1 ELSE rework_count END
      WHERE id = ?
    `, [status, remarks, action === 'approve' ? null : (voiceNote || null), status, itemId]);

    // Automatically update the designer's matching monthly deliverable task description and content_link
    if (action === 'approve' && (itemType === 'content_calendar' || itemType === 'event_days' || itemType === 'shoot_scripts')) {
      const [details] = await pool.query(
        `SELECT client_id, activity_code, work_link FROM ${table} WHERE id = ?`,
        [itemId]
      );
      if (details.length > 0) {
        const calendarItem = details[0];
        if (calendarItem.activity_code && calendarItem.work_link) {
          const queryParams = [calendarItem.activity_code];
          let queryStr = "SELECT id, description FROM monthly_deliverables WHERE activity_code = ? AND deleted_at IS NULL";
          if (calendarItem.client_id) {
            queryStr += " AND client_id = ?";
            queryParams.push(calendarItem.client_id);
          }
          const deliverableRepository = require('../repositories/deliverableRepository');
          const [delivs] = await pool.query(queryStr, queryParams);
          for (const deliv of delivs) {
            await pool.query(
              "UPDATE monthly_deliverables SET content_link = ?, status = 'pending', content_writer_id = COALESCE(?, content_writer_id) WHERE id = ?",
              [calendarItem.work_link, item.assigned_employee_id || null, deliv.id]
            );

            // Fetch the writer's user_id to correctly attribute submission
            let writerUserId = null;
            if (item.assigned_employee_id) {
              const [wUser] = await pool.query("SELECT user_id FROM employees WHERE id = ?", [item.assigned_employee_id]);
              if (wUser.length > 0) writerUserId = wUser[0].user_id;
            }

            // Log writer script submission to history
            await deliverableRepository.logJobWorkHistory({
              jobWorkId: deliv.id,
              stage: 'writer_submit_script',
              action: 'Submitted Script Doc',
              description: `Content script doc uploaded. Link: ${calendarItem.work_link}`,
              userId: writerUserId,
              isJobWork: 0
            });

            // Log manager script approval to history
            await deliverableRepository.logJobWorkHistory({
              jobWorkId: deliv.id,
              stage: 'manager_approve_script',
              action: 'Approved Content Script',
              description: 'Content script approved by Creative Manager. Ready for design assignment.',
              userId: managerUserId,
              isJobWork: 0
            });
          }
        }
      }
    } else if (action === 'reassign' && (itemType === 'content_calendar' || itemType === 'event_days' || itemType === 'shoot_scripts')) {
      const [details] = await pool.query(
        `SELECT client_id, activity_code FROM ${table} WHERE id = ?`,
        [itemId]
      );
      if (details.length > 0) {
        const calendarItem = details[0];
        if (calendarItem.activity_code) {
          const queryParams = [calendarItem.activity_code];
          let queryStr = "SELECT id FROM monthly_deliverables WHERE activity_code = ? AND deleted_at IS NULL";
          if (calendarItem.client_id) {
            queryStr += " AND client_id = ?";
            queryParams.push(calendarItem.client_id);
          }
          const deliverableRepository = require('../repositories/deliverableRepository');
          const [delivs] = await pool.query(queryStr, queryParams);
          for (const deliv of delivs) {
            // Set content_link to NULL and status to 'pending', increment rework_count
            await pool.query(
              "UPDATE monthly_deliverables SET content_link = NULL, status = 'pending', rework_count = rework_count + 1 WHERE id = ?",
              [deliv.id]
            );

            // Log script rework requested to history
            await deliverableRepository.logJobWorkHistory({
              jobWorkId: deliv.id,
              stage: 'manager_rework_script',
              action: 'Manager Requested Script Rework',
              description: `Script rejected by Creative Manager. Reason: ${remarks || 'Revision requested.'}`,
              userId: managerUserId,
              isJobWork: 0
            });
          }
        }
      }
    }

    // Notify employee of review results with targeted notification
    if (item.assigned_employee_id) {
      if (action === 'approve') {
        await notificationService.notifyEmployee(
          item.assigned_employee_id,
          'Content Work Approved',
          `Your content submission for "${item.title || 'Task'}" has been APPROVED by the manager.`,
          'work_approved',
          '/employee/approved-work',
          true
        );
      } else {
        await notificationService.notifyEmployee(
          item.assigned_employee_id,
          'Rework Requested',
          `Your content submission for "${item.title || 'Task'}" has been REASSIGNED with feedback: "${remarks || 'Please check notes.'}"`,
          'rework_requested',
          '/employee/rework',
          true
        );
      }
    }
  }

  async getReassignedContentWork(userId) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [contentCal] = await pool.query(`
      SELECT c.id, c.title, c.remarks, c.voice_note, c.work_link, c.month, c.date, cl.company_name AS client_name, 'content_calendar' AS category,
             CASE WHEN c.submission_status = 'pending' THEN 'reassigned' ELSE c.submission_status END AS status
      FROM content_calendar c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.assigned_employee_id = ? AND (c.submission_status = 'pending' OR c.submission_status = 'submitted') AND c.remarks IS NOT NULL
    `, [employeeId]);

    const [eventDays] = await pool.query(`
      SELECT e.id, e.title, e.remarks, e.voice_note, e.work_link, e.month, e.date, 'Event Day' AS client_name, 'event_days' AS category,
             CASE WHEN e.submission_status = 'pending' THEN 'reassigned' ELSE e.submission_status END AS status
      FROM event_days e
      WHERE e.assigned_employee_id = ? AND (e.submission_status = 'pending' OR e.submission_status = 'submitted') AND e.remarks IS NOT NULL
    `, [employeeId]);

    const [shootScripts] = await pool.query(`
      SELECT s.id, s.title, s.remarks, s.voice_note, s.work_link, s.month, NULL AS date, cl.company_name AS client_name, 'shoot_scripts' AS category,
             CASE WHEN s.submission_status = 'pending' THEN 'reassigned' ELSE s.submission_status END AS status
      FROM shoot_scripts s
      JOIN clients cl ON s.client_id = cl.id
      WHERE s.assigned_employee_id = ? AND (s.submission_status = 'pending' OR s.submission_status = 'submitted') AND s.remarks IS NOT NULL
    `, [employeeId]);

    return [...contentCal, ...eventDays, ...shootScripts];
  }

  async getApprovedContentWork(userId) {
    const employeeId = await this.getEmployeeIdByUserId(userId);
    const [contentCal] = await pool.query(`
      SELECT c.id, c.title, c.work_link, c.month, c.date, cl.company_name AS client_name, 'content_calendar' AS category
      FROM content_calendar c
      JOIN clients cl ON c.client_id = cl.id
      WHERE c.assigned_employee_id = ? AND c.submission_status = 'approved'
    `, [employeeId]);

    const [eventDays] = await pool.query(`
      SELECT e.id, e.title, e.work_link, e.month, e.date, 'Event Day' AS client_name, 'event_days' AS category
      FROM event_days e
      WHERE e.assigned_employee_id = ? AND e.submission_status = 'approved'
    `, [employeeId]);

    const [shootScripts] = await pool.query(`
      SELECT s.id, s.title, s.work_link, s.month, NULL AS date, cl.company_name AS client_name, 'shoot_scripts' AS category
      FROM shoot_scripts s
      JOIN clients cl ON s.client_id = cl.id
      WHERE s.assigned_employee_id = ? AND s.submission_status = 'approved'
    `, [employeeId]);

    return [...contentCal, ...eventDays, ...shootScripts];
  }

  async getUnassignedCalendarItems(month) {
    const [writers] = await pool.query(
      "SELECT e.id, e.full_name FROM employees e JOIN sub_departments sd ON e.sub_department_id = sd.id WHERE sd.code = 'CW-RS' AND e.status = 'active' ORDER BY e.full_name"
    );

    const [contentCal] = await pool.query(`
      SELECT c.*, cl.company_name AS client_name, a.activity_name, e.full_name AS content_writer_name
      FROM content_calendar c
      JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN activity_types a ON c.activity_type_code = a.activity_type_code
      LEFT JOIN employees e ON c.assigned_employee_id = e.id
      WHERE c.month = ? AND c.status IN ('approved', 'sent_to_employees')
      ORDER BY c.date ASC, c.id ASC
    `, [month]);

    const [eventDays] = await pool.query(`
      SELECT e.*, emp.full_name AS content_writer_name
      FROM event_days e
      LEFT JOIN employees emp ON e.assigned_employee_id = emp.id
      WHERE e.month = ? AND e.status = 'sent_to_employee'
      ORDER BY e.date ASC, e.id ASC
    `, [month]);

    const contentTotal = contentCal.length;
    const contentUnassigned = contentCal.filter(item => !item.assigned_employee_id).length;
    const eventTotal = eventDays.length;
    const eventUnassigned = eventDays.filter(item => !item.assigned_employee_id).length;

    return {
      writers,
      contentCal,
      eventDays,
      counts: {
        contentTotal,
        contentUnassigned,
        eventTotal,
        eventUnassigned
      }
    };
  }

  async assignWriters({ month, assignments, deliverableId, writerId, isEventDay }) {
    const table = isEventDay ? 'event_days' : 'content_calendar';
    const statusVal = isEventDay ? 'sent_to_employee' : 'sent_to_employees';

    if (deliverableId) {
      // Individual assignment
      const [checkRows] = await pool.query(`
        SELECT t.assigned_employee_id, e.full_name 
        FROM ${table} t
        LEFT JOIN employees e ON t.assigned_employee_id = e.id
        WHERE t.id = ?
      `, [deliverableId]);

      if (checkRows.length === 0) {
        const error = new Error('Item not found.');
        error.statusCode = 404;
        throw error;
      }

      if (checkRows[0].assigned_employee_id && Number(checkRows[0].assigned_employee_id) !== Number(writerId)) {
        const [startedRows] = await pool.query(`
          SELECT started_at, work_link, submission_status FROM ${table} WHERE id = ?
        `, [deliverableId]);
        if (startedRows.length > 0) {
          const s = startedRows[0];
          if (s.started_at !== null || s.work_link !== null || s.submission_status !== 'pending') {
            const error = new Error(`Work has already started. You cannot reassign this task to another content writer.`);
            error.statusCode = 400;
            throw error;
          }
        }
      }

      await pool.query(`
        UPDATE ${table} SET assigned_employee_id = ?, submission_status = 'pending' WHERE id = ?
      `, [writerId, deliverableId]);

      // If normal deliverable, sync to monthly_deliverables
      if (!isEventDay) {
        const [itemDetails] = await pool.query("SELECT client_id, activity_code FROM content_calendar WHERE id = ?", [deliverableId]);
        if (itemDetails.length > 0) {
          const { client_id, activity_code } = itemDetails[0];
          if (activity_code) {
            await pool.query(`
              UPDATE monthly_deliverables 
              SET content_writer_id = ? 
              WHERE client_id = ? AND activity_code = ? AND month = ? AND deleted_at IS NULL
            `, [writerId, client_id, activity_code, month]);
          }
        }
      }
    } else if (assignments) {
      // Bulk assignment by count
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      try {
        let unassignedItems;
        let queryStr = '';
        if (isEventDay) {
          queryStr = `
            SELECT id 
            FROM ${table} 
            WHERE month = ? AND status = ? AND assigned_employee_id IS NULL 
            ORDER BY date ASC, id ASC
          `;
          const [rows] = await connection.query(queryStr, [month, statusVal]);
          unassignedItems = rows;
        } else {
          queryStr = `
            SELECT id, client_id, activity_code 
            FROM ${table} 
            WHERE month = ? AND status IN ('approved', 'sent_to_employees') AND assigned_employee_id IS NULL 
            ORDER BY date ASC, id ASC
          `;
          const [rows] = await connection.query(queryStr, [month]);
          unassignedItems = rows;
        }

        let unassignedIdx = 0;
        for (const [wIdStr, countVal] of Object.entries(assignments)) {
          const wId = Number(wIdStr);
          const count = Number(countVal);
          if (isNaN(count) || count <= 0) continue;

          for (let i = 0; i < count; i++) {
            if (unassignedIdx >= unassignedItems.length) break;
            const item = unassignedItems[unassignedIdx];
            
            await connection.query(`
              UPDATE ${table} SET assigned_employee_id = ?, submission_status = 'pending' WHERE id = ?
            `, [wId, item.id]);

            if (!isEventDay) {
              if (item.activity_code) {
                await connection.query(`
                  UPDATE monthly_deliverables 
                  SET content_writer_id = ? 
                  WHERE client_id = ? AND activity_code = ? AND month = ? AND deleted_at IS NULL
                `, [wId, item.client_id, item.activity_code, month]);
              }
            }
            unassignedIdx++;
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
  }
}

module.exports = new ContentWorkService();
