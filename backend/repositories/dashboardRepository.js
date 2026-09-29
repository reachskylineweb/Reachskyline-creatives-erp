const pool = require('../config/db');

class DashboardRepository {
  async getSummaryStats() {
    const today = new Date().toISOString().split('T')[0];

    const queries = {
      totalClients: 'SELECT COUNT(*) AS count FROM clients WHERE deleted_at IS NULL AND status = "active"',
      totalDepartments: 'SELECT COUNT(*) AS count FROM departments WHERE deleted_at IS NULL AND status = "active"',
      totalSubDepartments: 'SELECT COUNT(*) AS count FROM sub_departments',
      totalManagers: 'SELECT COUNT(*) AS count FROM managers WHERE status = "active"',
      totalEmployees: 'SELECT COUNT(*) AS count FROM employees WHERE status = "active"',
      totalHR: 'SELECT COUNT(*) AS count FROM hr WHERE status = "active"',
      activeProjects: 'SELECT COUNT(*) AS count FROM projects WHERE deleted_at IS NULL AND status = "active"',
      completedProjects: 'SELECT COUNT(*) AS count FROM projects WHERE deleted_at IS NULL AND status = "completed"',
      pendingProjects: 'SELECT COUNT(*) AS count FROM projects WHERE deleted_at IS NULL AND status = "pending"',
      todayPendingTasks: 'SELECT COUNT(*) AS count FROM tasks WHERE due_date <= ? AND status != "completed"',
      todayClientApprovals: 'SELECT COUNT(*) AS count FROM client_approvals WHERE status = "pending" AND request_date <= ?'
    };

    const results = {};
    const keys = Object.keys(queries);

    for (const key of keys) {
      const q = queries[key];
      const params = (key === 'todayPendingTasks' || key === 'todayClientApprovals') ? [today] : [];
      const [rows] = await pool.query(q, params);
      results[key] = rows[0].count;
    }

    return results;
  }

  async getRecentActivities(limit = 10) {
    const [rows] = await pool.query(`
      SELECT al.*, u.username, u.role 
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `, [Number(limit)]);
    return rows;
  }

  async createActivityLog(userId, action, description, conn) {
    if (!userId) return;
    const db = conn || pool;
    try {
      const [uRows] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (uRows.length > 0) {
        await db.query(
          'INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)',
          [userId, action, description]
        );
      }
    } catch (err) {
      console.warn('[ActivityLog] Skipped logging due to user constraint:', err.message);
    }
  }

  async getUpcomingDeadlines(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(`
      SELECT p.id, p.project_name, p.end_date, p.status, c.company_name 
      FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE p.deleted_at IS NULL AND p.status != 'completed' AND p.end_date >= ?
      ORDER BY p.end_date ASC
      LIMIT ?
    `, [today, Number(limit)]);
    return rows;
  }

  async getMonthlyProjectProgress() {
    // Returns projects created count grouped by month (last 6 months)
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(start_date, '%b %Y') AS month, COUNT(*) AS count
      FROM projects
      WHERE deleted_at IS NULL AND start_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(start_date, '%b %Y'), YEAR(start_date), MONTH(start_date)
      ORDER BY YEAR(start_date) ASC, MONTH(start_date) ASC
    `);
    return rows;
  }

  async getDepartmentPerformance() {
    // Returns completed monthly deliverables count per department
    const [rows] = await pool.query(`
      SELECT d.name AS department_name, COUNT(md.id) AS completed_deliverables
      FROM departments d
      LEFT JOIN monthly_deliverables md ON md.department_id = d.id AND md.status = 'completed' AND md.deleted_at IS NULL
      WHERE d.deleted_at IS NULL
      GROUP BY d.id, d.name
    `);
    return rows;
  }

  async getEmployeePerformance() {
    // Returns top 5 employees with completed deliverables count
    const [rows] = await pool.query(`
      SELECT e.full_name AS employee_name, COUNT(md.id) AS completed_count
      FROM employees e
      JOIN monthly_deliverables md ON md.assigned_employee_id = e.id
      WHERE md.status = 'completed' AND md.deleted_at IS NULL
      GROUP BY e.id, e.full_name
      ORDER BY completed_count DESC
      LIMIT 5
    `);
    return rows;
  }

  async getProjectStatusDistribution() {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM projects
      WHERE deleted_at IS NULL
      GROUP BY status
    `);
    return rows;
  }

  // Reports Retrieval
  async getReportData({ type, startDate, endDate, clientId, departmentId, managerId, employeeId, month }) {
    let query = '';
    const params = [];
    const monthFilter = month || new Date().toISOString().substring(0, 7);

    switch (type) {
      case 'client':
        query = `
          SELECT 
            c.client_id_code AS \`Client ID\`,
            c.company_name AS \`Company Name\`,
            ? AS \`Month\`,
            COUNT(md.id) AS \`Total Tasks\`,
            SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) AS \`Completed Tasks\`,
            SUM(CASE WHEN md.status != 'completed' THEN 1 ELSE 0 END) AS \`Pending Tasks\`,
            COALESCE(ROUND((SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(md.id), 0)) * 100, 1), 0.0) AS \`Completion Rate (%)\`,
            CASE WHEN cr.id IS NOT NULL THEN 'Sent' ELSE 'Draft' END AS \`Status\`,
            c.id AS \`client_id\`
          FROM clients c
          LEFT JOIN monthly_deliverables md ON c.id = md.client_id AND md.month = ?
          LEFT JOIN client_reports cr ON c.id = cr.client_id AND cr.month = ?
          WHERE c.deleted_at IS NULL AND c.status = 'active'
          GROUP BY c.id
        `;
        params.push(monthFilter, monthFilter, monthFilter);
        break;

      case 'department': {
        const start = startDate || '2000-01-01';
        const end = endDate || '3000-01-01';
        query = `
          SELECT 
            d.code AS \`Department Code\`,
            d.name AS \`Department Name\`,
            COUNT(md.id) AS \`Total Tasks\`,
            SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) AS \`Completed Tasks\`,
            SUM(CASE WHEN md.status != 'completed' THEN 1 ELSE 0 END) AS \`Pending Tasks\`,
            COALESCE(ROUND((SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(md.id), 0)) * 100, 1), 0.0) AS \`Efficiency Rate (%)\`,
            COALESCE(ROUND(SUM(CASE WHEN md.status = 'completed' THEN md.quantity * (COALESCE(at.time_editor, 0) + COALESCE(at.time_content, 0)) ELSE 0 END) / 60, 1), 0.0) AS \`Total Output (Hours)\`
          FROM departments d
          LEFT JOIN monthly_deliverables md ON d.id = md.department_id AND md.due_date BETWEEN ? AND ?
          LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
          WHERE d.deleted_at IS NULL
          GROUP BY d.id
        `;
        params.push(start, end);
        break;
      }

      case 'manager': {
        const start = startDate || '2000-01-01';
        const end = endDate || '3000-01-01';
        query = `
          SELECT 
            m.manager_id_code AS \`Manager ID\`,
            m.full_name AS \`Manager Name\`,
            d.name AS \`Department\`,
            COUNT(md.id) AS \`Total Tasks\`,
            SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) AS \`Completed Tasks\`,
            SUM(CASE WHEN md.status != 'completed' THEN 1 ELSE 0 END) AS \`Pending Tasks\`,
            COALESCE(ROUND((SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(md.id), 0)) * 100, 1), 0.0) AS \`Efficiency Rate (%)\`,
            COALESCE(ROUND(SUM(CASE WHEN md.status = 'completed' THEN md.quantity * (COALESCE(at.time_editor, 0) + COALESCE(at.time_content, 0)) ELSE 0 END) / 60, 1), 0.0) AS \`Team Output (Hours)\`
          FROM managers m
          JOIN users u ON m.user_id = u.id
          JOIN departments d ON m.department_id = d.id
          LEFT JOIN monthly_deliverables md ON m.id = md.assigned_manager_id AND md.due_date BETWEEN ? AND ?
          LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
          WHERE u.deleted_at IS NULL
          GROUP BY m.id
        `;
        params.push(start, end);
        break;
      }

      case 'employee': {
        const start = startDate || '2000-01-01';
        const end = endDate || '3000-01-01';
        query = `
          SELECT 
            e.employee_id_code AS \`Employee ID\`,
            e.full_name AS \`Employee Name\`,
            d.name AS \`Department\`,
            m.full_name AS \`Reporting Manager\`,
            COUNT(md.id) AS \`Total Tasks\`,
            SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) AS \`Completed Tasks\`,
            SUM(CASE WHEN md.status != 'completed' THEN 1 ELSE 0 END) AS \`Pending Tasks\`,
            COALESCE(ROUND((SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(md.id), 0)) * 100, 1), 0.0) AS \`Efficiency Rate (%)\`,
            COALESCE(ROUND(SUM(CASE WHEN md.status = 'completed' THEN md.quantity * (COALESCE(at.time_editor, 0) + COALESCE(at.time_content, 0)) ELSE 0 END) / 60, 1), 0.0) AS \`Employee Output (Hours)\`
          FROM employees e
          JOIN users u ON e.user_id = u.id
          JOIN departments d ON e.department_id = d.id
          LEFT JOIN managers m ON e.reporting_manager_id = m.id
          LEFT JOIN monthly_deliverables md ON e.id = md.assigned_employee_id AND md.due_date BETWEEN ? AND ?
          LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
          WHERE u.deleted_at IS NULL
        `;
        if (departmentId) {
          query += ' AND e.department_id = ?';
          params.push(departmentId);
        }
        query += ' GROUP BY e.id';
        params.push(start, end);
        break;
      }

      case 'project':
        query = `
          SELECT p.*, c.company_name AS client_name, d.name AS department_name, m.full_name AS manager_name
          FROM projects p
          JOIN clients c ON p.client_id = c.id
          JOIN departments d ON p.department_id = d.id
          JOIN managers m ON p.manager_id = m.id
          WHERE p.deleted_at IS NULL
        `;
        if (startDate && endDate) {
          query += ' AND p.start_date BETWEEN ? AND ?';
          params.push(startDate, endDate);
        }
        if (clientId) {
          query += ' AND p.client_id = ?';
          params.push(clientId);
        }
        break;

      case 'deliverables':
        query = `
          SELECT md.*, c.company_name AS client_name, d.name AS department_name, m.full_name AS manager_name, e.full_name AS employee_name
          FROM monthly_deliverables md
          JOIN clients c ON md.client_id = c.id
          JOIN departments d ON md.department_id = d.id
          JOIN managers m ON md.assigned_manager_id = m.id
          JOIN employees e ON md.assigned_employee_id = e.id
          WHERE md.deleted_at IS NULL
        `;
        if (startDate && endDate) {
          query += ' AND md.due_date BETWEEN ? AND ?';
          params.push(startDate, endDate);
        }
        if (clientId) {
          query += ' AND md.client_id = ?';
          params.push(clientId);
        }
        if (employeeId) {
          query += ' AND md.assigned_employee_id = ?';
          params.push(employeeId);
        }
        break;

      case 'daily':
      case 'weekly':
      case 'monthly':
      default:
        // Combined activity/status report
        query = `
          SELECT al.id, al.action, al.description, al.created_at, u.username, u.role
          FROM activity_logs al
          JOIN users u ON al.user_id = u.id
        `;
        if (startDate && endDate) {
          query += ' WHERE al.created_at BETWEEN ? AND ?';
          params.push(startDate + ' 00:00:00', endDate + ' 23:59:59');
        }
        query += ' ORDER BY al.created_at DESC';
        break;
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }

  async getAdminMetrics(date, month) {
    const today = date || new Date().toISOString().split('T')[0];
    const targetMonth = month || new Date().toISOString().substring(0, 7);

    // 1. Stats counts
    const [clients] = await pool.query('SELECT COUNT(*) AS count FROM clients WHERE deleted_at IS NULL AND status = "active"');
    const [departments] = await pool.query('SELECT COUNT(*) AS count FROM departments WHERE deleted_at IS NULL AND status = "active"');
    const [subDepartments] = await pool.query('SELECT COUNT(*) AS count FROM sub_departments');
    const [managers] = await pool.query('SELECT COUNT(*) AS count FROM managers WHERE status = "active"');
    const [employees] = await pool.query('SELECT COUNT(*) AS count FROM employees WHERE status = "active"');
    const [hr] = await pool.query('SELECT COUNT(*) AS count FROM hr WHERE status = "active"');

    // 2. Today's work counts
    const [delivsToday] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('completed', 'posted') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status NOT IN ('completed', 'posted') THEN 1 ELSE 0 END) AS pending
      FROM monthly_deliverables 
      WHERE due_date = ? AND deleted_at IS NULL
    `, [today]);
    
    const [jobsToday] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('completed', 'posted') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status NOT IN ('completed', 'posted') THEN 1 ELSE 0 END) AS pending
      FROM job_works 
      WHERE DATE(deadline) = ?
    `, [today]);

    const totalTodayWork = Number(delivsToday[0].total || 0) + Number(jobsToday[0].total || 0);
    const completedTodayWork = Number(delivsToday[0].completed || 0) + Number(jobsToday[0].completed || 0);
    const pendingTodayWork = Number(delivsToday[0].pending || 0) + Number(jobsToday[0].pending || 0);

    // 3. Today's working clients
    const [workingClients] = await pool.query(`
      SELECT DISTINCT c.company_name
      FROM (
        SELECT client_id FROM monthly_deliverables WHERE due_date = ? AND deleted_at IS NULL
        UNION
        SELECT client_id FROM job_works WHERE DATE(deadline) = ?
      ) t
      JOIN clients c ON t.client_id = c.id
      WHERE c.deleted_at IS NULL AND c.status = 'active'
    `, [today, today]);

    const todayClientsList = workingClients.map(c => c.company_name);

    // 4. Posting done today
    const [postingsDone] = await pool.query(`
      SELECT (
        (SELECT COUNT(*) FROM monthly_deliverables WHERE status = 'posted' AND DATE(posted_at) = ? AND deleted_at IS NULL) +
        (SELECT COUNT(*) FROM job_works WHERE status = 'posted' AND DATE(updated_at) = ?)
      ) AS count
    `, [today, today]);

    const todayPostingsCount = postingsDone[0].count || 0;

    // 5. Monthly postings
    const [delivsMonth] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('completed', 'posted') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status NOT IN ('completed', 'posted') THEN 1 ELSE 0 END) AS pending
      FROM monthly_deliverables 
      WHERE month = ? AND deleted_at IS NULL
    `, [targetMonth]);

    const [jobsMonth] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status IN ('completed', 'posted') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status NOT IN ('completed', 'posted') THEN 1 ELSE 0 END) AS pending
      FROM job_works 
      WHERE DATE_FORMAT(deadline, '%Y-%m') = ?
    `, [targetMonth]);

    const totalMonthlyWork = Number(delivsMonth[0].total || 0) + Number(jobsMonth[0].total || 0);
    const completedMonthlyWork = Number(delivsMonth[0].completed || 0) + Number(jobsMonth[0].completed || 0);
    const pendingMonthlyWork = Number(delivsMonth[0].pending || 0) + Number(jobsMonth[0].pending || 0);

    // 6. Recent activities log (top 100)
    const [recentActivities] = await pool.query(`
      SELECT al.*, u.username, u.role 
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `);

    return {
      stats: {
        totalClients: clients[0].count,
        totalDepartments: departments[0].count,
        totalSubDepartments: subDepartments[0].count,
        totalManagers: managers[0].count,
        totalEmployees: employees[0].count,
        totalHR: hr[0].count
      },
      daily: {
        totalTodayWork,
        completedTodayWork,
        pendingTodayWork,
        todayClientsList,
        todayPostingsCount
      },
      monthly: {
        totalMonthlyWork,
        completedMonthlyWork,
        pendingMonthlyWork
      },
      recentActivities
    };
  }
}

module.exports = new DashboardRepository();
