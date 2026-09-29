const pool = require('../config/db');
const dashboardRepository = require('../repositories/dashboardRepository');

class DashboardService {
  async getDashboardSummary() {
    const stats = await dashboardRepository.getSummaryStats();
    const recentActivities = await dashboardRepository.getRecentActivities(10);
    const upcomingDeadlines = await dashboardRepository.getUpcomingDeadlines(5);
    
    return {
      stats,
      recentActivities,
      upcomingDeadlines
    };
  }

  async getDashboardCharts() {
    const projectProgress = await dashboardRepository.getMonthlyProjectProgress();
    const departmentPerformance = await dashboardRepository.getDepartmentPerformance();
    const employeePerformance = await dashboardRepository.getEmployeePerformance();
    const projectStatus = await dashboardRepository.getProjectStatusDistribution();

    return {
      projectProgress,
      departmentPerformance,
      employeePerformance,
      projectStatus
    };
  }

  async generateReport(options) {
    const { type } = options;
    const data = await dashboardRepository.getReportData(options);

    if (data.length === 0) {
      return { csv: '', data: [] };
    }

    // Generate CSV natively
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add headers row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        // Escape quotes and wrap commas in quotes
        if (val === null || val === undefined) {
          return '';
        }
        const stringVal = String(val);
        if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
          return `"${stringVal.replace(/"/g, '""')}"`;
        }
        return stringVal;
      });
      csvRows.push(values.join(','));
    }

    return {
      csv: csvRows.join('\n'),
      data
    };
  }

  async sendClientReport(clientId, month, adminUserId) {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(md.id) AS total_tasks,
        SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
        SUM(CASE WHEN md.status != 'completed' THEN 1 ELSE 0 END) AS pending_tasks,
        COALESCE(ROUND((SUM(CASE WHEN md.status = 'completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(md.id), 0)) * 100, 2), 0.0) AS efficiency_rate,
        COALESCE(ROUND(SUM(CASE WHEN md.status = 'completed' THEN md.quantity * (COALESCE(at.time_editor, 0) + COALESCE(at.time_content, 0)) ELSE 0 END) / 60, 2), 0.0) AS total_hours
      FROM monthly_deliverables md
      LEFT JOIN activity_types at ON md.activity_type_code = at.activity_type_code
      WHERE md.client_id = ? AND md.month = ? AND md.deleted_at IS NULL
    `, [clientId, month]);

    const statsRow = stats[0] || {};
    const total_tasks = statsRow.total_tasks || 0;
    const completed_tasks = statsRow.completed_tasks || 0;
    const pending_tasks = statsRow.pending_tasks || 0;
    const efficiency_rate = statsRow.efficiency_rate || 0.0;
    const total_hours = statsRow.total_hours || 0.0;

    await pool.query(`
      INSERT INTO client_reports (client_id, month, total_tasks, completed_tasks, pending_tasks, efficiency_rate, total_hours, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        total_tasks = VALUES(total_tasks),
        completed_tasks = VALUES(completed_tasks),
        pending_tasks = VALUES(pending_tasks),
        efficiency_rate = VALUES(efficiency_rate),
        total_hours = VALUES(total_hours),
        created_by = VALUES(created_by),
        sent_at = CURRENT_TIMESTAMP
    `, [clientId, month, total_tasks, completed_tasks, pending_tasks, efficiency_rate, total_hours, adminUserId]);
  }

  async sendSuperAdminReport({ reportType, title, monthOrRange, reportData, sentBy }) {
    await pool.query(`
      INSERT INTO superadmin_reports (report_type, title, month_or_range, report_data, sent_by)
      VALUES (?, ?, ?, ?, ?)
    `, [reportType, title, monthOrRange, reportData, sentBy]);
  }

  async getSuperAdminReportsList() {
    const [rows] = await pool.query(`
      SELECT r.id, r.report_type, r.title, r.month_or_range, r.report_data, r.sent_at, u.username AS sent_by_username, u.branch_id AS branch_id
      FROM superadmin_reports r
      JOIN users u ON r.sent_by = u.id
      ORDER BY r.id DESC
    `);
    return rows;
  }

  async getSuperAdminReportDetail(reportId) {
    const [rows] = await pool.query(`
      SELECT r.id, r.report_type, r.title, r.month_or_range, r.report_data, r.sent_at, u.username AS sent_by_username, u.branch_id AS branch_id
      FROM superadmin_reports r
      JOIN users u ON r.sent_by = u.id
      WHERE r.id = ?
    `, [reportId]);

    if (rows.length === 0) {
      const error = new Error('Report not found.');
      error.statusCode = 404;
      throw error;
    }

    return rows[0];
  }

  async getReportsSummary({ month, date }) {
    const targetMonth = month || new Date().toISOString().substring(0, 7);
    const targetDate = date || new Date().toISOString().substring(0, 10);

    // 1. Fetch all active clients
    const [clients] = await pool.query(
      'SELECT id, company_name, client_id_code FROM clients WHERE status = "active" AND deleted_at IS NULL ORDER BY company_name ASC'
    );

    // 1b. Fetch all active departments
    const [departments] = await pool.query(
      'SELECT id, name, code, description FROM departments WHERE status = "active" AND deleted_at IS NULL ORDER BY name ASC'
    );

    // 2. Fetch monthly deliverables stats
    const [mdStats] = await pool.query(`
      SELECT client_id, 
        COUNT(id) AS total,
        SUM(CASE WHEN status IN ('posted', 'completed') THEN 1 ELSE 0 END) AS posted,
        SUM(CASE WHEN status NOT IN ('posted', 'completed') THEN 1 ELSE 0 END) AS pending
      FROM monthly_deliverables
      WHERE month = ? AND deleted_at IS NULL
      GROUP BY client_id
    `, [targetMonth]);

    // 3. Fetch job works stats
    const [jwStats] = await pool.query(`
      SELECT client_id,
        COUNT(id) AS total,
        SUM(CASE WHEN status IN ('completed', 'posted') THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status NOT IN ('completed', 'posted') THEN 1 ELSE 0 END) AS pending
      FROM job_works
      WHERE DATE_FORMAT(deadline, '%Y-%m') = ?
      GROUP BY client_id
    `, [targetMonth]);

    // 4. Fetch content calendar stats
    const [ccStats] = await pool.query(`
      SELECT client_id,
        COUNT(id) AS total,
        SUM(CASE WHEN submission_status = 'approved' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN submission_status != 'approved' THEN 1 ELSE 0 END) AS pending
      FROM content_calendar
      WHERE month = ?
      GROUP BY client_id
    `, [targetMonth]);

    // 5. Fetch daily deliverables
    const [dailyMD] = await pool.query(`
      SELECT md.id, md.client_id, md.deliverable, md.activity_code, md.status, md.due_date, md.posted_at
      FROM monthly_deliverables md
      WHERE md.due_date = ? AND md.deleted_at IS NULL
    `, [targetDate]);

    // 6. Fetch daily job works
    const [dailyJW] = await pool.query(`
      SELECT jw.id, jw.client_id, jw.activity_type_code AS deliverable, jw.activity_code, jw.status, DATE(jw.deadline) AS due_date, jw.assigned_at, jw.completed_at
      FROM job_works jw
      WHERE DATE(jw.deadline) = ?
    `, [targetDate]);

    // 7. Fetch daily content calendar
    const [dailyCC] = await pool.query(`
      SELECT cc.id, cc.client_id, cc.title, cc.activity_code, cc.status, cc.submission_status, cc.date AS due_date
      FROM content_calendar cc
      WHERE cc.date = ?
    `, [targetDate]);

    // 7b. Fetch monthly deliverables list details
    const [monthlyMD] = await pool.query(`
      SELECT md.id, md.client_id, md.deliverable, md.activity_code, md.status, md.due_date, md.posted_at
      FROM monthly_deliverables md
      WHERE md.month = ? AND md.deleted_at IS NULL
    `, [targetMonth]);

    // 7c. Fetch monthly job works list details
    const [monthlyJW] = await pool.query(`
      SELECT jw.id, jw.client_id, jw.activity_type_code AS deliverable, jw.activity_code, jw.status, DATE(jw.deadline) AS due_date, jw.assigned_at, jw.completed_at
      FROM job_works jw
      WHERE DATE_FORMAT(jw.deadline, '%Y-%m') = ?
    `, [targetMonth]);

    // 8. Fetch global event days
    const [eventDaysToday] = await pool.query(`
      SELECT id, title, description, event_type, status, submission_status
      FROM event_days
      WHERE date = ?
    `, [targetDate]);

    const [eventDaysMonth] = await pool.query(`
      SELECT id, date, title, description, event_type, status, submission_status
      FROM event_days
      WHERE month = ?
      ORDER BY date ASC
    `, [targetMonth]);

    // Maps
    const mdMap = {};
    mdStats.forEach(s => mdMap[s.client_id] = s);
    const jwMap = {};
    jwStats.forEach(s => jwMap[s.client_id] = s);
    const ccMap = {};
    ccStats.forEach(s => ccMap[s.client_id] = s);

    // Group daily works
    const dailyMDMap = {};
    dailyMD.forEach(item => {
      if (!dailyMDMap[item.client_id]) dailyMDMap[item.client_id] = [];
      dailyMDMap[item.client_id].push(item);
    });
    const dailyJWMap = {};
    dailyJW.forEach(item => {
      if (!dailyJWMap[item.client_id]) dailyJWMap[item.client_id] = [];
      dailyJWMap[item.client_id].push(item);
    });
    const dailyCCMap = {};
    dailyCC.forEach(item => {
      if (!dailyCCMap[item.client_id]) dailyCCMap[item.client_id] = [];
      dailyCCMap[item.client_id].push(item);
    });

    // Group monthly works
    const monthlyMDMap = {};
    monthlyMD.forEach(item => {
      if (!monthlyMDMap[item.client_id]) monthlyMDMap[item.client_id] = [];
      monthlyMDMap[item.client_id].push(item);
    });
    const monthlyJWMap = {};
    monthlyJW.forEach(item => {
      if (!monthlyJWMap[item.client_id]) monthlyJWMap[item.client_id] = [];
      monthlyJWMap[item.client_id].push(item);
    });

    const clientReports = clients.map(client => {
      const cId = client.id;
      return {
        id: client.id,
        company_name: client.company_name,
        client_id_code: client.client_id_code,
        monthlyStats: {
          deliverables: mdMap[cId] || { total: 0, posted: 0, pending: 0 },
          jobWorks: jwMap[cId] || { total: 0, completed: 0, pending: 0 },
          contentCalendar: ccMap[cId] || { total: 0, completed: 0, pending: 0 }
        },
        dailyWorks: {
          deliverables: dailyMDMap[cId] || [],
          jobWorks: dailyJWMap[cId] || [],
          contentCalendar: dailyCCMap[cId] || []
        },
        monthlyWorks: {
          deliverables: monthlyMDMap[cId] || [],
          jobWorks: monthlyJWMap[cId] || []
        }
      };
    });

    return {
      clients: clientReports,
      departments,
      eventDaysToday,
      eventDaysMonth
    };
  }

  async getAdminMetrics(date, month) {
    return await dashboardRepository.getAdminMetrics(date, month);
  }
}

module.exports = new DashboardService();
