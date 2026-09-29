const pool = require('../config/db');

class DeliverableRepository {
  getContext(conn) {
    return conn || pool;
  }

  // Deliverable Templates
  async getTemplatesList({ limit, offset, searchQuery }) {
    let query = 'SELECT * FROM deliverable_templates';
    const params = [];

    if (searchQuery) {
      query += ` WHERE name LIKE ? OR description LIKE ?`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getTemplatesCount({ searchQuery }) {
    let query = 'SELECT COUNT(*) as count FROM deliverable_templates';
    const params = [];

    if (searchQuery) {
      query += ` WHERE name LIKE ? OR description LIKE ?`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async findTemplateById(id) {
    const [rows] = await pool.query('SELECT * FROM deliverable_templates WHERE id = ?', [id]);
    return rows[0];
  }

  async findTemplateByName(name) {
    const [rows] = await pool.query('SELECT * FROM deliverable_templates WHERE name = ?', [name]);
    return rows[0];
  }

  async createTemplate(templateData, conn) {
    const db = this.getContext(conn);
    const { name, description, created_by } = templateData;
    const [result] = await db.query(
      'INSERT INTO deliverable_templates (name, description, created_by) VALUES (?, ?, ?)',
      [name, description, created_by]
    );
    return result.insertId;
  }

  async updateTemplate(id, templateData, conn) {
    const db = this.getContext(conn);
    const { name, description } = templateData;
    await db.query(
      'UPDATE deliverable_templates SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
  }

  async deleteTemplate(id, conn) {
    const db = this.getContext(conn);
    await db.query('DELETE FROM deliverable_templates WHERE id = ?', [id]);
  }

  // Template Items
  async getTemplateItems(templateId) {
    const [rows] = await pool.query(`
      SELECT ti.*, d.name AS department_name 
      FROM deliverable_template_items ti
      JOIN departments d ON ti.department_id = d.id
      WHERE ti.template_id = ?
    `, [templateId]);
    return rows;
  }

  async createTemplateItem(itemData, conn) {
    const db = this.getContext(conn);
    const { template_id, department_id, deliverable, quantity, priority } = itemData;
    const [result] = await db.query(
      'INSERT INTO deliverable_template_items (template_id, department_id, deliverable, quantity, priority) VALUES (?, ?, ?, ?, ?)',
      [template_id, department_id, deliverable, quantity, priority]
    );
    return result.insertId;
  }

  async clearTemplateItems(templateId, conn) {
    const db = this.getContext(conn);
    await db.query('DELETE FROM deliverable_template_items WHERE template_id = ?', [templateId]);
  }

  // Monthly Deliverables CRUD
  async getDeliverablesList({ limit, offset, sortColumn, sortOrder, searchQuery, statusFilter, priorityFilter, clientFilter, departmentFilter, monthFilter, dateFilter, smmTodayFilter, managerFilter, employeeFilter }) {
    let query = `
      SELECT md.*, c.company_name AS client_name, COALESCE(d.name, 'Creatives') AS department_name, m.full_name AS manager_name, e.full_name AS employee_name, smme.full_name AS smm_employee_name, COALESCE(at.sub_department_id, e.sub_department_id) AS sub_department_id, e.sub_department_id AS employee_sub_dept_id, cw.full_name AS content_writer_name
      FROM (
        SELECT 
          id, client_id, month, department_id, deliverable, quantity, 
          assigned_manager_id, assigned_employee_id, smm_employee_id, 
          priority, due_date, description, status, remarks, google_drive_link, 
          deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
          client_feedback_text, client_action_at, content_link, designer_output,
          content_writer_id, 0 AS is_event_day, event_day_title, updated_at, created_at
        FROM monthly_deliverables
        
        UNION ALL
        
        SELECT 
          jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
          1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
          jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
          'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
          jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
          NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
          jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
          jw.content_writer_id, 0 AS is_event_day, NULL AS event_day_title, jw.updated_at, jw.created_at
        FROM job_works jw
        LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code

        UNION ALL

        SELECT 
          ed.id, (SELECT id FROM clients WHERE status = 'active' AND deleted_at IS NULL ORDER BY id ASC LIMIT 1) AS client_id, ed.month,
          1 AS department_id, CONCAT('AT006: ', ed.title) AS deliverable,
          1 AS quantity, NULL AS assigned_manager_id, ed.assigned_employee_id, NULL AS smm_employee_id,
          'high' AS priority, DATE(ed.date) AS due_date, ed.description,
          CASE WHEN ed.status = 'sent_to_employee' THEN 'assigned' ELSE ed.status END AS status,
          ed.remarks, ed.work_link AS google_drive_link,
          NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('ED-', ed.id) AS activity_code,
          ed.remarks AS client_feedback_text, NULL AS client_action_at, ed.work_link AS content_link, ed.work_link AS designer_output,
          NULL AS content_writer_id, 1 AS is_event_day, ed.title AS event_day_title, ed.updated_at, ed.created_at
        FROM event_days ed
      ) md
      LEFT JOIN clients c ON md.client_id = c.id
      LEFT JOIN departments d ON md.department_id = d.id
      LEFT JOIN managers m ON md.assigned_manager_id = m.id
      LEFT JOIN employees e ON md.assigned_employee_id = e.id
      LEFT JOIN employees smme ON md.smm_employee_id = smme.id
      LEFT JOIN employees cw ON md.content_writer_id = cw.id
      LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
      WHERE md.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (md.deliverable LIKE ? OR md.description LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }
    if (statusFilter) {
      if (typeof statusFilter === 'string' && statusFilter.includes(',')) {
        const statuses = statusFilter.split(',').map(s => s.trim());
        const placeholders = statuses.map(() => '?').join(',');
        query += ` AND md.status IN (${placeholders})`;
        params.push(...statuses);
      } else {
        query += ` AND md.status = ?`;
        params.push(statusFilter);
      }
    }
    if (priorityFilter) {
      query += ` AND md.priority = ?`;
      params.push(priorityFilter);
    }
    if (clientFilter) {
      query += ` AND md.client_id = ?`;
      params.push(clientFilter);
    }
    if (departmentFilter) {
      query += ` AND md.department_id = ?`;
      params.push(departmentFilter);
    }
    if (monthFilter) {
      query += ` AND md.month = ?`;
      params.push(monthFilter);
    }
    if (dateFilter) {
      const eventDueDates = await this.getEventDayDueDatesForAssignment(dateFilter);
      if (eventDueDates.length > 0) {
        const placeholders = eventDueDates.map(() => '?').join(',');
        query += ` AND (md.due_date = ? OR ( (md.activity_type_code = 'AT006' OR md.is_event_day = 1) AND md.due_date IN (${placeholders}) ))`;
        params.push(dateFilter, ...eventDueDates);
      } else {
        query += ` AND md.due_date = ?`;
        params.push(dateFilter);
      }
    }
    if (smmTodayFilter) {
      query += ` AND ((md.due_date <= ? AND md.status IN ('approved', 'assigned', 'assigned_employee', 'client_approved', 'manager_approved', 'sent_to_client')) OR (md.due_date = ? AND md.status IN ('posted', 'completed')) OR (md.is_job_work = 1 AND md.status IN ('approved', 'manager_approved', 'client_approved', 'assigned', 'assigned_employee', 'sent_to_client')))`;
      params.push(smmTodayFilter, smmTodayFilter);
    }
    if (managerFilter) {
      query += ` AND md.assigned_manager_id = ?`;
      params.push(managerFilter);
    }
    if (employeeFilter) {
      query += ` AND (md.assigned_employee_id = ? OR md.smm_employee_id = ?)`;
      params.push(employeeFilter, employeeFilter);
    }

    const allowedSort = ['deliverable', 'client_name', 'department_name', 'manager_name', 'employee_name', 'month', 'priority', 'due_date', 'status'];
    const column = allowedSort.includes(sortColumn) ? sortColumn : 'md.id';
    const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${column} ${order}`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getDeliverablesCount({ searchQuery, statusFilter, priorityFilter, clientFilter, departmentFilter, monthFilter, dateFilter, smmTodayFilter, managerFilter, employeeFilter }) {
    let query = `
      SELECT COUNT(*) as count 
      FROM (
        SELECT 
          id, client_id, month, department_id, deliverable, quantity, 
          assigned_manager_id, assigned_employee_id, smm_employee_id, 
          priority, due_date, description, status, remarks, google_drive_link, 
          deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
          client_feedback_text, client_action_at, content_link, designer_output,
          0 AS is_event_day
        FROM monthly_deliverables
        
        UNION ALL
        
        SELECT 
          jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
          1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
          jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
          'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
          jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
          NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
          jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
          0 AS is_event_day
        FROM job_works jw
        LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code

        UNION ALL

        SELECT 
          ed.id, (SELECT id FROM clients WHERE status = 'active' AND deleted_at IS NULL ORDER BY id ASC LIMIT 1) AS client_id, ed.month,
          1 AS department_id, CONCAT('AT006: ', ed.title) AS deliverable,
          1 AS quantity, NULL AS assigned_manager_id, ed.assigned_employee_id, NULL AS smm_employee_id,
          'high' AS priority, DATE(ed.date) AS due_date, ed.description,
          CASE WHEN ed.status = 'sent_to_employee' THEN 'assigned' ELSE ed.status END AS status,
          ed.remarks, ed.work_link AS google_drive_link,
          NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('ED-', ed.id) AS activity_code,
          ed.remarks AS client_feedback_text, NULL AS client_action_at, ed.work_link AS content_link, ed.work_link AS designer_output,
          1 AS is_event_day
        FROM event_days ed
      ) md
      LEFT JOIN clients c ON md.client_id = c.id
      LEFT JOIN departments d ON md.department_id = d.id
      WHERE md.deleted_at IS NULL
    `;
    const params = [];

    if (searchQuery) {
      query += ` AND (md.deliverable LIKE ? OR md.description LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }
    if (statusFilter) {
      if (typeof statusFilter === 'string' && statusFilter.includes(',')) {
        const statuses = statusFilter.split(',').map(s => s.trim());
        const placeholders = statuses.map(() => '?').join(',');
        query += ` AND md.status IN (${placeholders})`;
        params.push(...statuses);
      } else {
        query += ` AND md.status = ?`;
        params.push(statusFilter);
      }
    }
    if (priorityFilter) {
      query += ` AND md.priority = ?`;
      params.push(priorityFilter);
    }
    if (clientFilter) {
      query += ` AND md.client_id = ?`;
      params.push(clientFilter);
    }
    if (departmentFilter) {
      query += ` AND md.department_id = ?`;
      params.push(departmentFilter);
    }
    if (monthFilter) {
      query += ` AND md.month = ?`;
      params.push(monthFilter);
    }
    if (dateFilter) {
      const eventDueDates = await this.getEventDayDueDatesForAssignment(dateFilter);
      if (eventDueDates.length > 0) {
        const placeholders = eventDueDates.map(() => '?').join(',');
        query += ` AND (md.due_date = ? OR ( (md.activity_type_code = 'AT006' OR md.is_event_day = 1) AND md.due_date IN (${placeholders}) ))`;
        params.push(dateFilter, ...eventDueDates);
      } else {
        query += ` AND md.due_date = ?`;
        params.push(dateFilter);
      }
    }
    if (smmTodayFilter) {
      query += ` AND ((md.due_date <= ? AND md.status IN ('approved', 'assigned', 'assigned_employee', 'client_approved', 'manager_approved', 'sent_to_client')) OR (md.due_date = ? AND md.status IN ('posted', 'completed')) OR (md.is_job_work = 1 AND md.status IN ('approved', 'manager_approved', 'client_approved', 'assigned', 'assigned_employee', 'sent_to_client')))`;
      params.push(smmTodayFilter, smmTodayFilter);
    }
    if (managerFilter) {
      query += ` AND md.assigned_manager_id = ?`;
      params.push(managerFilter);
    }
    if (employeeFilter) {
      query += ` AND (md.assigned_employee_id = ? OR md.smm_employee_id = ?)`;
      params.push(employeeFilter, employeeFilter);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].count;
  }

  async findDeliverableById(id) {
    const [rows] = await pool.query(`
      SELECT md.*, c.company_name AS client_name, d.name AS department_name, m.full_name AS manager_name, e.full_name AS employee_name, smme.full_name AS smm_employee_name, COALESCE(at.sub_department_id, e.sub_department_id) AS sub_department_id, e.sub_department_id AS employee_sub_dept_id
      FROM monthly_deliverables md
      JOIN clients c ON md.client_id = c.id
      JOIN departments d ON md.department_id = d.id
      JOIN managers m ON md.assigned_manager_id = m.id
      JOIN employees e ON md.assigned_employee_id = e.id
      LEFT JOIN employees smme ON md.smm_employee_id = smme.id
      LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
      WHERE md.id = ? AND md.deleted_at IS NULL
    `, [id]);
    return rows[0];
  }

  async createDeliverable(delivData, conn) {
    const db = this.getContext(conn);
    const { client_id, month, department_id, deliverable, quantity, assigned_manager_id, assigned_employee_id, priority, due_date, description, status, remarks, created_by, content_writer_id } = delivData;
    const [result] = await db.query(
      `INSERT INTO monthly_deliverables (client_id, month, department_id, deliverable, quantity, assigned_manager_id, assigned_employee_id, priority, due_date, description, status, remarks, created_by, content_writer_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_id, month, department_id, deliverable, quantity, assigned_manager_id, assigned_employee_id, priority, due_date, description, status, remarks, created_by, content_writer_id || null]
    );
    return result.insertId;
  }

  async updateDeliverable(id, delivData, conn) {
    const db = this.getContext(conn);
    const { 
      client_id, month, department_id, deliverable, quantity, 
      assigned_manager_id, assigned_employee_id, priority, due_date, 
      description, status, remarks, updated_by,
      designer_output, client_feedback, client_output_status,
      client_action_at, content_writer_id
    } = delivData;

    await db.query(
      `UPDATE monthly_deliverables 
       SET client_id = ?, month = ?, department_id = ?, deliverable = ?, quantity = ?, 
           assigned_manager_id = ?, assigned_employee_id = ?, priority = ?, due_date = ?, 
           description = ?, status = ?, remarks = ?, updated_by = ?,
           designer_output = ?, client_feedback = ?, client_output_status = ?,
           client_action_at = ?, content_writer_id = COALESCE(?, content_writer_id)
       WHERE id = ? AND deleted_at IS NULL`,
      [
        client_id, month, department_id, deliverable, quantity, 
        assigned_manager_id, assigned_employee_id, priority, due_date, 
        description, status, remarks, updated_by,
        designer_output !== undefined ? designer_output : null,
        client_feedback !== undefined ? client_feedback : null,
        client_output_status !== undefined ? client_output_status : 'pending',
        client_action_at !== undefined ? client_action_at : null,
        content_writer_id !== undefined ? content_writer_id : null,
        id
      ]
    );
  }

  async softDeleteDeliverable(id, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE monthly_deliverables SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  async changeDeliverableStatus(id, status, conn) {
    const db = this.getContext(conn);
    if (status === 'sent_to_client') {
      await db.query('UPDATE monthly_deliverables SET status = ?, sent_to_client_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL', [status, id]);
    } else if (status === 'posted') {
      await db.query('UPDATE monthly_deliverables SET status = ?, posted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL', [status, id]);
    } else {
      await db.query('UPDATE monthly_deliverables SET status = ? WHERE id = ? AND deleted_at IS NULL', [status, id]);
    }
  }

  // Find default active manager for a department
  async findDefaultManagerForDept(departmentId) {
    const [rows] = await pool.query(
      'SELECT id FROM managers WHERE department_id = ? AND status = "active" ORDER BY id ASC LIMIT 1',
      [departmentId]
    );
    return rows[0] ? rows[0].id : null;
  }

  // Find default active employee for a department
  async findDefaultEmployeeForDept(departmentId) {
    const [rows] = await pool.query(
      'SELECT id FROM employees WHERE department_id = ? AND status = "active" ORDER BY id ASC LIMIT 1',
      [departmentId]
    );
    return rows[0] ? rows[0].id : null;
  }

  // Bulk Operations
  async bulkDeleteDeliverables(ids, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE monthly_deliverables SET deleted_at = CURRENT_TIMESTAMP WHERE id IN (?)', [ids]);
  }

  async bulkUpdateDeliverablesStatus(ids, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE monthly_deliverables SET status = ? WHERE id IN (?) AND deleted_at IS NULL', [status, ids]);
  }

  // --- MONTHLY DELIVERABLES GRID METHODS ---
  async getMonthlyGrid(month) {
    const [rows] = await pool.query(
      `SELECT mdg.*, c.company_name AS client_name 
       FROM monthly_deliverables_grid mdg
       JOIN clients c ON mdg.client_id = c.id
       WHERE mdg.month = ? AND c.deleted_at IS NULL`,
      [month]
    );
    return rows;
  }

  async saveGridRow(rowData, conn) {
    const db = this.getContext(conn);
    const { client_id, month, posters, reels, yts, yt, posted_day } = rowData;
    await db.query(
      `INSERT INTO monthly_deliverables_grid (client_id, month, posters, reels, yts, yt, posted_day)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         posters = VALUES(posters),
         reels = VALUES(reels),
         yts = VALUES(yts),
         yt = VALUES(yt),
         posted_day = VALUES(posted_day)`,
      [client_id, month, posters, reels, yts, yt, posted_day]
    );
  }

  // --- MONTHLY BLOGS GRID METHODS ---
  async getMonthlyBlogsGrid(month) {
    const [rows] = await pool.query(
      `SELECT mbg.*, c.company_name AS client_name 
       FROM monthly_blogs_grid mbg
       JOIN clients c ON mbg.client_id = c.id
       WHERE mbg.month = ? AND c.deleted_at IS NULL`,
      [month]
    );
    return rows;
  }

  async saveBlogsGridRow(rowData, conn) {
    const db = this.getContext(conn);
    const { client_id, month, blogs_count, gmb_count, backlink_count, posted_day } = rowData;
    await db.query(
      `INSERT INTO monthly_blogs_grid (client_id, month, blogs_count, gmb_count, backlink_count, posted_day)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         blogs_count = VALUES(blogs_count),
         gmb_count = VALUES(gmb_count),
         backlink_count = VALUES(backlink_count),
         posted_day = VALUES(posted_day)`,
      [client_id, month, blogs_count, gmb_count || 0, backlink_count || 0, posted_day]
    );
  }

  // --- JOB WORK METHODS ---
  async getJobWorks() {
    const [rows] = await pool.query(`
      SELECT jw.*, c.company_name AS client_name, m.full_name AS manager_name, e.full_name AS employee_name, se.full_name AS smm_employee_name, e.sub_department_id AS employee_sub_dept
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN managers m ON jw.assigned_manager_id = m.id
      LEFT JOIN employees e ON jw.assigned_employee_id = e.id
      LEFT JOIN employees se ON jw.smm_employee_id = se.id
      ORDER BY jw.id DESC
    `);
    return rows;
  }

  async getJobWorksByManager(managerId, deptId = null) {
    let sql = `
      SELECT jw.*, c.company_name AS client_name, e.full_name AS employee_name, e.sub_department_id AS employee_sub_dept_id, se.full_name AS smm_employee_name, at.sub_department_id AS sub_department_id, at.activity_name AS activity_name, cw.full_name AS content_writer_name
      FROM job_works jw
      JOIN clients c ON jw.client_id = c.id
      LEFT JOIN employees e ON jw.assigned_employee_id = e.id
      LEFT JOIN employees se ON jw.smm_employee_id = se.id
      LEFT JOIN employees cw ON jw.content_writer_id = cw.id
      LEFT JOIN activity_types at ON jw.activity_type_code = at.activity_type_code
      WHERE 1=1
    `;
    const params = [];
    if (managerId) {
      sql += ` AND (jw.assigned_manager_id = ? OR jw.assigned_manager_id IS NULL)`;
      params.push(managerId);
    }
    sql += ` ORDER BY jw.id DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  async createJobWork(jobData, conn) {
    const db = this.getContext(conn);
    const { client_id, activity_type_code, activity_code, quantity, deadline, assigned_manager_id, content_writer_id } = jobData;
    const [result] = await db.query(
      `INSERT INTO job_works (client_id, activity_type_code, activity_code, quantity, deadline, assigned_manager_id, content_writer_id, assigned_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [client_id, activity_type_code, activity_code, quantity, deadline, assigned_manager_id, content_writer_id || null]
    );
    return result.insertId;
  }

  async updateJobWorkStatus(id, status, conn) {
    const db = this.getContext(conn);
    await db.query('UPDATE job_works SET status = ? WHERE id = ?', [status, id]);
  }

  async getAdminWorkUpdatesList({ departmentId, date, month, tab, limit, offset, searchQuery, statusFilter, employeeId, workType }) {
    let querySub = '';
    const params = [];
    const hasDept = departmentId && departmentId !== 'all';
    const isCreatives = hasDept ? (Number(departmentId) === 1 ? 1 : 0) : 1;

    const deliverablesDailyQuery = `
      SELECT 
        id, client_id, month, department_id, deliverable, quantity, 
        assigned_manager_id, assigned_employee_id, smm_employee_id, 
        priority, due_date, description, status, remarks, google_drive_link, 
        deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
        client_feedback_text, client_action_at, content_link, designer_output,
        content_writer_id, created_at, updated_at, 0 AS is_event_day
      FROM monthly_deliverables
      WHERE ${hasDept ? 'department_id = ?' : '1=1'} AND deleted_at IS NULL AND (due_date = ? OR (due_date < ? AND status NOT IN ('completed', 'approved', 'client_approved', 'posted')))
    `;

    const jobWorksDailyQuery = `
      SELECT 
        jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
        1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
        jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
        'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
        jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
        NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
        jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
        jw.content_writer_id, jw.created_at, jw.updated_at, 0 AS is_event_day
      FROM job_works jw
      LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code
      WHERE ${hasDept ? '1 = ?' : '1=1'} AND (DATE(jw.deadline) = ? OR (DATE(jw.deadline) < ? AND jw.status NOT IN ('completed', 'approved', 'client_approved')))
    `;

    const eventDaysDailyQuery = `
      SELECT 
        id, 0 AS client_id, month, 1 AS department_id, title AS deliverable, 1 AS quantity, 
        1 AS assigned_manager_id, NULL AS assigned_employee_id, NULL AS smm_employee_id, 
        'medium' AS priority, date AS due_date, description, 
        CASE 
          WHEN submission_status = 'approved' THEN 'approved'
          WHEN submission_status = 'submitted' THEN 'submitted'
          ELSE 'pending'
        END AS status, 
        remarks, NULL AS google_drive_link, 
        NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('EVT', id) AS activity_code,
        NULL AS client_feedback_text, NULL AS client_action_at, work_link AS content_link, NULL AS designer_output,
        assigned_employee_id AS content_writer_id, created_at, updated_at, 1 AS is_event_day
      FROM event_days
      WHERE status = 'sent_to_employee' AND ${hasDept ? '? = 1' : '1=1'} AND (date = ? OR (date < ? AND submission_status NOT IN ('approved')))
    `;

    const deliverablesMonthlyQuery = `
      SELECT 
        id, client_id, month, department_id, deliverable, quantity, 
        assigned_manager_id, assigned_employee_id, smm_employee_id, 
        priority, due_date, description, status, remarks, google_drive_link, 
        deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
        client_feedback_text, client_action_at, content_link, designer_output,
        content_writer_id, created_at, updated_at, 0 AS is_event_day
      FROM monthly_deliverables
      WHERE ${hasDept ? 'department_id = ?' : '1=1'} AND deleted_at IS NULL AND month = ?
    `;

    const jobWorksMonthlyQuery = `
      SELECT 
        jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
        1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
        jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
        'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
        jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
        NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
        jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
        jw.content_writer_id, jw.created_at, jw.updated_at, 0 AS is_event_day
      FROM job_works jw
      LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code
      WHERE ${hasDept ? '1 = ?' : '1=1'} AND DATE_FORMAT(jw.deadline, '%Y-%m') = ?
    `;

    const eventDaysMonthlyQuery = `
      SELECT 
        id, 0 AS client_id, month, 1 AS department_id, title AS deliverable, 1 AS quantity, 
        1 AS assigned_manager_id, NULL AS assigned_employee_id, NULL AS smm_employee_id, 
        'medium' AS priority, date AS due_date, description, 
        CASE 
          WHEN submission_status = 'approved' THEN 'approved'
          WHEN submission_status = 'submitted' THEN 'submitted'
          ELSE 'pending'
        END AS status, 
        remarks, NULL AS google_drive_link, 
        NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('EVT', id) AS activity_code,
        NULL AS client_feedback_text, NULL AS client_action_at, work_link AS content_link, NULL AS designer_output,
        assigned_employee_id AS content_writer_id, created_at, updated_at, 1 AS is_event_day
      FROM event_days
      WHERE status = 'sent_to_employee' AND ${hasDept ? '? = 1' : '1=1'} AND month = ?
    `;

    if (tab === 'daily') {
      if (workType === 'deliverable') {
        querySub = `${deliverablesDailyQuery} UNION ALL ${eventDaysDailyQuery}`;
        if (hasDept) {
          params.push(departmentId, date, date, isCreatives, date, date);
        } else {
          params.push(date, date, date, date);
        }
      } else if (workType === 'job_work') {
        querySub = jobWorksDailyQuery;
        if (hasDept) params.push(isCreatives);
        params.push(date, date);
      } else {
        querySub = `${deliverablesDailyQuery} UNION ALL ${eventDaysDailyQuery} UNION ALL ${jobWorksDailyQuery}`;
        if (hasDept) {
          params.push(departmentId, date, date, isCreatives, date, date, isCreatives, date, date);
        } else {
          params.push(date, date, date, date, date, date);
        }
      }
    } else {
      if (workType === 'deliverable') {
        querySub = `${deliverablesMonthlyQuery} UNION ALL ${eventDaysMonthlyQuery}`;
        if (hasDept) {
          params.push(departmentId, month, isCreatives, month);
        } else {
          params.push(month, month);
        }
      } else if (workType === 'job_work') {
        querySub = jobWorksMonthlyQuery;
        if (hasDept) params.push(isCreatives);
        params.push(month);
      } else {
        querySub = `${deliverablesMonthlyQuery} UNION ALL ${eventDaysMonthlyQuery} UNION ALL ${jobWorksMonthlyQuery}`;
        if (hasDept) {
          params.push(departmentId, month, isCreatives, month, isCreatives, month);
        } else {
          params.push(month, month, month);
        }
      }
    }

    let query = `
      SELECT md.*, COALESCE(c.company_name, 'Event Day') AS client_name, COALESCE(d.name, 'Creatives') AS department_name, m.full_name AS manager_name, e.full_name AS employee_name, smme.full_name AS smm_employee_name, cw.full_name AS content_writer_name, COALESCE(at.sub_department_id, e.sub_department_id) AS sub_department_id, e.sub_department_id AS employee_sub_dept_id
      FROM (${querySub}) md
      LEFT JOIN clients c ON md.client_id = c.id
      LEFT JOIN departments d ON md.department_id = d.id
      LEFT JOIN managers m ON md.assigned_manager_id = m.id
      LEFT JOIN employees e ON md.assigned_employee_id = e.id
      LEFT JOIN employees smme ON md.smm_employee_id = smme.id
      LEFT JOIN employees cw ON md.content_writer_id = cw.id
      LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
      WHERE 1=1
    `;

    if (searchQuery) {
      query += ` AND (md.deliverable LIKE ? OR c.company_name LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }

    if (statusFilter) {
      if (statusFilter === 'completed') {
        query += ` AND md.status IN ('completed', 'approved', 'client_approved', 'posted')`;
      } else if (statusFilter === 'incomplete') {
        query += ` AND md.status NOT IN ('completed', 'approved', 'client_approved', 'posted')`;
      } else if (statusFilter === 'pending') {
        query += ` AND md.status IN ('submitted', 'sent_to_client', 'client_rework')`;
      } else {
        query += ` AND md.status = ?`;
        params.push(statusFilter);
      }
    }

    if (employeeId) {
      query += ` AND md.assigned_employee_id = ?`;
      params.push(employeeId);
    }

    // Default sorting by due_date and id
    query += ` ORDER BY md.due_date ASC, md.id DESC`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getAdminWorkUpdatesCount({ departmentId, date, month, tab, searchQuery, statusFilter, employeeId, workType }) {
    let querySub = '';
    const params = [];
    const hasDept = departmentId && departmentId !== 'all';
    const isCreatives = hasDept ? (Number(departmentId) === 1 ? 1 : 0) : 1;

    const deliverablesDailyQuery = `
      SELECT 
        id, client_id, month, department_id, deliverable, quantity, 
        assigned_manager_id, assigned_employee_id, smm_employee_id, 
        priority, due_date, description, status, remarks, google_drive_link, 
        deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
        client_feedback_text, client_action_at, content_link, designer_output,
        content_writer_id, 0 AS is_event_day
      FROM monthly_deliverables
      WHERE ${hasDept ? 'department_id = ?' : '1=1'} AND deleted_at IS NULL AND (due_date = ? OR (due_date < ? AND status NOT IN ('completed', 'approved', 'client_approved', 'posted')))
    `;

    const jobWorksDailyQuery = `
      SELECT 
        jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
        1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
        jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
        'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
        jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
        NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
        jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
        jw.content_writer_id, 0 AS is_event_day
      FROM job_works jw
      LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code
      WHERE ${hasDept ? '1 = ?' : '1=1'} AND (DATE(jw.deadline) = ? OR (DATE(jw.deadline) < ? AND jw.status NOT IN ('completed', 'approved', 'client_approved')))
    `;

    const eventDaysDailyQuery = `
      SELECT 
        id, 0 AS client_id, month, 1 AS department_id, title AS deliverable, 1 AS quantity, 
        1 AS assigned_manager_id, NULL AS assigned_employee_id, NULL AS smm_employee_id, 
        'medium' AS priority, date AS due_date, description, 
        CASE 
          WHEN submission_status = 'approved' THEN 'approved'
          WHEN submission_status = 'submitted' THEN 'submitted'
          ELSE 'pending'
        END AS status, 
        remarks, NULL AS google_drive_link, 
        NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('EVT', id) AS activity_code,
        NULL AS client_feedback_text, NULL AS client_action_at, work_link AS content_link, NULL AS designer_output,
        assigned_employee_id AS content_writer_id, 1 AS is_event_day
      FROM event_days
      WHERE status = 'sent_to_employee' AND ${hasDept ? '? = 1' : '1=1'} AND (date = ? OR (date < ? AND submission_status NOT IN ('approved')))
    `;

    const deliverablesMonthlyQuery = `
      SELECT 
        id, client_id, month, department_id, deliverable, quantity, 
        assigned_manager_id, assigned_employee_id, smm_employee_id, 
        priority, due_date, description, status, remarks, google_drive_link, 
        deleted_at, activity_type_code, 0 AS is_job_work, activity_code,
        client_feedback_text, client_action_at, content_link, designer_output,
        content_writer_id, 0 AS is_event_day
      FROM monthly_deliverables
      WHERE ${hasDept ? 'department_id = ?' : '1=1'} AND deleted_at IS NULL AND month = ?
    `;

    const jobWorksMonthlyQuery = `
      SELECT 
        jw.id, jw.client_id, DATE_FORMAT(jw.deadline, '%Y-%m') AS month, 
        1 AS department_id, COALESCE(at2.activity_name, jw.activity_type_code) AS deliverable, 
        jw.quantity, jw.assigned_manager_id, jw.assigned_employee_id, jw.smm_employee_id, 
        'high' AS priority, DATE(jw.deadline) AS due_date, jw.manager_feedback_text AS description, 
        jw.status, jw.client_feedback_text AS remarks, jw.google_drive_link, 
        NULL AS deleted_at, jw.activity_type_code, 1 AS is_job_work, jw.activity_code,
        jw.client_feedback_text, NULL AS client_action_at, jw.content_link, NULL AS designer_output,
        jw.content_writer_id, 0 AS is_event_day
      FROM job_works jw
      LEFT JOIN activity_types at2 ON jw.activity_type_code = at2.activity_type_code
      WHERE ${hasDept ? '1 = ?' : '1=1'} AND DATE_FORMAT(jw.deadline, '%Y-%m') = ?
    `;

    const eventDaysMonthlyQuery = `
      SELECT 
        id, 0 AS client_id, month, 1 AS department_id, title AS deliverable, 1 AS quantity, 
        1 AS assigned_manager_id, NULL AS assigned_employee_id, NULL AS smm_employee_id, 
        'medium' AS priority, date AS due_date, description, 
        CASE 
          WHEN submission_status = 'approved' THEN 'approved'
          WHEN submission_status = 'submitted' THEN 'submitted'
          ELSE 'pending'
        END AS status, 
        remarks, NULL AS google_drive_link, 
        NULL AS deleted_at, 'AT006' AS activity_type_code, 0 AS is_job_work, CONCAT('EVT', id) AS activity_code,
        NULL AS client_feedback_text, NULL AS client_action_at, work_link AS content_link, NULL AS designer_output,
        assigned_employee_id AS content_writer_id, 1 AS is_event_day
      FROM event_days
      WHERE status = 'sent_to_employee' AND ${hasDept ? '? = 1' : '1=1'} AND month = ?
    `;

    if (tab === 'daily') {
      if (workType === 'deliverable') {
        querySub = `${deliverablesDailyQuery} UNION ALL ${eventDaysDailyQuery}`;
        if (hasDept) {
          params.push(departmentId, date, date, isCreatives, date, date);
        } else {
          params.push(date, date, date, date);
        }
      } else if (workType === 'job_work') {
        querySub = jobWorksDailyQuery;
        if (hasDept) params.push(isCreatives);
        params.push(date, date);
      } else {
        querySub = `${deliverablesDailyQuery} UNION ALL ${eventDaysDailyQuery} UNION ALL ${jobWorksDailyQuery}`;
        if (hasDept) {
          params.push(departmentId, date, date, isCreatives, date, date, isCreatives, date, date);
        } else {
          params.push(date, date, date, date, date, date);
        }
      }
    } else {
      if (workType === 'deliverable') {
        querySub = `${deliverablesMonthlyQuery} UNION ALL ${eventDaysMonthlyQuery}`;
        if (hasDept) {
          params.push(departmentId, month, isCreatives, month);
        } else {
          params.push(month, month);
        }
      } else if (workType === 'job_work') {
        querySub = jobWorksMonthlyQuery;
        if (hasDept) params.push(isCreatives);
        params.push(month);
      } else {
        querySub = `${deliverablesMonthlyQuery} UNION ALL ${eventDaysMonthlyQuery} UNION ALL ${jobWorksMonthlyQuery}`;
        if (hasDept) {
          params.push(departmentId, month, isCreatives, month, isCreatives, month);
        } else {
          params.push(month, month, month);
        }
      }
    }

    let query = `
      SELECT COUNT(*) as count
      FROM (${querySub}) md
      LEFT JOIN clients c ON md.client_id = c.id
      WHERE 1=1
    `;

    if (searchQuery) {
      query += ` AND (md.deliverable LIKE ? OR c.company_name LIKE ?)`;
      const like = `%${searchQuery}%`;
      params.push(like, like);
    }

    if (statusFilter) {
      if (statusFilter === 'completed') {
        query += ` AND md.status IN ('completed', 'approved', 'client_approved', 'posted')`;
      } else if (statusFilter === 'incomplete') {
        query += ` AND md.status NOT IN ('completed', 'approved', 'client_approved', 'posted')`;
      } else if (statusFilter === 'pending') {
        query += ` AND md.status IN ('submitted', 'sent_to_client', 'client_rework')`;
      } else {
        query += ` AND md.status = ?`;
        params.push(statusFilter);
      }
    }

    if (employeeId) {
      query += ` AND md.assigned_employee_id = ?`;
      params.push(employeeId);
    }

    const [rows] = await pool.query(query, params);
    return rows[0] ? rows[0].count : 0;
  }

  async logJobWorkHistory({ jobWorkId, stage, action, description, userId = null, isJobWork = 1 }, connection = null) {
    const conn = connection || pool;

    // Check if an identical log entry was created in the last 10 seconds to prevent double logging
    const [recent] = await conn.query(
      `SELECT id FROM job_work_history 
       WHERE job_work_id = ? AND stage = ? AND action = ? AND is_job_work = ? 
         AND created_at >= NOW() - INTERVAL 10 SECOND`,
      [jobWorkId, stage, action, isJobWork]
    );
    if (recent.length > 0) {
      return { insertId: recent[0].id, duplicateSkipped: true };
    }

    let userName = null;
    if (userId) {
      const [userRows] = await conn.query('SELECT role, username FROM users WHERE id = ?', [userId]);
      if (userRows.length > 0) {
        const user = userRows[0];
        userName = user.username;
        if (user.role === 'manager') {
          const [profile] = await conn.query('SELECT full_name FROM managers WHERE user_id = ?', [userId]);
          if (profile.length > 0) userName = profile[0].full_name;
        } else if (user.role === 'employee') {
          const [profile] = await conn.query('SELECT full_name FROM employees WHERE user_id = ?', [userId]);
          if (profile.length > 0) userName = profile[0].full_name;
        } else if (user.role === 'hr') {
          const [profile] = await conn.query('SELECT full_name FROM hr WHERE user_id = ?', [userId]);
          if (profile.length > 0) userName = profile[0].full_name;
        }
      }
    }
    const [result] = await conn.query(
      `INSERT INTO job_work_history (job_work_id, stage, action, description, user_id, user_name, is_job_work)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [jobWorkId, stage, action, description, userId, userName, isJobWork]
    );
    return result;
  }

  async getJobWorkHistory(jobWorkId, isJobWork = 1) {
    const [rows] = await pool.query(
      `SELECT * FROM job_work_history WHERE job_work_id = ? AND is_job_work = ? ORDER BY id ASC`,
      [jobWorkId, isJobWork]
    );
    
    // Deduplicate history entries that have identical key fields within 30 seconds
    const deduplicated = [];
    const seen = new Map();
    for (const r of rows) {
      const key = `${r.job_work_id}_${r.stage}_${r.action}_${r.description}_${r.is_job_work}`;
      const time = new Date(r.created_at).getTime();
      if (seen.has(key)) {
        const prevTime = seen.get(key);
        if (Math.abs(time - prevTime) < 30000) {
          continue;
        }
      }
      seen.set(key, time);
      deduplicated.push(r);
    }

    return deduplicated;
  }

  async getEventDayDueDatesForAssignment(targetDateStr) {
    if (!targetDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)) {
      return [];
    }
    const month = targetDateStr.substring(0, 7);
    const [skipRows] = await pool.query(
      'SELECT DATE_FORMAT(date, "%Y-%m-%d") AS date_str FROM calendar_skip_dates WHERE month >= ? LIMIT 100',
      [month]
    );
    const skipDatesSet = new Set(skipRows.map(r => r.date_str));

    const isOffDay = (dStr) => {
      const parts = dStr.split('-');
      const dt = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
      if (dt.getUTCDay() === 0) return true; // Sunday
      return skipDatesSet.has(dStr);
    };

    if (isOffDay(targetDateStr)) {
      return [];
    }

    const candidateDates = [];
    const parts = targetDateStr.split('-');
    let dt = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
    dt.setUTCDate(dt.getUTCDate() + 1);

    while (true) {
      const curStr = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
      candidateDates.push(curStr);

      if (!isOffDay(curStr)) {
        break;
      }
      dt.setUTCDate(dt.getUTCDate() + 1);
    }

    return candidateDates;
  }
}

module.exports = new DeliverableRepository();